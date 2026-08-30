import { Link } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import {
  activeBudget,
  activeProjects,
  clientById,
  costSummary,
  orgSummary,
  pendingApproval,
} from '../domain/queries'
import { budgetTotals } from '../domain/calc'
import { money, moneyCompact, percent } from '../lib/format'
import { EXPENSE_STATUS, PROJECT_STATUS } from '../lib/labels'
import { Meter, PageHead, Panel, Pill, Stat } from '../components/ui'

export default function Dashboard() {
  const db = useDb()
  const resumo = orgSummary(db)
  const ativos = activeProjects(db)
  const pendentes = pendingApproval(db)

  return (
    <div className="page">
      <PageHead
        eyebrow={db.organization.name}
        title="Visão geral"
        sub={`${resumo.activeCount} produções em andamento · ${resumo.deliveredCount} entregues`}
        aside={
          <div className="grand">
            <div className="grand-label">Em produção</div>
            <div className="grand-value num">{money(resumo.budgeted)}</div>
          </div>
        }
      />

      <div className="cards">
        <Stat label="Orçado" value={money(resumo.budgeted)} hint="produções em andamento" dot="accent" />
        <Stat
          label="Comprometido"
          value={money(resumo.spent)}
          hint={`${percent(resumo.budgeted === 0 ? 0 : resumo.spent / resumo.budgeted)} do orçado`}
          dot="btl"
        />
        <Stat
          label="Saldo"
          value={money(resumo.balance)}
          hint={resumo.balance < 0 ? 'estouro' : 'disponível'}
          dot="atl"
        />
        <Stat
          label="Aguardando aprovação"
          value={money(resumo.pendingAmount)}
          hint={`${resumo.pendingExpenses} ${resumo.pendingExpenses === 1 ? 'lançamento' : 'lançamentos'}`}
          dot="fringe"
        />
      </div>

      <Panel title="Produções em andamento" sub={`${ativos.length} projetos`}>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Cliente</th>
                <th style={{ width: 130 }}>Situação</th>
                <th className="right" style={{ width: 140 }}>Orçado</th>
                <th className="right" style={{ width: 140 }}>Comprometido</th>
                <th style={{ width: 150 }}>Consumo</th>
              </tr>
            </thead>
            <tbody>
              {ativos.map((projeto) => {
                const orcamento = activeBudget(db, projeto.id)
                const custo = costSummary(db, projeto.id)
                const cliente = clientById(db, projeto.clientId)
                const status = PROJECT_STATUS[projeto.status]

                return (
                  <tr key={projeto.id}>
                    <td>
                      <Link className="row-link" to={`/projetos/${projeto.id}`}>
                        {projeto.name}
                      </Link>
                    </td>
                    <td className="muted">{cliente?.name ?? '—'}</td>
                    <td><Pill tone={status.tone}>{status.label}</Pill></td>
                    <td className="right num">
                      {orcamento ? money(budgetTotals(orcamento).total) : '—'}
                    </td>
                    <td className="right num muted">{money(custo.spent)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Meter fraction={custo.consumed} />
                        <span
                          className={custo.consumed > 1 ? 'num line-meta negativo' : 'num line-meta'}
                          style={{ minWidth: 44, textAlign: 'right' }}
                        >
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

      <Panel
        title="Aguardando aprovação"
        sub={pendentes.length === 0 ? 'nada pendente' : `${pendentes.length} lançamentos`}
      >
        {pendentes.length === 0 ? (
          <p className="empty">Nenhuma despesa aguardando aprovação.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th>Projeto</th>
                  <th style={{ width: 90 }}>Conta</th>
                  <th className="right" style={{ width: 130 }}>Valor</th>
                  <th style={{ width: 110 }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {pendentes.map((despesa) => {
                  const projeto = db.projects.find((p) => p.id === despesa.projectId)
                  const status = EXPENSE_STATUS[despesa.status]
                  return (
                    <tr key={despesa.id}>
                      <td>
                        {despesa.description}
                        <div className="line-meta">{despesa.supplier}</div>
                      </td>
                      <td className="muted">{projeto?.name ?? '—'}</td>
                      <td className="code">{despesa.accountCode}</td>
                      <td className="right num">{money(despesa.amountCents)}</td>
                      <td><Pill tone={status.tone}>{status.label}</Pill></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <p className="foot">
        Total em produção: <strong className="num">{moneyCompact(resumo.budgeted)}</strong>. Todo número
        desta tela sai de <code>src/domain/queries.ts</code> e <code>src/domain/calc.ts</code>.
      </p>
    </div>
  )
}
