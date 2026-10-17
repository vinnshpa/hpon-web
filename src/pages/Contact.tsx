import { useState, type FormEvent } from 'react'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { submitContactMessage } from '../lib/api'
import PageHeader from '../components/PageHeader'
import ErrorBox from '../components/ErrorBox'
import { btnPrimary, card, inputCls } from '../lib/ui'
import {
  MapPin,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { InstagramIcon } from '../components/Icons'
import { formatInstagramUrl } from '../lib/constants'

/**
 * Konversi otomatis berbagai format URL Google Maps menjadi URL Embed yang valid untuk <iframe>.
 * Mencegah error "www.google.com menolak untuk terhubung".
 */
export function formatMapEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return ''
  const trimmed = rawUrl.trim()

  // 1. Ekstrak src jika pengguna menempelkan tag lengkap <iframe src="...">
  const matchIframe = trimmed.match(/src=["'](.*?)["']/)
  if (matchIframe && matchIframe[1]) return matchIframe[1]

  // 2. Jika sudah berformat embed resmi
  if (trimmed.includes('/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed
  }

  // 3. Khusus shortlink Bimbel Ono Niha Dream (OND) Nias
  if (trimmed.includes('f25KZmt81T4QCKvF6') || trimmed.toLowerCase().includes('ono niha dream')) {
    return 'https://maps.google.com/maps?q=1.2554408,97.6383986&hl=id&z=16&output=embed'
  }

  // 4. Deteksi koordinat @lat,lng di URL
  const matchCoords = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (matchCoords) {
    return `https://maps.google.com/maps?q=${matchCoords[1]},${matchCoords[2]}&hl=id&z=16&output=embed`
  }

  // 5. Deteksi nama tempat di /place/...
  const matchPlace = trimmed.match(/maps\/place\/([^/@?]+)/)
  if (matchPlace) {
    const place = decodeURIComponent(matchPlace[1].replace(/\+/g, ' '))
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&hl=id&z=16&output=embed`
  }

  // 6. Fallback cerdas untuk query pencarian lokasi
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&hl=id&z=16&output=embed`
}

export default function Contact() {
  const { settings } = useSiteSettings()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      await submitContactMessage(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Gagal mengirim pesan.'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  const rawWa = settings.contact_info?.whatsapp?.replace(/\D/g, '') || ''
  const mapsRaw = settings.contact_info?.maps_embed_url || ''
  const mapsEmbed = formatMapEmbedUrl(mapsRaw)

  return (
    <div>
      <PageHeader
        title="Hubungi Kami"
        subtitle="Sampaikan pertanyaan, peluang kemitraan, atau aspirasi Anda secara langsung kepada pengurus."
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Kolom Informasi & Peta */}
          <div className="space-y-6">
            <div className={`${card} p-8 border-l-4 border-yellow-500 space-y-6`}>
              <h2 className="text-xl font-bold text-blue-950">
                Sekretariat & Layanan Informasi
              </h2>

              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-yellow-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">
                      Alamat Sekretariat
                    </span>
                    <span className="font-medium text-slate-800">
                      {settings.contact_info?.address && settings.contact_info.address !== '-'
                        ? settings.contact_info.address
                        : 'Kepulauan Nias & Sekretariat Penghubung Medan, Sumatera Utara'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-yellow-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">
                      Email Resmi
                    </span>
                    <a
                      href={`mailto:${settings.contact_info?.email || 'sekretariat@hpon.org'}`}
                      className="font-medium text-blue-950 hover:text-yellow-600 transition underline"
                    >
                      {settings.contact_info?.email || 'sekretariat@hpon.org'}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-yellow-400">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-slate-400">
                      WhatsApp Humas
                    </span>
                    <span className="font-medium text-slate-800">
                      {settings.contact_info?.whatsapp || '+6281234567890'}
                    </span>
                  </div>
                </li>

                {settings.contact_info?.instagram && (
                  <li className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-yellow-400">
                      <InstagramIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase text-slate-400">
                        Instagram Resmi
                      </span>
                      <a
                        href={formatInstagramUrl(settings.contact_info.instagram)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-800 hover:text-sky-700 hover:underline transition inline-flex items-center gap-1.5"
                      >
                        {settings.contact_info.instagram}
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              {rawWa && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${rawWa}?text=Halo%20Pengurus%20${encodeURIComponent(
                      settings.org_name
                    )},%20saya%20ingin%20bertanya`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat Cepat via WhatsApp
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Google Maps Embed dengan Fallback Smart Converter */}
            {mapsEmbed && (
              <div className={`${card} overflow-hidden`}>
                <div className="h-64 sm:h-80 w-full bg-slate-100">
                  <iframe
                    title="Peta Lokasi Sekretariat"
                    src={mapsEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    Lokasi Sekretariat HPON
                  </span>
                  <a
                    href={mapsRaw || mapsEmbed}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-950 hover:text-yellow-600 transition"
                  >
                    Buka di Aplikasi Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Formulir Kirim Pesan */}
          <div className={`${card} p-8 flex flex-col justify-between`}>
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                  Formulir Aspirasi
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Kirim Pesan ke Pengurus
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Pesan Anda akan masuk langsung ke kotak masuk admin pengurus.
                </p>
              </div>

              {success && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold">Pesan Berhasil Dikirim!</p>
                    <p className="text-xs text-emerald-700">
                      Terima kasih atas pesan Anda. Pengurus akan segera merespons melalui email atau WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6">
                  <ErrorBox message={error} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tuliskan pesan, pertanyaan, atau permohonan kemitraan Anda di sini..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className={`${btnPrimary} w-full py-3`}
                >
                  <Send className="h-4 w-4" />
                  {sending ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
