export default function Spinner({ className = 'py-16' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-label="Memuat">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-500" />
      <span className="text-xs font-medium text-slate-500">Memuat data...</span>
    </div>
  )
}
