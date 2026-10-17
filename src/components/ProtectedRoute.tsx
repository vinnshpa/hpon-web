import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'
import { ShieldAlert } from 'lucide-react'

export default function ProtectedRoute() {
  const { session, isAdmin, loading, signOut } = useAuth()

  if (loading) return <Spinner />

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto my-16 max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Akses Ditolak</h1>
        <p className="mb-6 text-sm text-slate-600">
          Akun Anda ({session.user.email}) belum didaftarkan sebagai Administrator/Pengurus di sistem.
        </p>
        <button
          onClick={signOut}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Keluar dari Akun
        </button>
      </div>
    )
  }

  return <Outlet />
}
