import { budgetTotals } from './domain/calc'
import { budgetSeed } from './domain/seed'
import { money } from './lib/format'
import { BudgetTable } from './components/BudgetTable'
import { Summary } from './components/Summary'
import { Topsheet } from './components/Topsheet'

export default function App() {
  const budget = budgetSeed
  const geral = budgetTotals(budget)

  return (
    <div className="app">
      <header className="head">
        <div>
          <div className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-name">Satuu · Orçamento de Produção</span>
          </div>
          <h1>{budget.project}</h1>
          <p className="version">{budget.version}</p>
        </div>
        <div className="grand">
          <div className="grand-label">Total do orçamento</div>
          <div className="grand-value num">{money(geral.total)}</div>
        </div>
      </header>

      <Summary budget={budget} />
      <Topsheet budget={budget} />

      {budget.sections.map((section) => (
        <BudgetTable key={section.kind} budget={budget} section={section} />
      ))}

      <p className="foot">
        Primeira fatia do SATUU: o núcleo de orçamentação. Todo número desta tela sai
        de <code>src/domain/calc.ts</code> — nenhum componente calcula por conta própria, que é o
        que impede o resumo, o topsheet e a tabela detalhada de divergirem.
        <br />
        Ainda fora do escopo: despesas realizadas, ordens de compra, relatórios de custo e
        exportação em PDF. Cada um entra por sua própria Issue.
      </p>
    </div>
  )
}
