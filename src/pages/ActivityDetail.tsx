import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { fetchActivity, fetchActivityPhotos } from '../lib/api'
import { formatDate } from '../lib/constants'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import { card } from '../lib/ui'
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Images,
  Maximize2,
  X,
} from 'lucide-react'

export default function ActivityDetail() {
  const { id = '' } = useParams()
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const { data, loading, error } = useFetch(async () => {
    const [act, photos] = await Promise.all([
      fetchActivity(id),
      fetchActivityPhotos(id),
    ])
    return { activity: act, photos }
  }, [id])

  if (loading) return <Spinner />
  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <ErrorBox message={error} />
      </div>
    )
  }

  if (!data?.activity) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Kegiatan Tidak Ditemukan</h2>
        <p className="mt-2 text-sm text-slate-600">
          Data kegiatan yang Anda cari mungkin telah dihapus atau belum dipublikasikan.
        </p>
        <Link
          to="/kegiatan"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-yellow-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Kegiatan
        </Link>
      </div>
    )
  }

  const { activity, photos } = data

  return (
    <div>
      <PageHeader
        title={activity.title}
        badge={activity.category || 'Program Kerja'}
        subtitle={`${formatDate(activity.event_date)}${
          activity.location ? ` • ${activity.location}` : ''
        }`}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <Link
          to="/kegiatan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-950 hover:text-yellow-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Semua Kegiatan & Agenda
        </Link>

        {/* Cover image if available */}
        {activity.cover_url && (
          <div className="overflow-hidden rounded-2xl shadow-md">
            <img
              src={activity.cover_url}
              alt={activity.title}
              className="h-80 w-full object-cover sm:h-96"
            />
          </div>
        )}

        {/* Meta info */}
        <div className={`${card} p-6 sm:p-8 space-y-6`}>
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold text-yellow-700">
              <Calendar className="h-4 w-4" />
              {formatDate(activity.event_date)}
            </span>
            {activity.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {activity.location}
              </span>
            )}
            {activity.is_upcoming && (
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                Agenda Mendatang
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tentang Kegiatan</h3>
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {activity.description || 'Tidak ada deskripsi rinci untuk kegiatan ini.'}
            </p>
          </div>
        </div>

        {/* Galeri Foto Album */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-yellow-600" />
            <h3 className="text-xl font-bold text-blue-950">
              Galeri Dokumentasi Foto ({photos.length})
            </h3>
          </div>

          {photos.length === 0 ? (
            <div className={`${card} p-8 text-center text-sm text-slate-500`}>
              Belum ada foto dokumentasi yang diunggah ke album kegiatan ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.photo_url)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-200 aspect-square shadow-xs transition hover:shadow-lg"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || activity.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Maximize2 className="h-6 w-6" />
                  </div>
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-white">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedPhoto}
            alt="Preview Dokumentasi"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
