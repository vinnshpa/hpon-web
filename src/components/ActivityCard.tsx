import { Link } from 'react-router-dom'
import type { Activity } from '../types'
import { formatDate } from '../lib/constants'
import { card } from '../lib/ui'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className={`${card} group flex flex-col overflow-hidden`}>
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        {activity.cover_url ? (
          <img
            src={activity.cover_url}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-950 text-sm font-medium text-yellow-400">
            Dokumentasi Kegiatan
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-blue-950/80 px-2.5 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-xs ring-1 ring-yellow-500/30">
            {activity.category || 'Program Kerja'}
          </span>
        </div>
        {activity.is_upcoming && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Mendatang
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-yellow-700">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(activity.event_date)}
          </span>
          {activity.location && (
            <span className="flex items-center gap-1 truncate max-w-[200px]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {activity.location}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition line-clamp-2">
          {activity.title}
        </h3>

        {activity.description && (
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">
            {activity.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            to={`/kegiatan/${activity.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-950 group-hover:text-yellow-600 transition"
          >
            Lihat Detail & Dokumentasi
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}
