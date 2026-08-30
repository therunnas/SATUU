/**
 * Modelo de domínio do SATUU.
 *
 * A hierarquia do orçamento segue o padrão da indústria:
 *
 *   Orçamento
 *     └─ Seção        ATL (criação e elenco) ou BTL (execução)
 *         └─ Conta    agrupador numerado, ex. "1100 · Direção"
 *             └─ Linha  o que de fato gera custo: qtd × unidades × valor
 *
 * Em volta dele: a produtora que orça, o cliente que contrata, o projeto que
 * amarra os dois, e as despesas realizadas que se medem contra o orçamento.
 *
 * Fringes são encargos percentuais que incidem sobre linhas específicas —
 * encargos sociais, sindicato, seguro. Ficam declarados uma vez no orçamento e
 * cada linha diz de quais participa, para a alíquota não se repetir espalhada.
 */

/* ------------------------------------------------------------ orçamento */

/** Seção do orçamento. Acima da linha é criação; abaixo é execução. */
export type SectionKind = 'atl' | 'btl'

/**
 * Unidade de medida da linha. O rótulo é só apresentação — o cálculo não
 * depende dela, porque quantidade e unidades já são números.
 */
export type UnitKind = 'diaria' | 'semana' | 'mes' | 'cache' | 'verba' | 'unidade'

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
  projectId: string
  /** Nome do projeto orçado, repetido aqui para o orçamento se explicar sozinho. */
  project: string
  /** Versão do orçamento — as produções mantêm várias lado a lado. */
  version: string
  /** Só uma versão por projeto fica aprovada; é contra ela que o custo é medido. */
  status: 'rascunho' | 'aprovado' | 'arquivado'
  currency: 'BRL'
  fringes: Fringe[]
  sections: Section[]
}

/* ------------------------------------------------------------ produtora */

export interface Organization {
  id: string
  name: string
  legalName: string
  taxId: string
  city: string
  state: string
  /** Encargos padrão aplicados a orçamentos novos. */
  defaultFringes: Fringe[]
}

export type UserRole = 'admin' | 'produtor' | 'financeiro' | 'leitura'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  /** Iniciais para o avatar, quando não há foto. */
  initials: string
}

/* ------------------------------------------------------------ clientes */

export type ClientKind = 'agencia' | 'marca' | 'streaming' | 'produtora' | 'outro'

export interface Client {
  id: string
  name: string
  kind: ClientKind
  contactName: string
  contactEmail: string
  city: string
}

/* ------------------------------------------------------------ projetos */

export type ProjectStatus =
  | 'orcamento'
  | 'pre_producao'
  | 'producao'
  | 'pos_producao'
  | 'entregue'
  | 'cancelado'

export type ProjectFormat = 'longa' | 'serie' | 'publicidade' | 'documentario' | 'clipe'

export interface Project {
  id: string
  name: string
  clientId: string
  format: ProjectFormat
  status: ProjectStatus
  /** ISO curto, AAAA-MM-DD. */
  startDate: string
  endDate: string
  /** Quantas diárias de filmagem — dado que o produtor consulta o tempo todo. */
  shootDays: number
}

/* ------------------------------------------------------------ despesas */

export type ExpenseStatus = 'pendente' | 'aprovada' | 'paga' | 'recusada'

export interface Expense {
  id: string
  projectId: string
  /** Conta do orçamento contra a qual esta despesa é medida. */
  accountCode: string
  description: string
  supplier: string
  date: string
  amountCents: number
  status: ExpenseStatus
  /** Quem lançou. */
  userId: string
}

/* ------------------------------------------------------------ base */

/** Tudo o que a aplicação conhece. Sem backend ainda, vive em memória. */
export interface Database {
  organization: Organization
  currentUser: User
  users: User[]
  clients: Client[]
  projects: Project[]
  budgets: Budget[]
  expenses: Expense[]
}
