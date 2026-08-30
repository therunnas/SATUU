import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import Dashboard from './pages/Dashboard'
import Projetos from './pages/Projetos'
import ProjetoDetalhe from './pages/ProjetoDetalhe'
import Orcamento from './pages/Orcamento'
import Custos from './pages/Custos'
import Despesas from './pages/Despesas'
import Clientes from './pages/Clientes'
import ClienteDetalhe from './pages/ClienteDetalhe'
import Produtora from './pages/Produtora'
import Perfil from './pages/Perfil'
import Configuracoes from './pages/Configuracoes'
import NaoEncontradoPagina from './pages/NaoEncontrado'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/:id" element={<ProjetoDetalhe />} />
        <Route path="/projetos/:id/orcamento" element={<Orcamento />} />
        <Route path="/custos" element={<Custos />} />
        <Route path="/despesas" element={<Despesas />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/:id" element={<ClienteDetalhe />} />
        <Route path="/produtora" element={<Produtora />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NaoEncontradoPagina />} />
      </Route>
    </Routes>
  )
}
