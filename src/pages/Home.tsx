import { Link } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useFetch } from '../hooks/useFetch'
import { fetchActivities, fetchAnnouncements } from '../lib/api'
import { formatDate } from '../lib/constants'
import { btnPrimary, card } from '../lib/ui'
import ActivityCard from '../components/ActivityCard'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import Avatar from '../components/Avatar'
import {
  ArrowRight,
  Calendar,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  Globe,
  Quote,
  ShieldCheck,
  Megaphone,
} from 'lucide-react'

export default function Home() {
  const { settings } = useSiteSettings()

  const { data, loading, error } = useFetch(async () => {
    const [activities, announcements] = await Promise.all([
      fetchActivities(true),
      fetchAnnouncements(3, true),
    ])
    return {
      activities: activities.slice(0, 3),
      announcements,
    }
  }, [])

  const getPillarIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'graduationcap':
        return <GraduationCap className="h-6 w-6 text-yellow-500" />
      case 'hearthandshake':
        return <HeartHandshake className="h-6 w-6 text-yellow-500" />
      case 'globe':
        return <Globe className="h-6 w-6 text-yellow-500" />
      default:
        return <Sparkles className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-400 ring-1 ring-yellow-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            {settings.cabinet_name}
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            {settings.org_name}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            {settings.org_tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/profil" className={btnPrimary}>
              Kenali Kepengurusan & Struktur
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/kegiatan"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-blue-900/40 px-5 py-2.5 font-semibold text-slate-200 transition hover:border-yellow-500/50 hover:bg-blue-900/80 hover:text-white"
            >
              Agenda & Kegiatan
            </Link>
          </div>
        </div>

        {/* 2. STATISTIK UTAMA (KEY IMPACT NUMBERS) */}
        {settings.stats && settings.stats.length > 0 && (
          <div className="border-t border-blue-900/60 bg-blue-950/80 backdrop-blur-xs py-8">
            <div className="mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
                {settings.stats.map((st, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-3xl sm:text-4xl font-extrabold text-yellow-400">
                      {st.value}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. PILAR GERAKAN / FOKUS ORGANISASI */}
      {settings.pillars && settings.pillars.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
              Pilar Gerakan
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Fokus & Misi Utama Organisasi
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Menjalankan peran transformatif dalam pembinaan intelektual dan pengabdian masyarakat.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {settings.pillars.map((pillar, i) => (
              <div key={i} className={`${card} p-6 border-t-4 border-yellow-500`}>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 shadow-xs">
                  {getPillarIcon(pillar.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SAMBUTAN KETUA UMUM */}
      {settings.leader_welcome?.quote && (
        <section className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <Quote className="absolute right-4 bottom-4 h-36 w-36 text-white/5 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
              <Avatar
                name={settings.leader_welcome.name}
                url={settings.leader_welcome.photo_url}
                className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-yellow-400/50 shadow-md"
              />

              <div className="flex-1 text-center sm:text-left space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sambutan {settings.leader_welcome.title || 'Ketua Umum'}
                </span>

                <blockquote className="text-base sm:text-lg font-medium text-slate-200 italic leading-relaxed">
                  "{settings.leader_welcome.quote}"
                </blockquote>

                <div className="pt-2">
                  <p className="text-base font-bold text-white">
                    {settings.leader_welcome.name}
                  </p>
                  <p className="text-xs text-yellow-400 font-semibold">
                    {settings.leader_welcome.title} — {settings.cabinet_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. KEGIATAN & PENGUMUMAN TERBARU */}
      <div className="mx-auto max-w-6xl px-4 space-y-16">
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}

        {data && (
          <>
            {/* Kegiatan Terbaru */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                    Dokumentasi & Agenda
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Kegiatan Organisasi
                  </h2>
                </div>
                <Link
                  to="/kegiatan"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-950 hover:text-yellow-600 transition"
                >
                  Lihat Semua
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {data.activities.length === 0 ? (
                <div className={`${card} p-8 text-center text-slate-500`}>
                  Belum ada data kegiatan yang dipublikasikan.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.activities.map((act) => (
                    <ActivityCard key={act.id} activity={act} />
                  ))}
                </div>
              )}
            </section>

            {/* Pengumuman Terkini */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                    Warta & Informasi
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Pengumuman Resmi
                  </h2>
                </div>
                <Link
                  to="/pengumuman"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-950 hover:text-yellow-600 transition"
                >
                  Lihat Semua
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {data.announcements.length === 0 ? (
                <div className={`${card} p-8 text-center text-slate-500`}>
                  Belum ada pengumuman resmi.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.announcements.map((item) => (
                    <div
                      key={item.id}
                      className={`${card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.is_pinned ? 'border-l-4 border-yellow-500 bg-yellow-50/20' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {item.is_pinned && (
                            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-blue-950">
                              Disematkan
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at || '')}
                          </span>
                          <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-slate-600 font-medium">
                            {item.category || 'Warta'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {item.content}
                        </p>
                      </div>

                      <Link
                        to="/pengumuman"
                        className="shrink-0 text-xs font-bold text-blue-950 hover:text-yellow-600 flex items-center gap-1"
                      >
                        Baca Lengkap
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
