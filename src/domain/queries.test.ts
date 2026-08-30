import { describe, expect, it } from 'vitest'
import {
  activeBudget,
  activeProjects,
  clientTotals,
  costSummary,
  costTracking,
  countsAsCost,
  expensesOfProject,
  orgSummary,
  paidOnProject,
  pendingApproval,
  projectsOfClient,
  spentOnProject,
} from './queries'
import { budgetTotals } from './calc'
import { seed } from './seed'
import type { Database, Expense } from './types'

const gasto = (over: Partial<Expense> = {}): Expense => ({
  id: 'e-teste',
  projectId: 'prj-001',
  accountCode: '2200',
  description: 'Teste',
  supplier: 'Fornecedor',
  date: '2026-07-01',
  amountCents: 100_00,
  status: 'aprovada',
  userId: 'usr-001',
  ...over,
})

describe('countsAsCost', () => {
  it('recusada não é dinheiro comprometido', () => {
    expect(countsAsCost(gasto({ status: 'recusada' }))).toBe(false)
  })

  it('pendente conta: o compromisso existe antes da aprovação', () => {
    expect(countsAsCost(gasto({ status: 'pendente' }))).toBe(true)
  })

  it('aprovada e paga contam', () => {
    expect(countsAsCost(gasto({ status: 'aprovada' }))).toBe(true)
    expect(countsAsCost(gasto({ status: 'paga' }))).toBe(true)
  })
})

describe('spentOnProject', () => {
  it('soma tudo menos as recusadas', () => {
    const db: Database = {
      ...seed,
      expenses: [
        gasto({ id: 'a', amountCents: 500_00, status: 'paga' }),
        gasto({ id: 'b', amountCents: 300_00, status: 'pendente' }),
        gasto({ id: 'c', amountCents: 999_00, status: 'recusada' }),
      ],
    }
    expect(spentOnProject(db, 'prj-001')).toBe(800_00)
  })

  it('paidOnProject conta só o que saiu do caixa', () => {
    const db: Database = {
      ...seed,
      expenses: [
        gasto({ id: 'a', amountCents: 500_00, status: 'paga' }),
        gasto({ id: 'b', amountCents: 300_00, status: 'aprovada' }),
      ],
    }
    expect(paidOnProject(db, 'prj-001')).toBe(500_00)
  })

  it('projeto sem despesa soma zero', () => {
    expect(spentOnProject({ ...seed, expenses: [] }, 'prj-001')).toBe(0)
  })
})

describe('activeBudget', () => {
  it('prefere o aprovado', () => {
    const b = activeBudget(seed, 'prj-001')
    expect(b?.status).toBe('aprovado')
  })

  it('devolve indefinido para projeto sem orçamento', () => {
    expect(activeBudget({ ...seed, budgets: [] }, 'prj-001')).toBeUndefined()
  })
})

describe('costTracking', () => {
  it('cruza a despesa com a conta do orçamento', () => {
    const db: Database = { ...seed, expenses: [gasto({ accountCode: '2200', amountCents: 1_000_00 })] }
    const linha = costTracking(db, 'prj-001').find((r) => r.accountCode === '2200')
    expect(linha?.spent).toBe(1_000_00)
    expect(linha?.balance).toBe(linha!.budgeted - 1_000_00)
  })

  it('mostra gasto em conta que o orçamento não previu', () => {
    const db: Database = { ...seed, expenses: [gasto({ accountCode: '9999', amountCents: 700_00 })] }
    const linha = costTracking(db, 'prj-001').find((r) => r.accountCode === '9999')
    expect(linha).toBeDefined()
    expect(linha?.budgeted).toBe(0)
    expect(linha?.over).toBe(true)
    expect(linha?.accountName).toBe('Fora do orçamento')
  })

  it('não divide por zero quando nada foi orçado na conta', () => {
    const db: Database = { ...seed, expenses: [gasto({ accountCode: '9999' })] }
    expect(costTracking(db, 'prj-001').find((r) => r.accountCode === '9999')?.consumed).toBe(0)
  })

  it('marca estouro só quando o realizado passa do orçado', () => {
    const orcado = costTracking({ ...seed, expenses: [] }, 'prj-001').find((r) => r.accountCode === '2200')!
    const abaixo: Database = { ...seed, expenses: [gasto({ amountCents: orcado.budgeted - 100 })] }
    const acima: Database = { ...seed, expenses: [gasto({ amountCents: orcado.budgeted + 100 })] }
    expect(costTracking(abaixo, 'prj-001').find((r) => r.accountCode === '2200')?.over).toBe(false)
    expect(costTracking(acima, 'prj-001').find((r) => r.accountCode === '2200')?.over).toBe(true)
  })

  it('a despesa recusada não entra no realizado', () => {
    const db: Database = { ...seed, expenses: [gasto({ amountCents: 900_00, status: 'recusada' })] }
    expect(costTracking(db, 'prj-001').find((r) => r.accountCode === '2200')?.spent).toBe(0)
  })

  it('vem ordenado pelo código da conta', () => {
    const codigos = costTracking(seed, 'prj-001').map((r) => r.accountCode)
    expect(codigos).toEqual([...codigos].sort((a, b) => a.localeCompare(b)))
  })
})

