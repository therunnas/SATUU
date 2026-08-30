import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from './App'
import { DbProvider } from './state/DbContext'
import './index.css'

/**
 * O roteador é escolhido na build.
 *
 * `BrowserRouter` é o do produto: URLs reais, que se pode copiar e recarregar.
 * `MemoryRouter` existe para quando a aplicação é publicada sob um caminho que
 * ela não controla — uma prévia hospedada, por exemplo. Ali o BrowserRouter
 * leria o caminho do host como se fosse uma rota nossa e cairia no 404 já na
 * primeira renderização.
 *
 *   VITE_ROUTER=memory npm run build
 */
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <DbProvider>
        <App />
      </DbProvider>
    </Router>
  </StrictMode>,
)
