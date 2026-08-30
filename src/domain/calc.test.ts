import { describe, expect, it } from 'vitest'
import {
  accountTotals,
  budgetTotals,
  fringeBreakdown,
  heaviestAccounts,
  lineBase,
  lineFringes,
  lineTotals,
  topsheet,
  totalsForKind,
} from './calc'
import { budgetSeed } from './seed'
import type { Budget, Fringe, LineItem } from './types'

const encargos: Fringe = { id: 'e', name: 'Encargos', rate: 0.2 }
const sindicato: Fringe = { id: 's', name: 'Sindicato', rate: 0.05 }
const fringes = [encargos, sindicato]

const linha = (over: Partial<LineItem> = {}): LineItem => ({
  id: 'l1',
  description: 'Linha',
  quantity: 1,
  units: 1,
  unitKind: 'diaria',
  unitCents: 100_00,
  fringeIds: [],
  ...over,
})

describe('lineBase', () => {
  it('multiplica quantidade, unidades e valor unitário', () => {
    expect(lineBase(linha({ quantity: 2, units: 30, unitCents: 750_00 }))).toBe(45_000_00)
  })

  it('devolve zero quando qualquer fator é zero', () => {
    expect(lineBase(linha({ quantity: 0 }))).toBe(0)
    expect(lineBase(linha({ units: 0 }))).toBe(0)
    expect(lineBase(linha({ unitCents: 0 }))).toBe(0)
  })
})

describe('lineFringes', () => {
  it('soma cada fringe aplicável sobre a base', () => {
    const l = linha({ unitCents: 1_000_00, fringeIds: ['e', 's'] })
    // 100000 centavos × (0,20 + 0,05)
    expect(lineFringes(l, fringes)).toBe(250_00)
  })

  it('não cobra encargo sobre encargo', () => {
    const l = linha({ unitCents: 1_000_00, fringeIds: ['e', 's'] })
    const sobreBase = Math.round(100_000 * 0.2) + Math.round(100_000 * 0.05)
    expect(lineFringes(l, fringes)).toBe(sobreBase)
    // Em cascata daria 100000×1,2×1,05 − 100000 = 26000, e não é isso.
    expect(lineFringes(l, fringes)).not.toBe(260_00)
  })

  it('ignora id de fringe que não existe no orçamento', () => {
    const l = linha({ unitCents: 1_000_00, fringeIds: ['e', 'inexistente'] })
    expect(lineFringes(l, fringes)).toBe(200_00)
  })

  it('devolve zero quando a linha não tem fringe', () => {
    expect(lineFringes(linha({ unitCents: 999_99 }), fringes)).toBe(0)
  })

  it('arredonda cada fringe para o centavo', () => {
    // base 333 centavos × 0,20 = 66,6 → 67
    const l = linha({ unitCents: 3_33, fringeIds: ['e'] })
    expect(lineFringes(l, fringes)).toBe(67)
  })
})

describe('lineTotals', () => {
  it('total é base mais fringes', () => {
    const l = linha({ quantity: 2, units: 10, unitCents: 500_00, fringeIds: ['e'] })
    const t = lineTotals(l, fringes)
    expect(t.base).toBe(10_000_00)
    expect(t.fringes).toBe(2_000_00)
    expect(t.total).toBe(t.base + t.fringes)
  })
})

describe('accountTotals', () => {
  it('soma as linhas da conta', () => {
    const conta = {
      id: 'a1',
      code: '1000',
      name: 'Conta',
      lines: [
        linha({ id: 'x', unitCents: 100_00, fringeIds: ['e'] }),
        linha({ id: 'y', unitCents: 200_00 }),
      ],
    }
    const t = accountTotals(conta, fringes)
    expect(t.base).toBe(300_00)
    expect(t.fringes).toBe(20_00)
    expect(t.total).toBe(320_00)
  })

  it('conta sem linhas soma zero', () => {
    expect(accountTotals({ id: 'a', code: '0', name: 'Vazia', lines: [] }, fringes)).toEqual({
      base: 0,
      fringes: 0,
      total: 0,
    })
  })
})

describe('budgetTotals sobre o orçamento de exemplo', () => {
  it('ATL mais BTL fecha exatamente o total geral', () => {
    const atl = totalsForKind(budgetSeed, 'atl')
    const btl = totalsForKind(budgetSeed, 'btl')
    const geral = budgetTotals(budgetSeed)

    expect(atl.total + btl.total).toBe(geral.total)
    expect(atl.base + btl.base).toBe(geral.base)
    expect(atl.fringes + btl.fringes).toBe(geral.fringes)
  })

  it('o total é a soma das contas do topsheet', () => {
    const somaDasContas = topsheet(budgetSeed).reduce((s, r) => s + r.totals.total, 0)
    expect(somaDasContas).toBe(budgetTotals(budgetSeed).total)
  })

  it('o orçamento de exemplo não é vazio', () => {
    expect(budgetTotals(budgetSeed).total).toBeGreaterThan(0)
    expect(budgetTotals(budgetSeed).fringes).toBeGreaterThan(0)
  })
})

describe('topsheet', () => {
  it('as participações somam 100%', () => {
    const soma = topsheet(budgetSeed).reduce((s, r) => s + r.share, 0)
    expect(soma).toBeCloseTo(1, 10)
  })

  it('não divide por zero quando o orçamento é vazio', () => {
    const vazio: Budget = {
      ...budgetSeed,
      sections: [{ kind: 'atl', name: 'Vazia', accounts: [{ id: 'a', code: '0', name: 'X', lines: [] }] }],
    }
    expect(topsheet(vazio)[0].share).toBe(0)
  })

  it('devolve uma linha por conta, marcando a seção', () => {
    const linhas = topsheet(budgetSeed)
    const contas = budgetSeed.sections.flatMap((s) => s.accounts)
    expect(linhas).toHaveLength(contas.length)
    expect(linhas.filter((l) => l.kind === 'atl').length).toBeGreaterThan(0)
    expect(linhas.filter((l) => l.kind === 'btl').length).toBeGreaterThan(0)
  })
})

describe('heaviestAccounts', () => {
  it('ordena da conta mais cara para a mais barata', () => {
    const top = heaviestAccounts(budgetSeed, 4)
    expect(top).toHaveLength(4)
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].totals.total).toBeGreaterThanOrEqual(top[i].totals.total)
    }
  })
})

describe('fringeBreakdown', () => {
  it('a soma dos fringes bate com o total de fringes do orçamento', () => {
    const soma = fringeBreakdown(budgetSeed).reduce((s, f) => s + f.amount, 0)
    expect(soma).toBe(budgetTotals(budgetSeed).fringes)
  })

  it('devolve uma entrada por fringe declarado', () => {
    expect(fringeBreakdown(budgetSeed)).toHaveLength(budgetSeed.fringes.length)
  })
})
