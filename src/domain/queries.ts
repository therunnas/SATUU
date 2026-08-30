import type {
  Budget,
  Client,
  Database,
  Expense,
  Project,
  ProjectStatus,
} from './types'
import { accountTotals, budgetTotals, topsheet } from './calc'

/**
 * Seletores sobre a base inteira.
 *
 * `calc.ts` faz a matemática de um orçamento isolado. Aqui em cima ficam as
 * perguntas que atravessam entidades: quanto este projeto já consumiu, quanto a
 * produtora tem em produção, o que este cliente já rendeu.
 *
 * Como em `calc.ts`, tudo é função pura e tudo é centavo. Nenhuma tela calcula
 * por conta própria — é o que impede dois lugares da aplicação mostrarem
 * números diferentes para a mesma pergunta.
 */

/* ------------------------------------------------------------ busca */

export const projectById = (db: Database, id: string): Project | undefined =>
  db.projects.find((p) => p.id === id)

export const clientById = (db: Database, id: string): Client | undefined =>
  db.clients.find((c) => c.id === id)

export const userById = (db: Database, id: string) => db.users.find((u) => u.id === id)

/**
 * O orçamento que vale para o projeto. É contra o aprovado que o custo é
 * medido; se ainda não houver aprovado, cai no mais recente que existir.
 */
export function activeBudget(db: Database, projectId: string): Budget | undefined {
  const doProjeto = db.budgets.filter((b) => b.projectId === projectId)
  return doProjeto.find((b) => b.status === 'aprovado') ?? doProjeto.at(-1)
}

export const budgetsOfProject = (db: Database, projectId: string): Budget[] =>
  db.budgets.filter((b) => b.projectId === projectId)

export const expensesOfProject = (db: Database, projectId: string): Expense[] =>
  db.expenses.filter((e) => e.projectId === projectId)

export const projectsOfClient = (db: Database, clientId: string): Project[] =>
  db.projects.filter((p) => p.clientId === clientId)

/* ------------------------------------------------------------ despesas */

/**
 * Uma despesa recusada não representa dinheiro comprometido, então fica fora de
 * qualquer soma de custo. Pendente entra: o compromisso existe mesmo antes da
 * aprovação, e ignorá-lo faria o saldo parecer maior do que é.
 */
export const countsAsCost = (e: Expense): boolean => e.status !== 'recusada'

export const spentOnProject = (db: Database, projectId: string): number =>
  expensesOfProject(db, projectId)
    .filter(countsAsCost)
    .reduce((s, e) => s + e.amountCents, 0)

/** Só o que efetivamente saiu do caixa. */
export const paidOnProject = (db: Database, projectId: string): number =>
  expensesOfProject(db, projectId)
    .filter((e) => e.status === 'paga')
    .reduce((s, e) => s + e.amountCents, 0)

export const pendingApproval = (db: Database): Expense[] =>
  db.expenses.filter((e) => e.status === 'pendente')

/* ------------------------------------------------------------ rastreamento */

export interface CostRow {
  accountCode: string
  accountName: string
  /** O que o orçamento aprovado previu para esta conta. */
  budgeted: number
  /** O que já foi lançado contra ela. */
  spent: number
  /** budgeted − spent. Negativo significa estouro. */
  balance: number
  /** spent ÷ budgeted. Zero quando nada foi orçado. */
  consumed: number
  /** Verdadeiro quando a conta passou do que foi orçado. */
  over: boolean
}

/**
 * Orçado × realizado, conta a conta.
 *
 * Inclui contas com despesa e sem orçamento — é justamente o caso que o
 * produtor precisa enxergar, porque significa gasto fora do previsto.
 */
