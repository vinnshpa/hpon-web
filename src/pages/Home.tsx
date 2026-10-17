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
        return <GraduationCap className="h-6 w-6 text-yellow-400" />
      case 'hearthandshake':
        return <HeartHandshake className="h-6 w-6 text-yellow-400" />
      case 'globe':
        return <Globe className="h-6 w-6 text-yellow-400" />
      default:
        return <Sparkles className="h-6 w-6 text-yellow-400" />
    }
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION DENGAN LOGO RESMI & ANIMASI */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-950 to-blue-900 text-white">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-20 sm:pb-28 text-center">
          {/* Logo dengan animasi melayang lembut */}
          <div className="mx-auto mb-6 flex justify-center">
            <div className="relative animate-float">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-400 via-yellow-400 to-amber-500 opacity-40 blur-lg animate-pulse-glow" />
              <img
                src="/logo.png"
                alt="Logo Haga Pendidikan Ono Niha"
                className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full object-contain ring-4 ring-yellow-400 shadow-2xl bg-sky-200"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400 ring-1 ring-yellow-400/40 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            {settings.cabinet_name}
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-6xl text-white">
            {settings.org_name}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-xl text-slate-200 leading-relaxed font-normal">
            {settings.org_tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/profil" className={btnPrimary}>
              Kenali Kepengurusan & Struktur
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/kegiatan"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-blue-900/40 px-5 py-2.5 font-bold text-slate-200 transition-all duration-200 hover:border-yellow-400 hover:bg-blue-900/80 hover:text-white hover:-translate-y-0.5 active:translate-y-0"
            >
              Agenda & Kegiatan
            </Link>
          </div>
        </div>

        {/* 2. STATISTIK UTAMA (KEY IMPACT METRICS) */}
        {settings.stats && settings.stats.length > 0 && (
          <div className="border-t border-blue-900/70 bg-blue-950/90 backdrop-blur-md py-8">
            <div className="mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
                {settings.stats.map((st, i) => (
                  <div
                    key={i}
                    className="space-y-1 p-3 rounded-xl transition-all duration-300 hover:bg-blue-900/30 hover:scale-105"
                  >
                    <p className="text-3xl sm:text-4xl font-black text-yellow-400 drop-shadow-xs">
                      {st.value}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-300">
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
            <span className="text-xs font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Pilar Gerakan
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-blue-950">
              Fokus & Misi Utama Organisasi
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Menjalankan peran pencerahan intelektual, persaudaraan, dan pengabdian bagi generasi Ono Niha.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {settings.pillars.map((pillar, i) => (
              <div
                key={i}
                className={`${card} p-7 border-t-4 border-yellow-400 hover:border-sky-500 hover:shadow-xl transition-all duration-300`}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 shadow-md ring-2 ring-yellow-400/40">
                  {getPillarIcon(pillar.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
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
          <div className="rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <Quote className="absolute right-4 bottom-4 h-40 w-40 text-white/5 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
              <Avatar
                name={settings.leader_welcome.name}
                url={settings.leader_welcome.photo_url}
                position={settings.leader_welcome.photo_position || 'top'}
                className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-yellow-400 shadow-xl"
              />

              <div className="flex-1 text-center sm:text-left space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3.5 py-1 text-xs font-black text-yellow-400 ring-1 ring-yellow-400/40">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {settings.leader_welcome?.card_title || 'Sambutan Ketua Umum'}
                </span>

                <blockquote className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
                  "{settings.leader_welcome.quote}"
                </blockquote>

                <div className="pt-2">
                  <p className="text-base font-extrabold text-white">
                    {settings.leader_welcome.name}
                  </p>
                  <p className="text-xs text-yellow-400 font-bold">
                    {settings.leader_welcome.title}
                    {settings.cabinet_name && (
                      <span className="text-slate-300 font-normal"> · {settings.cabinet_name}</span>
                    )}
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
                  <span className="text-xs font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                    Dokumentasi & Agenda
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-950">
                    Kegiatan Organisasi
                  </h2>
                </div>
                <Link
                  to="/kegiatan"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-950 hover:text-sky-600 transition"
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
                  <span className="text-xs font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                    Warta & Informasi
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-950">
                    Pengumuman Resmi
                  </h2>
                </div>
                <Link
                  to="/pengumuman"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-950 hover:text-sky-600 transition"
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
                      className={`${card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-md ${
                        item.is_pinned ? 'border-l-4 border-yellow-400 bg-yellow-50/30' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {item.is_pinned && (
                            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-[10px] font-black text-blue-950">
                              Disematkan
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-sky-600" />
                            {formatDate(item.created_at || '')}
                          </span>
                          <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-slate-600 font-semibold">
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
                        className="shrink-0 text-xs font-bold text-blue-950 hover:text-sky-600 flex items-center gap-1 transition"
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
