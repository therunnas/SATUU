import { Link, useParams } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import {
  activeBudget,
  budgetsOfProject,
  clientById,
  costSummary,
  costTracking,
  expensesOfProject,
  heaviestOfProject,
} from '../domain/queries'
import { budgetTotals } from '../domain/calc'
import { money, percent } from '../lib/format'
import { BUDGET_STATUS, EXPENSE_STATUS, PROJECT_FORMAT, PROJECT_STATUS } from '../lib/labels'
import { Meter, PageHead, Panel, Pill, Stat } from '../components/ui'
import { NaoEncontrado } from './NaoEncontrado'

export default function ProjetoDetalhe() {
  const db = useDb()
  const { id = '' } = useParams()
  const projeto = db.projects.find((p) => p.id === id)

  if (!projeto) return <NaoEncontrado o="projeto" />

  const cliente = clientById(db, projeto.clientId)
  const orcamento = activeBudget(db, projeto.id)
  const custo = costSummary(db, projeto.id)
  const status = PROJECT_STATUS[projeto.status]
  const versoes = budgetsOfProject(db, projeto.id)
  const despesas = expensesOfProject(db, projeto.id)
  const estouradas = costTracking(db, projeto.id).filter((r) => r.over)

  return (
    <div className="page">
      <Link className="crumb" to="/projetos">← Projetos</Link>
      <PageHead
        eyebrow={cliente?.name ?? 'Sem cliente'}
        title={projeto.name}
        sub={
          <>
            {PROJECT_FORMAT[projeto.format]} · {projeto.shootDays} diárias ·{' '}
            {projeto.startDate} a {projeto.endDate}
          </>
        }
        aside={<Pill tone={status.tone}>{status.label}</Pill>}
      />

      <div className="cards">
        <Stat label="Orçado" value={orcamento ? money(budgetTotals(orcamento).total) : '—'} dot="accent" />
        <Stat label="Comprometido" value={money(custo.spent)} hint={percent(custo.consumed)} dot="btl" />
        <Stat label="Pago" value={money(custo.paid)} hint="saiu do caixa" dot="atl" />
        <Stat
          label="Saldo"
          value={money(custo.balance)}
          hint={custo.overAccounts > 0 ? `${custo.overAccounts} contas estouradas` : 'dentro do previsto'}
          dot="fringe"
        />
      </div>

      {orcamento ? (
        <Panel
          title="Orçamento"
          sub={<Link className="row-link" to={`/projetos/${projeto.id}/orcamento`}>Abrir orçamento →</Link>}
        >
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Versão</th>
                  <th style={{ width: 120 }}>Situação</th>
                  <th className="right" style={{ width: 140 }}>Custo direto</th>
                  <th className="right" style={{ width: 130 }}>Encargos</th>
                  <th className="right" style={{ width: 150 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {versoes.map((v) => {
                  const t = budgetTotals(v)
                  const s = BUDGET_STATUS[v.status]
                  return (
                    <tr key={v.id}>
                      <td className="code">{v.version}</td>
                      <td><Pill tone={s.tone}>{s.label}</Pill></td>
                      <td className="right num muted">{money(t.base)}</td>
                      <td className="right num muted">{money(t.fringes)}</td>
                      <td className="right num">{money(t.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel title="Orçamento"><p className="empty">Este projeto ainda não tem orçamento.</p></Panel>
      )}

      <Panel title="Onde o dinheiro está" sub="contas mais pesadas">
        {orcamento ? (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Conta</th>
                  <th>Descrição</th>
                  <th className="right" style={{ width: 150 }}>Total</th>
                  <th style={{ width: 150 }}>Participação</th>
                </tr>
              </thead>
              <tbody>
                {heaviestOfProject(db, projeto.id).map((row) => (
                  <tr key={row.accountId}>
                    <td className="code">{row.code}</td>
                    <td>{row.name}</td>
                    <td className="right num">{money(row.totals.total)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Meter fraction={row.share} />
                        <span className="num line-meta" style={{ minWidth: 44, textAlign: 'right' }}>
                          {percent(row.share)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">Sem orçamento, não há o que ranquear.</p>
        )}
      </Panel>

      {estouradas.length > 0 ? (
        <Panel title="Contas estouradas" sub={`${estouradas.length} contas`}>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Conta</th>
                  <th>Descrição</th>
                  <th className="right" style={{ width: 140 }}>Orçado</th>
                  <th className="right" style={{ width: 140 }}>Realizado</th>
                  <th className="right" style={{ width: 140 }}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {estouradas.map((row) => (
                  <tr key={row.accountCode}>
                    <td className="code">{row.accountCode}</td>
                    <td>{row.accountName}</td>
                    <td className="right num muted">{money(row.budgeted)}</td>
                    <td className="right num">{money(row.spent)}</td>
                    <td className="right num negativo">{money(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}

      <Panel title="Despesas do projeto" sub={`${despesas.length} lançamentos`}>
        {despesas.length === 0 ? (
          <p className="empty">Nenhuma despesa lançada.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th style={{ width: 170 }}>Fornecedor</th>
                  <th style={{ width: 90 }}>Conta</th>
                  <th style={{ width: 110 }}>Data</th>
                  <th className="right" style={{ width: 130 }}>Valor</th>
                  <th style={{ width: 110 }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => {
                  const s = EXPENSE_STATUS[d.status]
                  return (
                    <tr key={d.id}>
                      <td>{d.description}</td>
                      <td className="muted">{d.supplier}</td>
                      <td className="code">{d.accountCode}</td>
                      <td className="num muted">{d.date}</td>
                      <td className="right num">{money(d.amountCents)}</td>
                      <td><Pill tone={s.tone}>{s.label}</Pill></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
