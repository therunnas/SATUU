import type { ReactNode } from 'react'
import type { Tone } from '../lib/labels'

/** Etiqueta de status. A cor vem sempre do tom declarado em `lib/labels`. */
export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`tag tone-${tone}`}>{children}</span>
}

export function Panel({
  title,
  sub,
  children,
}: {
  title: string
  sub?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2 className="panel-title">{title}</h2>
        {sub != null ? <span className="panel-sub">{sub}</span> : null}
      </div>
      {children}
    </section>
  )
}

export function Stat({
  label,
  value,
  hint,
  dot,
}: {
  label: string
  value: string
  hint?: ReactNode
  dot?: 'atl' | 'btl' | 'fringe' | 'accent'
}) {
  return (
    <div className="card">
      <div className="card-label">
        {dot ? <span className={`dot dot-${dot}`} /> : null}
        {label}
      </div>
      <div className="card-value num">{value}</div>
      {hint != null ? <div className="card-hint">{hint}</div> : null}
    </div>
  )
}

/** Barra de consumo: vira alerta perto do limite e crítica ao estourar. */
export function Meter({ fraction }: { fraction: number }) {
  const pct = Math.min(fraction, 1) * 100
  const classe = fraction > 1 ? 'meter-critico' : fraction > 0.85 ? 'meter-alerta' : 'meter-ok'
  return (
    <div className="meter">
      <span className={classe} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function PageHead({
  eyebrow,
  title,
  sub,
  aside,
}: {
  eyebrow?: string
  title: string
  sub?: ReactNode
  aside?: ReactNode
}) {
  return (
    <header className="page-head">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {sub != null ? <p>{sub}</p> : null}
      </div>
      {aside}
    </header>
  )
}
