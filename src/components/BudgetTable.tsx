import { useState } from 'react'
import type { Budget, Section } from '../domain/types'
import { accountTotals, lineTotals, sectionTotals } from '../domain/calc'
import { money, unitLabel } from '../lib/format'

/**
 * Tabela detalhada de uma seção: contas que abrem e fecham, mostrando as linhas
 * com quantidade, unidades, valor unitário e os encargos que incidem.
 */
export function BudgetTable({ budget, section }: { budget: Budget; section: Section }) {
  // Abre a primeira conta, para a tela não nascer toda fechada.
  const [abertas, setAbertas] = useState<Set<string>>(
    () => new Set(section.accounts.length > 0 ? [section.accounts[0].id] : []),
  )

  const alternar = (id: string) =>
    setAbertas((atual) => {
      const proximo = new Set(atual)
      if (!proximo.delete(id)) proximo.add(id)
      return proximo
    })

  const totalSecao = sectionTotals(section, budget.fringes)
  const nomeFringe = (id: string) => budget.fringes.find((f) => f.id === id)?.name ?? id

  return (
    <section className="panel">
      <div className="panel-head">
        <h2 className="panel-title">
          <span className={section.kind === 'atl' ? 'tag tag-atl' : 'tag tag-btl'}>
            {section.kind}
          </span>{' '}
          {section.name}
        </h2>
        <span className="panel-sub num">{money(totalSecao.total)}</span>
      </div>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: 260 }}>Conta e linhas</th>
              <th className="right" style={{ width: 64 }}>Qtd</th>
              <th className="right" style={{ width: 92 }}>Unidades</th>
              <th className="right" style={{ width: 120 }}>Valor unit.</th>
              <th style={{ width: 150 }}>Encargos</th>
              <th className="right" style={{ width: 140 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {section.accounts.map((account) => {
              const aberta = abertas.has(account.id)
              const totais = accountTotals(account, budget.fringes)

              return [
                <tr
                  key={account.id}
                  className="acc-row"
                  onClick={() => alternar(account.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={aberta}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      alternar(account.id)
                    }
                  }}
                >
                  <td>
                    <span className={aberta ? 'caret caret-open' : 'caret'}>▶</span>
                    <span className="code" style={{ marginRight: 8 }}>{account.code}</span>
                    {account.name}
                  </td>
                  <td className="right muted">{account.lines.length}</td>
                  <td colSpan={2} className="right line-meta">
                    {account.lines.length === 1 ? '1 linha' : `${account.lines.length} linhas`}
                  </td>
                  <td className="num line-meta">
                    {totais.fringes === 0 ? '—' : money(totais.fringes)}
                  </td>
                  <td className="right num">{money(totais.total)}</td>
                </tr>,

                ...(aberta
                  ? account.lines.map((line) => {
                      const t = lineTotals(line, budget.fringes)
                      return (
                        <tr key={line.id}>
                          <td className="line-desc">{line.description}</td>
                          <td className="right num muted">{line.quantity}</td>
                          <td className="right num muted nowrap">
                            {line.units} <span className="line-meta">{unitLabel(line.unitKind, line.units)}</span>
                          </td>
                          <td className="right num muted">{money(line.unitCents)}</td>
                          <td>
                            {line.fringeIds.length === 0 ? (
                              <span className="line-meta">—</span>
                            ) : (
                              line.fringeIds.map((id) => (
                                <span key={id} className="tag tag-fringe" style={{ marginRight: 4 }}>
                                  {nomeFringe(id)}
                                </span>
                              ))
                            )}
                          </td>
                          <td className="right num">{money(t.total)}</td>
                        </tr>
                      )
                    })
                  : []),
              ]
            })}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>Subtotal · {section.name}</td>
              <td colSpan={3} className="right num muted">{money(totalSecao.base)}</td>
              <td className="num muted">{money(totalSecao.fringes)}</td>
              <td className="right num">{money(totalSecao.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
