import { Link } from 'react-router-dom'
import { useDb } from '../state/DbContext'
import { clientTotals } from '../domain/queries'
import { money } from '../lib/format'
import { CLIENT_KIND } from '../lib/labels'
import { PageHead, Panel } from '../components/ui'

export default function Clientes() {
  const db = useDb()

  return (
    <div className="page">
      <PageHead eyebrow="Produção" title="Clientes" sub={`${db.clients.length} contratantes`} />

      <Panel title="Carteira" sub={`${db.clients.length} clientes`}>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th style={{ width: 120 }}>Tipo</th>
                <th style={{ width: 190 }}>Contato</th>
                <th style={{ width: 140 }}>Praça</th>
                <th className="right" style={{ width: 90 }}>Projetos</th>
                <th className="right" style={{ width: 150 }}>Contratado</th>
              </tr>
            </thead>
            <tbody>
              {db.clients.map((cliente) => {
                const totais = clientTotals(db, cliente.id)
                return (
                  <tr key={cliente.id}>
                    <td>
                      <Link className="row-link" to={`/clientes/${cliente.id}`}>{cliente.name}</Link>
                    </td>
                    <td className="muted">{CLIENT_KIND[cliente.kind]}</td>
                    <td>
                      {cliente.contactName}
                      <div className="line-meta">{cliente.contactEmail}</div>
                    </td>
                    <td className="muted">{cliente.city}</td>
                    <td className="right num muted">{totais.projects}</td>
                    <td className="right num">{money(totais.budgeted)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
