import { Link } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import Logo from './Logo'
import { MapPin, Mail, MessageCircle, Shield } from 'lucide-react'
import { InstagramIcon } from './Icons'

export default function Footer() {
  const { settings } = useSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t-4 border-yellow-500 bg-blue-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">{settings.org_name}</h3>
                <p className="text-xs text-yellow-400 font-semibold">{settings.cabinet_name}</p>
              </div>
            </div>
            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              {settings.org_tagline}
            </p>
            <p className="text-xs text-slate-500">
              Wadah persatuan, pengembangan intelektual, dan pengabdian generasi muda Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-400">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">Beranda</Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-yellow-400 transition">Profil & Struktur</Link>
              </li>
              <li>
                <Link to="/kegiatan" className="hover:text-yellow-400 transition">Kegiatan & Galeri</Link>
              </li>
              <li>
                <Link to="/pengumuman" className="hover:text-yellow-400 transition">Pengumuman Resmi</Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-yellow-400 transition">Hubungi Kami</Link>
              </li>
              <li>
                <Link to="/admin/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition">
                  <Shield className="h-3.5 w-3.5 text-yellow-500" />
                  Portal Pengurus
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-400">
              Sekretariat & Hubungan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
                <span>{settings.contact_info.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-yellow-500" />
                <a href={`mailto:${settings.contact_info.email}`} className="hover:text-white transition">
                  {settings.contact_info.email}
                </a>
              </li>
              {settings.contact_info.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-yellow-500" />
                  <a
                    href={`https://wa.me/${settings.contact_info.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    {settings.contact_info.whatsapp}
                  </a>
                </li>
              )}
              {settings.contact_info.instagram && (
                <li className="flex items-center gap-2">
                  <InstagramIcon className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span className="hover:text-white transition">
                    {settings.contact_info.instagram}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-900/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {settings.org_name}. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="text-slate-400">
            Kredibilitas, Kolaborasi, dan Kontribusi Nyata.
          </p>
        </div>
      </div>
    </footer>
  )
}
