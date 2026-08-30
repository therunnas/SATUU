import type { UnitKind } from '../domain/types'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Centavos para moeda: 12345 vira "R$ 123,45". */
export const money = (cents: number): string => BRL.format(cents / 100)

/** Versão curta para cabeçalhos e cartões: "R$ 1,2 mi". */
export const moneyCompact = (cents: number): string => BRL_COMPACT.format(cents / 100)

/** Fração decimal para percentual: 0.204 vira "20,4%". */
export const percent = (fraction: number, digits = 1): string =>
  `${(fraction * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`

const UNIT_LABEL: Record<UnitKind, [singular: string, plural: string]> = {
  diaria: ['diária', 'diárias'],
  semana: ['semana', 'semanas'],
  mes: ['mês', 'meses'],
  cache: ['cachê', 'cachês'],
  verba: ['verba', 'verbas'],
  unidade: ['un.', 'un.'],
}

export const unitLabel = (kind: UnitKind, count: number): string =>
  UNIT_LABEL[kind][count === 1 ? 0 : 1]

export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')
