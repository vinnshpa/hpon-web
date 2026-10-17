interface RoleBadgeProps {
  title: string
  variant?: 'gold' | 'emerald' | 'navy' | 'slate' | 'sky'
}

export default function RoleBadge({ title, variant = 'navy' }: RoleBadgeProps) {
  const styles = {
    gold: 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold',
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    navy: 'bg-blue-950 text-yellow-400 border-blue-900 font-bold',
    sky: 'bg-sky-100 text-sky-900 border-sky-300 font-bold',
    slate: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs shadow-2xs transition-transform duration-200 hover:scale-105 ${styles[variant]}`}
    >
      {title}
    </span>
  )
}
