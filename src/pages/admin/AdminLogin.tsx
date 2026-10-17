import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import Logo from '../../components/Logo'
import ErrorBox from '../../components/ErrorBox'
import { btnPrimary, inputCls } from '../../lib/ui'
import { ShieldCheck, ArrowLeft, LogIn } from 'lucide-react'

export default function AdminLogin() {
  const { session, isAdmin, loading } = useAuth()
  const { settings } = useSiteSettings()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Jika sudah login dan terdaftar sebagai admin, alihkan ke dashboard
  if (!loading && session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setError(
        'Supabase belum dihubungkan. Silakan isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.local terlebih dahulu.'
      )
      setBusy(false)
      return
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message || 'Email atau kata sandi tidak sesuai.')
      }
    } catch {
      setError('Terjadi kendala saat menghubungi server autentikasi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-950 shadow-md">
            <Logo className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-blue-950">Portal Pengurus</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {settings.org_name} · {settings.cabinet_name}
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorBox message={error} />
          </div>
        )}

        {session && !loading && !isAdmin && (
          <div className="mb-4">
            <ErrorBox message="Akun Anda berhasil masuk namun belum terdaftar di tabel admin_users. Hubungi administrator sistem." />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email Pengurus
            </label>
            <input
              type="email"
              required
              placeholder="admin@organisasi.id"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className={`${btnPrimary} w-full py-3`}
          >
            <LogIn className="h-4 w-4" />
            {busy ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-950 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Halaman Depan
          </Link>
        </div>
      </div>
    </div>
  )
}
