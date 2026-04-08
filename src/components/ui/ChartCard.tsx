import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  subtitle: string
  children: ReactNode
}

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    // Tarjeta con ancho controlado para evitar desbordes de canvas en secciones estrechas.
    <article className="mx-auto w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6">
      <header className="mb-4 space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <h3 className="font-['Manrope'] text-xl font-extrabold text-slate-900">{subtitle}</h3>
      </header>

      <div className="h-64 w-full min-w-0 sm:h-72">{children}</div>
    </article>
  )
}

export default ChartCard