describe('costSummary', () => {
  it('orçado é o total do orçamento ativo', () => {
    const orcamento = activeBudget(seed, 'prj-001')!
    expect(costSummary(seed, 'prj-001').budgeted).toBe(budgetTotals(orcamento).total)
  })

  it('saldo é orçado menos comprometido', () => {
    const r = costSummary(seed, 'prj-001')
    expect(r.balance).toBe(r.budgeted - r.spent)
  })

  it('o comprometido bate com a soma das despesas que contam', () => {
    const soma = expensesOfProject(seed, 'prj-001')
      .filter(countsAsCost)
      .reduce((s, e) => s + e.amountCents, 0)
    expect(costSummary(seed, 'prj-001').spent).toBe(soma)
  })

  it('projeto sem orçamento não quebra nem divide por zero', () => {
    const r = costSummary({ ...seed, budgets: [] }, 'prj-001')
    expect(r.budgeted).toBe(0)
    expect(r.consumed).toBe(0)
  })
})

describe('orgSummary', () => {
  it('conta só os projetos em andamento no orçado', () => {
    const r = orgSummary(seed)
    const esperado = activeProjects(seed).reduce((s, p) => {
      const b = activeBudget(seed, p.id)
      return s + (b ? budgetTotals(b).total : 0)
    }, 0)
    expect(r.budgeted).toBe(esperado)
  })

  it('entregue não conta como ativo, mas entra no histórico', () => {
    const entregues = seed.projects.filter((p) => p.status === 'entregue')
    expect(entregues.length).toBeGreaterThan(0)
    expect(activeProjects(seed).some((p) => p.status === 'entregue')).toBe(false)
    expect(orgSummary(seed).deliveredCount).toBe(entregues.length)
  })

  it('o valor pendente bate com as despesas pendentes', () => {
    const soma = pendingApproval(seed).reduce((s, e) => s + e.amountCents, 0)
    expect(orgSummary(seed).pendingAmount).toBe(soma)
    expect(orgSummary(seed).pendingExpenses).toBe(pendingApproval(seed).length)
  })
})

describe('clientTotals', () => {
  it('soma os orçamentos dos projetos do cliente', () => {
    const cliente = seed.clients[0]
    const esperado = projectsOfClient(seed, cliente.id).reduce((s, p) => {
      const b = activeBudget(seed, p.id)
      return s + (b ? budgetTotals(b).total : 0)
    }, 0)
    expect(clientTotals(seed, cliente.id).budgeted).toBe(esperado)
  })

  it('cliente sem projeto soma zero', () => {
    expect(clientTotals(seed, 'cli-inexistente')).toEqual({ budgeted: 0, projects: 0 })
  })
})

describe('o seed sustenta as telas', () => {
  it('tem produtora, clientes, projetos, orçamentos e despesas', () => {
    expect(seed.organization.name).toBeTruthy()
    expect(seed.clients.length).toBeGreaterThan(0)
    expect(seed.projects.length).toBeGreaterThan(0)
    expect(seed.budgets.length).toBeGreaterThan(0)
    expect(seed.expenses.length).toBeGreaterThan(0)
  })

  it('todo projeto aponta para um cliente que existe', () => {
    for (const p of seed.projects) {
      expect(seed.clients.some((c) => c.id === p.clientId)).toBe(true)
    }
  })

  it('todo orçamento aponta para um projeto que existe', () => {
    for (const b of seed.budgets) {
      expect(seed.projects.some((p) => p.id === b.projectId)).toBe(true)
    }
  })

  it('toda despesa aponta para um projeto e um usuário que existem', () => {
    for (const e of seed.expenses) {
      expect(seed.projects.some((p) => p.id === e.projectId)).toBe(true)
      expect(seed.users.some((u) => u.id === e.userId)).toBe(true)
    }
  })
})
