import { Link } from 'react-router-dom'

export function NaoEncontrado({ o = 'registro' }: { o?: string }) {
  return (
    <div className="page">
      <PageHeadSimples o={o} />
    </div>
  )
}

function PageHeadSimples({ o }: { o: string }) {
  return (
    <>
      <h1>Não encontrado</h1>
      <p style={{ color: 'var(--txt-2)' }}>
        Não existe {o} com esse endereço. Ele pode ter sido removido, ou o link está errado.
      </p>
      <p><Link className="row-link" to="/">← Voltar para a visão geral</Link></p>
    </>
  )
}

export default function NaoEncontradoPagina() {
  return <NaoEncontrado o="página" />
}