export function costTracking(db: Database, projectId: string): CostRow[] {
  const budget = activeBudget(db, projectId)
  const despesas = expensesOfProject(db, projectId).filter(countsAsCost)

  const linhas = new Map<string, CostRow>()

  if (budget) {
    for (const section of budget.sections) {
      for (const account of section.accounts) {
        linhas.set(account.code, {
          accountCode: account.code,
          accountName: account.name,
          budgeted: accountTotals(account, budget.fringes).total,
          spent: 0,
          balance: 0,
          consumed: 0,
          over: false,
        })
      }
    }
  }

  for (const despesa of despesas) {
    const atual = linhas.get(despesa.accountCode)
    if (atual) {
      atual.spent += despesa.amountCents
    } else {
      linhas.set(despesa.accountCode, {
        accountCode: despesa.accountCode,
        accountName: 'Fora do orçamento',
        budgeted: 0,
        spent: despesa.amountCents,
        balance: 0,
        consumed: 0,
        over: true,
      })
    }
  }

  return [...linhas.values()]
    .map((row) => ({
      ...row,
      balance: row.budgeted - row.spent,
      consumed: row.budgeted === 0 ? 0 : row.spent / row.budgeted,
      over: row.spent > row.budgeted,
    }))
    .sort((a, b) => a.accountCode.localeCompare(b.accountCode))
}

export interface CostSummary {
  budgeted: number
  spent: number
  paid: number
  balance: number
  consumed: number
  /** Contas que já passaram do orçado. */
  overAccounts: number
}

export function costSummary(db: Database, projectId: string): CostSummary {
  const budget = activeBudget(db, projectId)
  const budgeted = budget ? budgetTotals(budget).total : 0
  const spent = spentOnProject(db, projectId)
  return {
    budgeted,
    spent,
    paid: paidOnProject(db, projectId),
    balance: budgeted - spent,
    consumed: budgeted === 0 ? 0 : spent / budgeted,
    overAccounts: costTracking(db, projectId).filter((r) => r.over).length,
  }
}

/* ------------------------------------------------------------ produtora */

const EM_ANDAMENTO: ProjectStatus[] = ['orcamento', 'pre_producao', 'producao', 'pos_producao']

export const activeProjects = (db: Database): Project[] =>
  db.projects.filter((p) => EM_ANDAMENTO.includes(p.status))

export interface OrgSummary {
  /** Soma dos orçamentos ativos dos projetos em andamento. */
  budgeted: number
  spent: number
  balance: number
  activeCount: number
  deliveredCount: number
  pendingExpenses: number
  pendingAmount: number
}

export function orgSummary(db: Database): OrgSummary {
  const ativos = activeProjects(db)
  const budgeted = ativos.reduce((s, p) => {
    const b = activeBudget(db, p.id)
    return s + (b ? budgetTotals(b).total : 0)
  }, 0)
  const spent = ativos.reduce((s, p) => s + spentOnProject(db, p.id), 0)
  const pendentes = pendingApproval(db)

  return {
    budgeted,
    spent,
    balance: budgeted - spent,
    activeCount: ativos.length,
    deliveredCount: db.projects.filter((p) => p.status === 'entregue').length,
    pendingExpenses: pendentes.length,
    pendingAmount: pendentes.reduce((s, e) => s + e.amountCents, 0),
  }
}

/** Quanto cada cliente representa em orçamento contratado. */
export function clientTotals(db: Database, clientId: string): { budgeted: number; projects: number } {
  const projetos = projectsOfClient(db, clientId)
  return {
    projects: projetos.length,
    budgeted: projetos.reduce((s, p) => {
      const b = activeBudget(db, p.id)
      return s + (b ? budgetTotals(b).total : 0)
    }, 0),
  }
}

/** As contas mais pesadas do projeto, para a visão geral apontar onde o dinheiro está. */
export function heaviestOfProject(db: Database, projectId: string, limit = 5) {
  const budget = activeBudget(db, projectId)
  if (!budget) return []
  return [...topsheet(budget)].sort((a, b) => b.totals.total - a.totals.total).slice(0, limit)
}
