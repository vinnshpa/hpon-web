import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  children?: ReactNode
}

export default function PageHeader({ title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-yellow-400 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 text-white shadow-md">
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-yellow-400/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-yellow-400 ring-1 ring-yellow-400/40 shadow-xs">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-slate-200 font-normal">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
