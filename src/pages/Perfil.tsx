import { useDb } from '../state/DbContext'
import { USER_ROLE } from '../lib/labels'
import { money } from '../lib/format'
import { PageHead, Panel, Pill } from '../components/ui'

export default function Perfil() {
  const db = useDb()
  const eu = db.currentUser
  const papel = USER_ROLE[eu.role]
  const meusLancamentos = db.expenses.filter((e) => e.userId === eu.id)
  const total = meusLancamentos.reduce((s, e) => s + e.amountCents, 0)

  return (
    <div className="page">
      <PageHead eyebrow="Conta" title="Perfil" sub="Seus dados e o que você lançou." />

      <div className="grid-2">
        <Panel title="Seus dados">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
            <span className="avatar" style={{ width: 48, height: 48, fontSize: 17 }}>{eu.initials}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{eu.name}</div>
              <div className="line-meta">{eu.email}</div>
            </div>
          </div>
          <dl>
            <div className="field"><dt>Papel</dt><dd><Pill tone={papel.tone}>{papel.label}</Pill></dd></div>
            <div className="field"><dt>Produtora</dt><dd>{db.organization.name}</dd></div>
            <div className="field"><dt>Lançamentos</dt><dd className="num">{meusLancamentos.length}</dd></div>
            <div className="field"><dt>Valor lançado</dt><dd className="num">{money(total)}</dd></div>
          </dl>
        </Panel>

        <Panel title="O que seu papel permite">
          <dl>
            <div className="field"><dt>Ver orçamentos</dt><dd>Sim</dd></div>
            <div className="field"><dt>Editar orçamentos</dt><dd>{eu.role === 'leitura' ? 'Não' : 'Sim'}</dd></div>
            <div className="field"><dt>Lançar despesas</dt><dd>{eu.role === 'leitura' ? 'Não' : 'Sim'}</dd></div>
            <div className="field"><dt>Aprovar despesas</dt><dd>{eu.role === 'admin' || eu.role === 'financeiro' ? 'Sim' : 'Não'}</dd></div>
            <div className="field"><dt>Configurar a produtora</dt><dd>{eu.role === 'admin' ? 'Sim' : 'Não'}</dd></div>
          </dl>
        </Panel>
      </div>
    </div>
  )
}
