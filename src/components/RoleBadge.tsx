interface RoleBadgeProps {
  title: string
  variant?: 'gold' | 'emerald' | 'navy' | 'slate'
}

export default function RoleBadge({ title, variant = 'navy' }: RoleBadgeProps) {
  const styles = {
    gold: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    navy: 'bg-blue-900 text-yellow-400 border-blue-800',
    slate: 'bg-slate-100 text-slate-800 border-slate-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold shadow-xs ${styles[variant]}`}
    >
      {title}
    </span>
  )
}
