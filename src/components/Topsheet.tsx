import type { Budget } from '../domain/types'
import { budgetTotals, topsheet } from '../domain/calc'
import { money, percent } from '../lib/format'

/**
 * Topsheet: uma linha por conta, com a participação de cada uma no total.
 * É o resumo de uma página que a produção manda para o financiador.
 */
export function Topsheet({ budget }: { budget: Budget }) {
  const rows = topsheet(budget)
  const geral = budgetTotals(budget)
  const maior = rows.reduce((m, r) => Math.max(m, r.totals.total), 0)

  return (
    <section className="panel">
      <div className="panel-head">
        <h2 className="panel-title">Topsheet</h2>
        <span className="panel-sub">{rows.length} contas</span>
      </div>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th style={{ width: 70 }}>Conta</th>
              <th>Descrição</th>
              <th style={{ width: 66 }}>Seção</th>
              <th className="right" style={{ width: 130 }}>Custo direto</th>
              <th className="right" style={{ width: 120 }}>Encargos</th>
              <th className="right" style={{ width: 140 }}>Total</th>
              <th style={{ width: 130 }}>Participação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.accountId}>
                <td className="code">{row.code}</td>
                <td>{row.name}</td>
                <td>
                  <span className={row.kind === 'atl' ? 'tag tag-atl' : 'tag tag-btl'}>
                    {row.kind}
                  </span>
                </td>
                <td className="right num muted">{money(row.totals.base)}</td>
                <td className="right num muted">
                  {row.totals.fringes === 0 ? '—' : money(row.totals.fringes)}
                </td>
                <td className="right num">{money(row.totals.total)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="bar">
                      <span
                        style={{
                          width: maior === 0 ? '0%' : `${(row.totals.total / maior) * 100}%`,
                          background: row.kind === 'atl' ? 'var(--atl)' : 'var(--btl)',
                        }}
                      />
                    </div>
                    <span className="num line-meta" style={{ minWidth: 42, textAlign: 'right' }}>
                      {percent(row.share)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td />
              <td>Total geral</td>
              <td />
              <td className="right num">{money(geral.base)}</td>
              <td className="right num">{money(geral.fringes)}</td>
              <td className="right num">{money(geral.total)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
