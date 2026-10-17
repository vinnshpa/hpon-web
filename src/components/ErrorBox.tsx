import { AlertCircle } from 'lucide-react'

export default function ErrorBox({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <div>
        <p className="font-semibold">Perhatian</p>
        <p className="mt-0.5 text-red-700">{message}</p>
      </div>
    </div>
  )
}
