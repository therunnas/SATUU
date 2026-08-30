import type {
  ClientKind,
  ExpenseStatus,
  ProjectFormat,
  ProjectStatus,
  UserRole,
} from '../domain/types'

/**
 * Rótulo e cor de cada enum, em um lugar só.
 *
 * É o que impede um status de ser verde numa tela e cinza em outra. Componente
 * nenhum escreve o texto de um status na mão nem escolhe a sua cor.
 *
 * `tone` casa com as classes `.tone-*` do `index.css`.
 */

export type Tone = 'neutro' | 'info' | 'ativo' | 'alerta' | 'critico' | 'ok'

interface Label {
  label: string
  tone: Tone
}

export const PROJECT_STATUS: Record<ProjectStatus, Label> = {
  orcamento: { label: 'Em orçamento', tone: 'neutro' },
  pre_producao: { label: 'Pré-produção', tone: 'info' },
  producao: { label: 'Em produção', tone: 'ativo' },
  pos_producao: { label: 'Pós-produção', tone: 'info' },
  entregue: { label: 'Entregue', tone: 'ok' },
  cancelado: { label: 'Cancelado', tone: 'critico' },
}

export const PROJECT_FORMAT: Record<ProjectFormat, string> = {
  longa: 'Longa-metragem',
  serie: 'Série',
  publicidade: 'Publicidade',
  documentario: 'Documentário',
  clipe: 'Videoclipe',
}

export const EXPENSE_STATUS: Record<ExpenseStatus, Label> = {
  pendente: { label: 'Pendente', tone: 'alerta' },
  aprovada: { label: 'Aprovada', tone: 'info' },
  paga: { label: 'Paga', tone: 'ok' },
  recusada: { label: 'Recusada', tone: 'critico' },
}

export const CLIENT_KIND: Record<ClientKind, string> = {
  agencia: 'Agência',
  marca: 'Marca',
  streaming: 'Streaming',
  produtora: 'Produtora',
  outro: 'Outro',
}

export const USER_ROLE: Record<UserRole, Label> = {
  admin: { label: 'Administrador', tone: 'ativo' },
  produtor: { label: 'Produtor', tone: 'info' },
  financeiro: { label: 'Financeiro', tone: 'info' },
  leitura: { label: 'Visualização', tone: 'neutro' },
}

export const BUDGET_STATUS: Record<'rascunho' | 'aprovado' | 'arquivado', Label> = {
  rascunho: { label: 'Rascunho', tone: 'alerta' },
  aprovado: { label: 'Aprovado', tone: 'ok' },
  arquivado: { label: 'Arquivado', tone: 'neutro' },
}
