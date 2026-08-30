import { useDb } from '../state/DbContext'
import { percent } from '../lib/format'
import { PageHead, Panel } from '../components/ui'

export default function Configuracoes() {
  const db = useDb()

  return (
    <div className="page">
      <PageHead
        eyebrow="Configuração"
        title="Configurações"
        sub="Preferências da aplicação e estado da instalação."
      />

      <div className="grid-2">
        <Panel title="Preferências">
          <dl>
            <div className="field"><dt>Idioma</dt><dd>Português do Brasil</dd></div>
            <div className="field"><dt>Moeda</dt><dd>Real · BRL</dd></div>
            <div className="field"><dt>Tema</dt><dd>Segue o sistema</dd></div>
            <div className="field"><dt>Fuso</dt><dd>America/Sao_Paulo</dd></div>
          </dl>
        </Panel>

        <Panel title="Encargos padrão" sub="definidos na produtora">
          <dl>
            {db.organization.defaultFringes.map((f) => (
              <div className="field" key={f.id}>
                <dt>{f.name}</dt>
                <dd className="num">{percent(f.rate, 0)}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="section-gap">
        <Panel title="Estado da instalação">
          <dl>
            <div className="field"><dt>Persistência</dt><dd>Em memória · sem backend</dd></div>
            <div className="field"><dt>Projetos</dt><dd className="num">{db.projects.length}</dd></div>
            <div className="field"><dt>Orçamentos</dt><dd className="num">{db.budgets.length}</dd></div>
            <div className="field"><dt>Despesas</dt><dd className="num">{db.expenses.length}</dd></div>
            <div className="field"><dt>Clientes</dt><dd className="num">{db.clients.length}</dd></div>
          </dl>
          <p className="empty" style={{ padding: '12px 18px', textAlign: 'left' }}>
            Ainda não há banco de dados: os dados vivem em memória e voltam ao estado inicial ao
            recarregar a página. Autenticação, persistência e multiusuário entram por Issues próprias.
          </p>
        </Panel>
      </div>
    </div>
  )
}
