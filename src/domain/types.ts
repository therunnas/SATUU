/**
 * Modelo de orçamento de produção audiovisual.
 *
 * A hierarquia segue o padrão da indústria:
 *
 *   Orçamento
 *     └─ Seção        ATL (criação e elenco) ou BTL (execução)
 *         └─ Conta    agrupador numerado, ex. "1100 · Direção"
 *             └─ Linha  o que de fato gera custo: qtd × unidades × valor
 *
 * Fringes são encargos percentuais que incidem sobre linhas específicas —
 * encargos sociais, sindicato, seguro. Ficam declarados uma vez no orçamento e
 * cada linha diz de quais participa, para a alíquota não se repetir espalhada.
 */

/** Seção do orçamento. Acima da linha é criação; abaixo é execução. */
export type SectionKind = 'atl' | 'btl'

/**
 * Unidade de medida da linha. O rótulo é só apresentação — o cálculo não
 * depende dela, porque quantidade e unidades já são números.
 */
export type UnitKind =
  | 'diaria'
  | 'semana'
  | 'mes'
  | 'cache'
  | 'verba'
  | 'unidade'

export interface Fringe {
  id: string
  /** Nome como aparece na interface, ex. "Encargos sociais". */
  name: string
  /** Alíquota em fração decimal: 0.2 é 20%. */
  rate: number
}

export interface LineItem {
  id: string
  description: string
  /** Quantas pessoas, diárias ou itens. */
  quantity: number
  /** Quantas unidades cada um consome, ex. 12 diárias. */
  units: number
  unitKind: UnitKind
  /** Valor unitário em centavos, para não carregar erro de ponto flutuante. */
  unitCents: number
  /** Ids de `Budget.fringes` que incidem sobre esta linha. */
  fringeIds: string[]
}

export interface Account {
  id: string
  /** Número da conta no plano de contas, ex. "1100". */
  code: string
  name: string
  lines: LineItem[]
}

export interface Section {
  kind: SectionKind
  name: string
  accounts: Account[]
}

export interface Budget {
  id: string
  /** Nome do projeto orçado. */
  project: string
  /** Versão do orçamento — as produções mantêm várias lado a lado. */
  version: string
  currency: 'BRL'
  fringes: Fringe[]
  sections: Section[]
}
