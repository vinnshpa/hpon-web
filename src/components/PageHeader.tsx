import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  children?: ReactNode
}

export default function PageHeader({ title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-yellow-500 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-yellow-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-400 ring-1 ring-yellow-500/40">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-slate-300">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
