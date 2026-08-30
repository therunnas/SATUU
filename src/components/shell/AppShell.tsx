import { NavLink, Outlet } from 'react-router-dom'
import { useDb } from '../../state/DbContext'
import { USER_ROLE } from '../../lib/labels'

/**
 * Casco da aplicação: sidebar fixa com a navegação e a área de conteúdo.
 *
 * Os grupos da sidebar seguem como a produção pensa — primeiro o que se
 * produz, depois o dinheiro, depois a configuração — e não a ordem em que as
 * telas foram construídas.
 */

const GRUPOS: Array<{ titulo: string; itens: Array<{ para: string; icone: string; texto: string }> }> = [
  {
    titulo: 'Produção',
    itens: [
      { para: '/', icone: '◈', texto: 'Visão geral' },
      { para: '/projetos', icone: '▤', texto: 'Projetos' },
      { para: '/clientes', icone: '◇', texto: 'Clientes' },
    ],
  },
  {
    titulo: 'Financeiro',
    itens: [
      { para: '/custos', icone: '◐', texto: 'Rastreamento de custo' },
      { para: '/despesas', icone: '≡', texto: 'Despesas' },
    ],
  },
  {
    titulo: 'Configuração',
    itens: [
      { para: '/produtora', icone: '⌂', texto: 'Produtora' },
      { para: '/configuracoes', icone: '⚙', texto: 'Configurações' },
    ],
  },
]

export function AppShell() {
  const db = useDb()
  const papel = USER_ROLE[db.currentUser.role]

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Navegação principal">
        <div className="sidebar-brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>SATUU</strong>
            <span>{db.organization.name}</span>
          </div>
        </div>

        {GRUPOS.map((grupo) => (
          <div className="nav-group" key={grupo.titulo}>
            <div className="nav-title">{grupo.titulo}</div>
            {grupo.itens.map((item) => (
              <NavLink
                key={item.para}
                to={item.para}
                end={item.para === '/'}
                className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
              >
                <span className="nav-icon" aria-hidden>{item.icone}</span>
                {item.texto}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar-foot">
          <NavLink to="/perfil" className="who">
            <span className="avatar">{db.currentUser.initials}</span>
            <span>
              <span className="who-name">{db.currentUser.name}</span>
              <span className="who-role">{papel.label}</span>
            </span>
          </NavLink>
        </div>
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
