import { Link } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import Logo from './Logo'
import { MapPin, Mail, MessageCircle, Shield, Heart, Sparkles } from 'lucide-react'
import { InstagramIcon } from './Icons'

export default function Footer() {
  const { settings } = useSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t-4 border-yellow-400 bg-gradient-to-b from-blue-950 via-slate-950 to-black text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <Logo className="h-12 w-12 ring-2 ring-yellow-400/60 shadow-md" />
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-wide">
                  {settings.org_name}
                </h3>
                <p className="text-xs text-yellow-400 font-bold tracking-wider">
                  {settings.cabinet_name}
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed font-normal">
              {settings.org_tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Membangun masa depan generasi muda Ono Niha melalui penguatan pendidikan, karakter kepemimpinan, dan bakti sosial di seluruh penjuru Nusantara.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-yellow-400">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400 hover:translate-x-1 inline-block transition-transform duration-200">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-yellow-400 hover:translate-x-1 inline-block transition-transform duration-200">
                  Profil & Struktur BPH
                </Link>
              </li>
              <li>
                <Link to="/kegiatan" className="hover:text-yellow-400 hover:translate-x-1 inline-block transition-transform duration-200">
                  Kegiatan & Galeri Foto
                </Link>
              </li>
              <li>
                <Link to="/pengumuman" className="hover:text-yellow-400 hover:translate-x-1 inline-block transition-transform duration-200">
                  Pengumuman Resmi
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-yellow-400 hover:translate-x-1 inline-block transition-transform duration-200">
                  Kontak & Aspirasi
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900/40 px-2.5 py-1 text-xs text-slate-300 hover:bg-yellow-500 hover:text-blue-950 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-yellow-400" />
                  Portal Pengurus
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-yellow-400">
              Sekretariat & Hubungan
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-yellow-400 mt-0.5" />
                <span>{settings.contact_info.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-yellow-400" />
                <a href={`mailto:${settings.contact_info.email}`} className="hover:text-yellow-400 transition">
                  {settings.contact_info.email}
                </a>
              </li>
              {settings.contact_info.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  <a
                    href={`https://wa.me/${settings.contact_info.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-yellow-400 transition"
                  >
                    {settings.contact_info.whatsapp}
                  </a>
                </li>
              )}
              {settings.contact_info.instagram && (
                <li className="flex items-center gap-2.5">
                  <InstagramIcon className="h-4 w-4 shrink-0 text-pink-400" />
                  <span className="hover:text-yellow-400 transition">
                    {settings.contact_info.instagram}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Creator Credit */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blue-900/70 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {year} {settings.org_name}. All rights reserved.</p>

          <p className="text-slate-400">
            Developed by <span className="font-semibold text-slate-200 hover:text-yellow-400 transition-colors">Calvin Sahputra Buulolo</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
