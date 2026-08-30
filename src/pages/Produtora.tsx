import { useDb } from '../state/DbContext'
import { activeProjects, orgSummary } from '../domain/queries'
import { money, percent } from '../lib/format'
import { USER_ROLE } from '../lib/labels'
import { PageHead, Panel, Pill, Stat } from '../components/ui'

export default function Produtora() {
  const db = useDb()
  const org = db.organization
  const resumo = orgSummary(db)

  return (
    <div className="page">
      <PageHead
        eyebrow="Configuração"
        title={org.name}
        sub="Dados da produtora, encargos padrão e equipe."
      />

      <div className="cards">
        <Stat label="Em produção" value={money(resumo.budgeted)} hint={`${resumo.activeCount} projetos`} dot="accent" />
        <Stat label="Entregues" value={String(resumo.deliveredCount)} hint="no histórico" dot="btl" />
        <Stat label="Clientes" value={String(db.clients.length)} dot="atl" />
        <Stat label="Equipe" value={String(db.users.length)} hint="usuários com acesso" dot="fringe" />
      </div>

      <div className="grid-2">
        <Panel title="Dados cadastrais">
          <dl>
            <div className="field"><dt>Nome fantasia</dt><dd>{org.name}</dd></div>
            <div className="field"><dt>Razão social</dt><dd>{org.legalName}</dd></div>
            <div className="field"><dt>CNPJ</dt><dd className="num">{org.taxId}</dd></div>
            <div className="field"><dt>Praça</dt><dd>{org.city} · {org.state}</dd></div>
            <div className="field"><dt>Projetos em andamento</dt><dd className="num">{activeProjects(db).length}</dd></div>
          </dl>
        </Panel>

        <Panel title="Encargos padrão" sub="aplicados a orçamentos novos">
          <dl>
            {org.defaultFringes.map((f) => (
              <div className="field" key={f.id}>
                <dt>{f.name}</dt>
                <dd className="num">{percent(f.rate, 0)}</dd>
              </div>
            ))}
          </dl>
          <p className="empty" style={{ padding: '12px 18px', textAlign: 'left' }}>
            Cada linha do orçamento escolhe de quais encargos participa. A alíquota fica declarada
            aqui uma vez só, para não se repetir espalhada pelos orçamentos.
          </p>
        </Panel>
      </div>

      <div className="section-gap">
        <Panel title="Equipe" sub={`${db.users.length} usuários`}>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th style={{ width: 260 }}>E-mail</th>
                  <th style={{ width: 160 }}>Papel</th>
                </tr>
              </thead>
              <tbody>
                {db.users.map((u) => {
                  const papel = USER_ROLE[u.role]
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{u.initials}</span>
                          {u.name}
                        </div>
                      </td>
                      <td className="muted">{u.email}</td>
                      <td><Pill tone={papel.tone}>{papel.label}</Pill></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}
