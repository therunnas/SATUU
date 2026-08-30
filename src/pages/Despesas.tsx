import { useState } from 'react'
import { useDb } from '../state/DbContext'
import { countsAsCost } from '../domain/queries'
import { money } from '../lib/format'
import { EXPENSE_STATUS } from '../lib/labels'
import { PageHead, Panel, Pill, Stat } from '../components/ui'
import type { ExpenseStatus } from '../domain/types'

const FILTROS: Array<{ id: ExpenseStatus | 'todas'; texto: string }> = [
  { id: 'todas', texto: 'Todas' },
  { id: 'pendente', texto: 'Pendentes' },
  { id: 'aprovada', texto: 'Aprovadas' },
  { id: 'paga', texto: 'Pagas' },
  { id: 'recusada', texto: 'Recusadas' },
]

export default function Despesas() {
  const db = useDb()
  const [filtro, setFiltro] = useState<ExpenseStatus | 'todas'>('todas')

  const todas = [...db.expenses].sort((a, b) => b.date.localeCompare(a.date))
  const lista = filtro === 'todas' ? todas : todas.filter((e) => e.status === filtro)

  const comprometido = todas.filter(countsAsCost).reduce((s, e) => s + e.amountCents, 0)
  const pago = todas.filter((e) => e.status === 'paga').reduce((s, e) => s + e.amountCents, 0)
  const pendente = todas.filter((e) => e.status === 'pendente').reduce((s, e) => s + e.amountCents, 0)

  return (
    <div className="page">
      <PageHead
        eyebrow="Financeiro"
        title="Despesas"
        sub={`${todas.length} lançamentos em ${db.projects.length} produções`}
      />

      <div className="cards">
        <Stat label="Comprometido" value={money(comprometido)} hint="exclui recusadas" dot="accent" />
        <Stat label="Pago" value={money(pago)} hint="saiu do caixa" dot="btl" />
        <Stat label="Aguardando aprovação" value={money(pendente)} dot="fringe" />
        <Stat label="Lançamentos" value={String(todas.length)} hint="no período" dot="atl" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={filtro === f.id ? 'nav-link ativo' : 'nav-link'}
            style={{ border: '1px solid var(--line)', cursor: 'pointer', background: filtro === f.id ? undefined : 'var(--surface)' }}
          >
            {f.texto}
          </button>
        ))}
      </div>

      <Panel title="Lançamentos" sub={`${lista.length} de ${todas.length}`}>
        {lista.length === 0 ? (
          <p className="empty">Nenhum lançamento com esse filtro.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th style={{ width: 170 }}>Projeto</th>
                  <th style={{ width: 80 }}>Conta</th>
                  <th style={{ width: 110 }}>Data</th>
                  <th style={{ width: 130 }}>Lançado por</th>
                  <th className="right" style={{ width: 130 }}>Valor</th>
                  <th style={{ width: 110 }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((d) => {
                  const s = EXPENSE_STATUS[d.status]
                  const projeto = db.projects.find((p) => p.id === d.projectId)
                  const quem = db.users.find((u) => u.id === d.userId)
                  return (
                    <tr key={d.id}>
                      <td>
                        {d.description}
                        <div className="line-meta">{d.supplier}</div>
                      </td>
                      <td className="muted">{projeto?.name ?? '—'}</td>
                      <td className="code">{d.accountCode}</td>
                      <td className="num muted">{d.date}</td>
                      <td className="muted">{quem?.name ?? '—'}</td>
                      <td className={d.status === 'recusada' ? 'right num muted' : 'right num'}>
                        {money(d.amountCents)}
                      </td>
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
