import { useSiteSettings } from '../context/SiteSettingsContext'
import { useFetch } from '../hooks/useFetch'
import { fetchOrgStructure } from '../lib/api'
import PageHeader from '../components/PageHeader'
import OrgTree from '../components/OrgTree'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import { card } from '../lib/ui'
import { FileText, Download, CheckCircle, Target, BookOpen } from 'lucide-react'

export default function Profile() {
  const { settings } = useSiteSettings()

  const { data, loading, error } = useFetch(fetchOrgStructure, [])

  return (
    <div>
      <PageHeader
        title="Profil Organisasi & Kepengurusan"
        subtitle={`Mengenal lebih dekat visi, misi, legalitas, serta jajaran pengurus ${settings.org_name}.`}
        badge={settings.cabinet_name}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        {/* 1. TENTANG KAMI */}
        <section className={`${card} p-8 sm:p-10 border-l-4 border-yellow-500`}>
          <div className="flex items-center gap-2.5 mb-3 text-blue-950 font-bold text-lg">
            <BookOpen className="h-5 w-5 text-yellow-600" />
            <h2>Tentang Kami</h2>
          </div>
          <p className="text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            {settings.about_text}
          </p>
        </section>

        {/* 2. VISI & MISI */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* Visi */}
          <div className={`${card} p-8 border-t-4 border-blue-900 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-3 text-blue-950 font-bold text-lg">
                <Target className="h-5 w-5 text-yellow-600" />
                <h3>Visi Organisasi</h3>
              </div>
              <p className="text-base font-medium text-slate-800 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                "{settings.vision}"
              </p>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Landasan filosofis pergerakan dan cita-cita jangka panjang seluruh kader.
            </p>
          </div>

          {/* Misi */}
          <div className={`${card} p-8 border-t-4 border-yellow-500`}>
            <div className="flex items-center gap-2 mb-3 text-blue-950 font-bold text-lg">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              <h3>Misi Strategis</h3>
            </div>
            <ul className="space-y-3">
              {settings.missions?.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-bold text-blue-950">
                    {idx + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. DOKUMEN PUBLIK / AD-ART */}
        {settings.documents && settings.documents.length > 0 && (
          <section className="rounded-2xl bg-blue-950 text-white p-8 sm:p-10 shadow-lg">
            <div className="max-w-xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Transparansi & Legalitas
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Pusat Dokumen Resmi Organisasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Dokumen konstitusi, ketetapan musyawarah, dan panduan organisasi yang dapat diakses publik.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {settings.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-xl border border-blue-900 bg-blue-900/40 p-4 transition hover:border-yellow-500/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-1">{doc.desc}</p>
                    </div>
                  </div>

                  {doc.file_url ? (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-blue-950 transition hover:bg-yellow-400"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Unduh
                    </a>
                  ) : (
                    <span className="shrink-0 rounded-md bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                      Tersedia di Sekretariat
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. STRUKTUR KEPENGURUSAN DINAMIS */}
        <section className="pt-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">
              Bagan Kepengurusan
            </span>
            <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-blue-950">
              Struktur Organisasi & Jajaran
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Susunan dewan pembina, pengurus harian inti, koordinator bidang, serta jajaran koordinator wilayah.
            </p>
          </div>

          {loading && <Spinner />}
          {error && <ErrorBox message={error} />}

          {data && (
            <OrgTree units={data.units} positions={data.positions} />
          )}
        </section>
      </div>
    </div>
  )
}
