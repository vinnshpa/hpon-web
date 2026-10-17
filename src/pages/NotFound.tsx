import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl font-black text-yellow-500 drop-shadow-sm">404</span>
      <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Tautan yang Anda tuju mungkin salah, telah dipindahkan, atau tidak lagi tersedia.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-3 font-semibold text-yellow-400 shadow-md transition hover:bg-blue-900"
      >
        <Home className="h-4 w-4" />
        Kembali ke Beranda
      </Link>
    </div>
  )
}
