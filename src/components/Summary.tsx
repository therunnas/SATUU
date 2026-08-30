import type { Budget } from '../domain/types'
import { budgetTotals, fringeBreakdown, totalsForKind } from '../domain/calc'
import { money, percent } from '../lib/format'

/**
 * Cartões de resumo e a barra de composição ATL/BTL.
 *
 * Nenhum número é calculado aqui — tudo vem de `domain/calc`, para o resumo não
 * conseguir divergir do topsheet nem da tabela detalhada.
 */
export function Summary({ budget }: { budget: Budget }) {
  const atl = totalsForKind(budget, 'atl')
  const btl = totalsForKind(budget, 'btl')
  const geral = budgetTotals(budget)
  const fringes = fringeBreakdown(budget)

  const share = (v: number) => (geral.total === 0 ? 0 : v / geral.total)

  return (
    <>
      <div className="cards">
        <div className="card">
          <div className="card-label">
            <span className="dot dot-atl" />
            Acima da linha
          </div>
          <div className="card-value num">{money(atl.total)}</div>
          <div className="card-hint">{percent(share(atl.total))} do orçamento</div>
        </div>

        <div className="card">
          <div className="card-label">
            <span className="dot dot-btl" />
            Abaixo da linha
          </div>
          <div className="card-value num">{money(btl.total)}</div>
          <div className="card-hint">{percent(share(btl.total))} do orçamento</div>
        </div>

        <div className="card">
          <div className="card-label">
            <span className="dot dot-fringe" />
            Encargos
          </div>
          <div className="card-value num">{money(geral.fringes)}</div>
          <div className="card-hint">
            {fringes.map((f) => `${f.fringe.name} ${percent(f.fringe.rate, 0)}`).join(' · ')}
          </div>
        </div>

        <div className="card">
          <div className="card-label">
            <span className="dot dot-accent" />
            Custo direto
          </div>
          <div className="card-value num">{money(geral.base)}</div>
          <div className="card-hint">antes dos encargos</div>
        </div>
      </div>

      <div
        className="split"
        role="img"
        aria-label={`Acima da linha ${percent(share(atl.total))}, abaixo da linha ${percent(share(btl.total))}`}
      >
        <span className="split-atl" style={{ width: `${share(atl.total) * 100}%` }} />
        <span className="split-btl" style={{ width: `${share(btl.total) * 100}%` }} />
      </div>

      <div className="split-legend">
        <span>
          <span className="dot dot-atl" /> Acima da linha · {percent(share(atl.total))}
        </span>
        <span>
          <span className="dot dot-btl" /> Abaixo da linha · {percent(share(btl.total))}
        </span>
      </div>
    </>
  )
}
