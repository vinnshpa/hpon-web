import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { fetchAnnouncements } from '../lib/api'
import { formatDate } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import { card } from '../lib/ui'
import { Calendar, Download, Pin, Megaphone, FileText } from 'lucide-react'
import type { Announcement } from '../types'

export default function Announcements() {
  const [selected, setSelected] = useState<Announcement | null>(null)
  const { data: announcements, loading, error } = useFetch(() => fetchAnnouncements(50, true), [])

  return (
    <div>
      <PageHeader
        title="Pengumuman & Warta Resmi"
        subtitle="Pemberitahuan, surat edaran, dan informasi penting resmi dari pengurus organisasi."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}

        {!loading && announcements?.length === 0 && (
          <div className={`${card} p-12 text-center text-slate-500`}>
            <Megaphone className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="text-lg font-bold text-slate-700">Belum Ada Pengumuman</h3>
            <p className="text-sm mt-1">Saat ini belum ada pengumuman resmi yang dipublikasikan.</p>
          </div>
        )}

        <div className="space-y-4">
          {announcements?.map((item) => (
            <article
              key={item.id}
              className={`${card} p-6 transition hover:shadow-md ${
                item.is_pinned ? 'border-l-4 border-yellow-500 bg-yellow-50/15' : ''
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-2">
                {item.is_pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 font-bold text-blue-950">
                    <Pin className="h-3 w-3" />
                    Disematkan
                  </span>
                )}
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-yellow-600" />
                  {formatDate(item.created_at || '')}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                  {item.category || 'Warta'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {item.content}
              </p>

              {item.file_url && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-950 px-3.5 py-2 text-xs font-semibold text-yellow-400 hover:bg-blue-900 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Unduh Dokumen Lampiran
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
