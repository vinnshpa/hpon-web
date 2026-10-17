import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { Menu, X, Shield, ExternalLink } from 'lucide-react'

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
    `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive
        ? 'text-yellow-400 bg-blue-900/50 shadow-xs'
        : 'text-slate-200 hover:text-yellow-400 hover:bg-blue-900/30'
    }`

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-blue-900/60 bg-blue-950/95 backdrop-blur-md text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        {/* Logo & Org Name */}
        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <Logo className="h-10 w-10 transition duration-300 group-hover:scale-105" />
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-wide text-white group-hover:text-yellow-400 transition">
              {settings.org_name}
            </span>
            <span className="block text-xs font-medium text-slate-300 line-clamp-1">
              {settings.cabinet_name}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="ml-3 inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-3.5 py-1.5 text-xs font-bold text-blue-950 shadow-sm transition hover:bg-yellow-400"
            >
              <Shield className="h-3.5 w-3.5" />
              Panel Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="ml-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-blue-900/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-yellow-500/50 hover:text-white"
            >
              <Shield className="h-3.5 w-3.5 text-yellow-500" />
              Pengurus
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-blue-900 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-blue-900 bg-blue-950 px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col gap-1">
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
                  className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-blue-950"
                >
                  <Shield className="h-4 w-4" />
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-lg border border-blue-800 bg-blue-900/50 px-4 py-2 text-sm font-medium text-slate-200"
                >
                  <Shield className="h-4 w-4 text-yellow-500" />
                  Login Pengurus
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
