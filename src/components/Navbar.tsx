import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { Menu, X, Shield } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil & Struktur' },
  { to: '/kegiatan', label: 'Kegiatan & Galeri' },
  { to: '/pengumuman', label: 'Pengumuman' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings } = useSiteSettings()
  const { isAdmin } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? 'text-yellow-400 bg-blue-900/70 shadow-xs ring-1 ring-yellow-400/30'
        : 'text-slate-200 hover:text-yellow-400 hover:bg-blue-900/40'
    }`

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-blue-900/70 bg-blue-950/95 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo & Org Name */}
        <Link to="/" className="flex items-center gap-3.5 group" onClick={closeMenu}>
          <div className="relative">
            <Logo className="h-11 w-11 ring-2 ring-yellow-400 shadow-sm transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="leading-tight">
            <span className="block text-base sm:text-lg font-black tracking-wide text-white group-hover:text-yellow-400 transition-colors">
              {settings.org_name}
            </span>
            <span className="block text-xs font-semibold text-yellow-400/90 line-clamp-1">
              {settings.cabinet_name} — Ya’ahowu!
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="ml-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2 text-xs font-black text-blue-950 shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105 active:scale-95"
            >
              <Shield className="h-3.5 w-3.5" />
              Panel Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="ml-3 inline-flex items-center gap-1.5 rounded-xl border border-blue-800 bg-blue-900/40 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-yellow-400 hover:text-yellow-400 hover:bg-blue-900/60"
            >
              <Shield className="h-3.5 w-3.5 text-yellow-400" />
              Portal Pengurus
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl p-2 text-slate-300 hover:bg-blue-900/60 hover:text-white transition md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-blue-900/80 bg-blue-950 px-4 pt-3 pb-5 md:hidden animate-fadeIn">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-blue-900/80 pt-3">
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2.5 text-sm font-black text-blue-950 shadow-md"
                >
                  <Shield className="h-4 w-4" />
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-800 bg-blue-900/50 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-yellow-400"
                >
                  <Shield className="h-4 w-4 text-yellow-400" />
                  Login Portal Pengurus
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
