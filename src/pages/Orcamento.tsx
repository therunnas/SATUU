import { Link, useParams } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import { activeBudget } from '../domain/queries'
import { budgetTotals } from '../domain/calc'
import { money } from '../lib/format'
import { BUDGET_STATUS } from '../lib/labels'
import { PageHead, Pill } from '../components/ui'
import { Summary } from '../components/Summary'
import { Topsheet } from '../components/Topsheet'
import { BudgetTable } from '../components/BudgetTable'
import { NaoEncontrado } from './NaoEncontrado'

export default function Orcamento() {
  const db = useDb()
  const { id = '' } = useParams()
  const projeto = db.projects.find((p) => p.id === id)
  const orcamento = activeBudget(db, id)

  if (!projeto || !orcamento) return <NaoEncontrado o="orçamento" />

  const status = BUDGET_STATUS[orcamento.status]

  return (
    <div className="page">
      <Link className="crumb" to={`/projetos/${projeto.id}`}>← {projeto.name}</Link>
      <PageHead
        eyebrow="Orçamento"
        title={projeto.name}
        sub={<>Versão {orcamento.version} · <Pill tone={status.tone}>{status.label}</Pill></>}
        aside={
          <div className="grand">
            <div className="grand-label">Total do orçamento</div>
            <div className="grand-value num">{money(budgetTotals(orcamento).total)}</div>
          </div>
        }
      />

      <Summary budget={orcamento} />
      <Topsheet budget={orcamento} />

      {orcamento.sections.map((section) => (
        <BudgetTable key={section.kind} budget={orcamento} section={section} />
      ))}
    </div>
  )
}
