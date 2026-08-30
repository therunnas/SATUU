import type { Account, Budget, Fringe, LineItem, Section, SectionKind } from './types'

/**
 * Núcleo financeiro do orçamento.
 *
 * Todo número que a interface mostra sai daqui. Nenhum componente calcula por
 * conta própria — é o que impede o topsheet, a tabela detalhada e o resumo de
 * divergirem entre si.
 *
 * Tudo em centavos e aritmética inteira. Valor de produção passa por muitas
 * somas encadeadas, e ponto flutuante acumula erro que aparece justamente no
 * total geral, onde é mais caro descobrir.
 */

export interface Totals {
  /** Custo direto, antes dos encargos. */
  base: number
  /** Soma dos fringes que incidem. */
  fringes: number
  /** base + fringes. */
  total: number
}

const ZERO: Totals = { base: 0, fringes: 0, total: 0 }

const add = (a: Totals, b: Totals): Totals => ({
  base: a.base + b.base,
  fringes: a.fringes + b.fringes,
  total: a.total + b.total,
})

/** Custo direto da linha: quantidade × unidades × valor unitário. */
export function lineBase(line: LineItem): number {
  return line.quantity * line.units * line.unitCents
}

/**
 * Encargos da linha. Cada fringe incide sobre a base, nunca sobre outro fringe
 * — encargo sobre encargo inflaria o orçamento em cascata.
 *
 * Arredonda por fringe, não no fim: é assim que a contabilidade fecha, porque
 * cada encargo vira uma guia própria com o seu próprio centavo.
 */
export function lineFringes(line: LineItem, fringes: Fringe[]): number {
  const base = lineBase(line)
  return line.fringeIds.reduce((sum, id) => {
    const fringe = fringes.find((f) => f.id === id)
    return fringe ? sum + Math.round(base * fringe.rate) : sum
  }, 0)
}

export function lineTotals(line: LineItem, fringes: Fringe[]): Totals {
  const base = lineBase(line)
  const encargos = lineFringes(line, fringes)
  return { base, fringes: encargos, total: base + encargos }
}

export function accountTotals(account: Account, fringes: Fringe[]): Totals {
  return account.lines.reduce((acc, line) => add(acc, lineTotals(line, fringes)), ZERO)
}

export function sectionTotals(section: Section, fringes: Fringe[]): Totals {
  return section.accounts.reduce((acc, account) => add(acc, accountTotals(account, fringes)), ZERO)
}

/** Subtotal de uma seção pelo tipo, útil quando só se tem o orçamento em mãos. */
export function totalsForKind(budget: Budget, kind: SectionKind): Totals {
  return budget.sections
    .filter((s) => s.kind === kind)
    .reduce((acc, section) => add(acc, sectionTotals(section, budget.fringes)), ZERO)
}

export function budgetTotals(budget: Budget): Totals {
  return budget.sections.reduce((acc, section) => add(acc, sectionTotals(section, budget.fringes)), ZERO)
}

export interface TopsheetRow {
  accountId: string
  code: string
  name: string
  kind: SectionKind
  totals: Totals
  /** Participação no total geral, em fração decimal. Zero se o orçamento é zero. */
  share: number
}

/**
 * Resumo de uma página: uma linha por conta, com a participação de cada uma no
 * total. É a visão que o produtor manda para o financiador.
 */
export function topsheet(budget: Budget): TopsheetRow[] {
  const geral = budgetTotals(budget).total
  return budget.sections.flatMap((section) =>
    section.accounts.map((account) => {
      const totals = accountTotals(account, budget.fringes)
      return {
        accountId: account.id,
        code: account.code,
        name: account.name,
        kind: section.kind,
        totals,
        share: geral === 0 ? 0 : totals.total / geral,
      }
    }),
  )
}

/** As contas mais caras primeiro — onde cortar quando o orçamento não fecha. */
export function heaviestAccounts(budget: Budget, limit = 5): TopsheetRow[] {
  return [...topsheet(budget)].sort((a, b) => b.totals.total - a.totals.total).slice(0, limit)
}

/**
 * Quanto cada fringe representa no orçamento inteiro. Serve para o produtor ver
 * o peso dos encargos, que costuma surpreender quem orça só o custo direto.
 */
export function fringeBreakdown(budget: Budget): Array<{ fringe: Fringe; amount: number }> {
  return budget.fringes.map((fringe) => {
    const amount = budget.sections.reduce(
      (sum, section) =>
        sum +
        section.accounts.reduce(
          (s, account) =>
            s +
            account.lines.reduce(
              (t, line) =>
                line.fringeIds.includes(fringe.id) ? t + Math.round(lineBase(line) * fringe.rate) : t,
              0,
            ),
          0,
        ),
      0,
    )
    return { fringe, amount }
  })
}
