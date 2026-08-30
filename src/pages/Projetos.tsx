import { Link } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import { activeBudget, clientById, costSummary } from '../domain/queries'
import { budgetTotals } from '../domain/calc'
import { money, percent } from '../lib/format'
import { PROJECT_FORMAT, PROJECT_STATUS } from '../lib/labels'
import { Meter, PageHead, Panel, Pill } from '../components/ui'

export default function Projetos() {
  const db = useDb()

  return (
    <div className="page">
      <PageHead
        eyebrow="Produção"
        title="Projetos"
        sub={`${db.projects.length} produções · ${db.budgets.length} orçamentos`}
      />

      <Panel title="Todas as produções" sub={`${db.projects.length} projetos`}>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Projeto</th>
                <th style={{ width: 150 }}>Cliente</th>
                <th style={{ width: 130 }}>Formato</th>
                <th style={{ width: 130 }}>Situação</th>
                <th className="right" style={{ width: 70 }}>Diárias</th>
                <th className="right" style={{ width: 140 }}>Orçado</th>
                <th style={{ width: 140 }}>Consumo</th>
              </tr>
            </thead>
            <tbody>
              {db.projects.map((projeto) => {
                const orcamento = activeBudget(db, projeto.id)
                const custo = costSummary(db, projeto.id)
                const status = PROJECT_STATUS[projeto.status]
                return (
                  <tr key={projeto.id}>
                    <td>
                      <Link className="row-link" to={`/projetos/${projeto.id}`}>{projeto.name}</Link>
                      <div className="line-meta">{projeto.startDate} — {projeto.endDate}</div>
                    </td>
                    <td className="muted">{clientById(db, projeto.clientId)?.name ?? '—'}</td>
                    <td className="muted">{PROJECT_FORMAT[projeto.format]}</td>
                    <td><Pill tone={status.tone}>{status.label}</Pill></td>
                    <td className="right num muted">{projeto.shootDays}</td>
                    <td className="right num">{orcamento ? money(budgetTotals(orcamento).total) : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Meter fraction={custo.consumed} />
                        <span className="num line-meta" style={{ minWidth: 44, textAlign: 'right' }}>
                          {percent(custo.consumed)}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
