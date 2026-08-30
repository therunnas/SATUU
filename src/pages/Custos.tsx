import { useState } from 'react'
import { useDb } from '../state/DbContext'
import { activeProjects, costSummary, costTracking } from '../domain/queries'
import { money, percent } from '../lib/format'
import { Meter, PageHead, Panel, Stat } from '../components/ui'

/**
 * Rastreamento de custo: orçado × realizado, conta a conta.
 *
 * É a tela que responde a pergunta que o produtor faz todo dia — "ainda cabe?"
 * — então o estouro precisa saltar aos olhos antes de qualquer outra coisa.
 */
export default function Custos() {
  const db = useDb()
  const projetos = activeProjects(db)
  const [projetoId, setProjetoId] = useState(projetos[0]?.id ?? '')

  const projeto = db.projects.find((p) => p.id === projetoId)
  const linhas = costTracking(db, projetoId)
  const resumo = costSummary(db, projetoId)

  return (
    <div className="page">
      <PageHead
        eyebrow="Financeiro"
        title="Rastreamento de custo"
        sub="O que foi orçado contra o que já foi comprometido, conta a conta."
        aside={
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span className="eyebrow" style={{ margin: 0 }}>Projeto</span>
            <select
              value={projetoId}
              onChange={(e) => setProjetoId(e.target.value)}
              style={{
                background: 'var(--surface)',
                color: 'var(--txt)',
                border: '1px solid var(--line-strong)',
                borderRadius: 7,
                padding: '7px 10px',
                font: 'inherit',
                minWidth: 240,
              }}
            >
              {projetos.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        }
      />

      <div className="cards">
        <Stat label="Orçado" value={money(resumo.budgeted)} dot="accent" />
        <Stat label="Comprometido" value={money(resumo.spent)} hint={percent(resumo.consumed)} dot="btl" />
        <Stat label="Saldo" value={money(resumo.balance)} dot="atl" />
        <Stat
          label="Contas estouradas"
          value={String(resumo.overAccounts)}
          hint={resumo.overAccounts === 0 ? 'tudo dentro do previsto' : 'passaram do orçado'}
          dot="fringe"
        />
      </div>

      <Panel title={projeto?.name ?? 'Sem projeto'} sub={`${linhas.length} contas`}>
        {linhas.length === 0 ? (
          <p className="empty">Nada a rastrear: sem orçamento e sem despesas.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Conta</th>
                  <th>Descrição</th>
                  <th className="right" style={{ width: 140 }}>Orçado</th>
                  <th className="right" style={{ width: 140 }}>Realizado</th>
                  <th className="right" style={{ width: 140 }}>Saldo</th>
                  <th style={{ width: 170 }}>Consumo</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((row) => (
                  <tr key={row.accountCode}>
                    <td className="code">{row.accountCode}</td>
                    <td>
                      {row.accountName}
                      {row.budgeted === 0 ? (
                        <div className="line-meta negativo">gasto sem previsão no orçamento</div>
                      ) : null}
                    </td>
                    <td className="right num muted">{row.budgeted === 0 ? '—' : money(row.budgeted)}</td>
                    <td className="right num">{row.spent === 0 ? '—' : money(row.spent)}</td>
                    <td className={row.balance < 0 ? 'right num negativo' : 'right num muted'}>
                      {money(row.balance)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Meter fraction={row.consumed} />
                        <span
                          className={row.over ? 'num line-meta negativo' : 'num line-meta'}
                          style={{ minWidth: 46, textAlign: 'right' }}
                        >
                          {row.budgeted === 0 ? '—' : percent(row.consumed)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <p className="foot">
        Despesa recusada não entra em nenhuma soma — não é dinheiro comprometido. Pendente entra:
        o compromisso existe antes da aprovação, e ignorá-lo faria o saldo parecer maior do que é.
      </p>
    </div>
  )
}
