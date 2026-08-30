import { Link, useParams } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import { activeBudget, clientTotals, costSummary, projectsOfClient } from '../domain/queries'
import { budgetTotals } from '../domain/calc'
import { money, percent } from '../lib/format'
import { CLIENT_KIND, PROJECT_FORMAT, PROJECT_STATUS } from '../lib/labels'
import { PageHead, Panel, Pill, Stat } from '../components/ui'
import { NaoEncontrado } from './NaoEncontrado'

export default function ClienteDetalhe() {
  const db = useDb()
  const { id = '' } = useParams()
  const cliente = db.clients.find((c) => c.id === id)

  if (!cliente) return <NaoEncontrado o="cliente" />

  const projetos = projectsOfClient(db, cliente.id)
  const totais = clientTotals(db, cliente.id)

  return (
    <div className="page">
      <Link className="crumb" to="/clientes">← Clientes</Link>
      <PageHead
        eyebrow={CLIENT_KIND[cliente.kind]}
        title={cliente.name}
        sub={`${cliente.contactName} · ${cliente.contactEmail} · ${cliente.city}`}
      />

      <div className="cards">
        <Stat label="Contratado" value={money(totais.budgeted)} hint="soma dos orçamentos" dot="accent" />
        <Stat label="Projetos" value={String(totais.projects)} dot="btl" />
      </div>

      <Panel title="Projetos do cliente" sub={`${projetos.length} produções`}>
        {projetos.length === 0 ? (
          <p className="empty">Nenhum projeto para este cliente ainda.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th style={{ width: 140 }}>Formato</th>
                  <th style={{ width: 130 }}>Situação</th>
                  <th className="right" style={{ width: 150 }}>Orçado</th>
                  <th className="right" style={{ width: 110 }}>Consumo</th>
                </tr>
              </thead>
              <tbody>
                {projetos.map((p) => {
                  const orcamento = activeBudget(db, p.id)
                  const status = PROJECT_STATUS[p.status]
                  return (
                    <tr key={p.id}>
                      <td><Link className="row-link" to={`/projetos/${p.id}`}>{p.name}</Link></td>
                      <td className="muted">{PROJECT_FORMAT[p.format]}</td>
                      <td><Pill tone={status.tone}>{status.label}</Pill></td>
                      <td className="right num">{orcamento ? money(budgetTotals(orcamento).total) : '—'}</td>
                      <td className="right num muted">{percent(costSummary(db, p.id).consumed)}</td>
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
