import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import {
  fetchActivities,
  fetchActivityPhotos,
  uploadFile,
  removeFiles,
} from '../../lib/api'
import { errMsg, useFetch } from '../../hooks/useFetch'
import { formatDate } from '../../lib/constants'
import { btnDanger, btnGhost, btnPrimary, card, inputCls } from '../../lib/ui'
import type { Activity, ActivityPhoto } from '../../types'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import ErrorBox from '../../components/ErrorBox'
import {
  Plus,
  Edit2,
  Trash2,
  Images,
  Upload,
  Calendar,
  MapPin,
  Check,
} from 'lucide-react'

/* ---------- Modal Form Kegiatan ---------- */
interface ActivityFormProps {
  activity: Activity | null
  onClose: () => void
  onSaved: () => void
}

function ActivityForm({ activity, onClose, onSaved }: ActivityFormProps) {
  const [title, setTitle] = useState(activity?.title ?? '')
  const [category, setCategory] = useState(activity?.category ?? 'Program Kerja')
  const [description, setDescription] = useState(activity?.description ?? '')
  const [location, setLocation] = useState(activity?.location ?? '')
  const [eventDate, setEventDate] = useState(
    activity?.event_date ?? new Date().toISOString().slice(0, 10)
  )
  const [isUpcoming, setIsUpcoming] = useState(activity?.is_upcoming ?? false)
  const [isPublished, setIsPublished] = useState(activity?.is_published ?? true)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let coverUrl = activity?.cover_url ?? null
      if (coverFile) {
        const uploadRes = await uploadFile('activity-photos', coverFile, 'covers')
        coverUrl = uploadRes.url
      }

      const payload = {
        title: title.trim(),
        category: category.trim() || 'Program Kerja',
        description: description.trim() || null,
        location: location.trim() || null,
        event_date: eventDate,
        is_upcoming: isUpcoming,
        is_published: isPublished,
        cover_url: coverUrl,
      }

      if (activity) {
        const { error: err } = await supabase
          .from('activities')
          .update(payload)
          .eq('id', activity.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('activities').insert(payload)
        if (err) throw err
      }

      onSaved()
    } catch (err: unknown) {
      setError(errMsg(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={activity ? 'Ubah Informasi Kegiatan' : 'Tambah Kegiatan Baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBox message={error} />}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Rapat Kerja Nasional 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Agenda
            </label>
            <input
              type="text"
              placeholder="Program Kerja, Sosial, Pelatihan, dll."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lokasi Kegiatan
          </label>
          <input
            type="text"
            placeholder="Contoh: Gedung Pertemuan Medan / Daring"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi / Laporan Ringkas Kegiatan
          </label>
          <textarea
            rows={4}
            placeholder="Rincian agenda, tujuan, dan poin hasil kegiatan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Foto Sampul (Cover Image)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setCoverFile(e.target.files[0])
            }}
            className="block w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-blue-950 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-yellow-400 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
              className="rounded text-blue-950 focus:ring-yellow-500"
            />
            Agenda Mendatang (Belum Terlaksana)
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-blue-950 focus:ring-yellow-500"
            />
            Tayangkan ke Publik
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Menyimpan...' : 'Simpan Kegiatan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Modal Pengelola Album Foto Kegiatan ---------- */
interface PhotoManagerProps {
  activity: Activity
  onClose: () => void
  onChanged: () => void
}

function PhotoManager({ activity, onClose, onChanged }: PhotoManagerProps) {
  const { data: photos, loading, error, reload } = useFetch(
    () => fetchActivityPhotos(activity.id),
    [activity.id]
  )

  const [uploading, setUploading] = useState(false)
  const [progressMsg, setProgressMsg] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const handleUploadMultiple = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setMsg(null)

    try {
      for (let i = 0; i < files.length; i++) {
        setProgressMsg(`Mengunggah foto ${i + 1} dari ${files.length}...`)
        const file = files[i]
        const { url, path } = await uploadFile('activity-photos', file, activity.id)

        await supabase.from('activity_photos').insert({
          activity_id: activity.id,
          photo_url: url,
          storage_path: path,
        })
      }
      reload()
      onChanged()
      setMsg('Foto dokumentasi berhasil ditambahkan!')
    } catch (e: unknown) {
      setMsg(errMsg(e))
    } finally {
      setUploading(false)
      setProgressMsg(null)
    }
  }

  const handleDeletePhoto = async (photo: ActivityPhoto) => {
    if (!confirm('Hapus foto dokumentasi ini?')) return
    try {
      await removeFiles('activity-photos', [photo.storage_path])
      await supabase.from('activity_photos').delete().eq('id', photo.id)
      reload()
      onChanged()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  const handleSetCover = async (photoUrl: string) => {
    try {
      await supabase.from('activities').update({ cover_url: photoUrl }).eq('id', activity.id)
      setMsg('Foto berhasil ditetapkan sebagai cover utama!')
      onChanged()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  return (
    <Modal title={`Album Galeri: ${activity.title}`} onClose={onClose} wide>
      <div className="space-y-4">
        {/* Upload bar */}
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            Unggah Foto Dokumentasi (Bisa Pilih Banyak Foto Sekaligus)
          </p>
          <p className="text-xs text-slate-500 mb-3">Format JPG, PNG, atau WebP (maks. 10 MB per foto)</p>
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-950 px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-blue-900 transition shadow-sm">
            <span>Pilih Foto dari Komputer</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => handleUploadMultiple(e.target.files)}
            />
          </label>
        </div>

        {progressMsg && (
          <p className="text-center text-xs font-semibold text-yellow-700 animate-pulse">
            {progressMsg}
          </p>
        )}

        {msg && (
          <p className="rounded-lg bg-emerald-50 p-2 text-center text-xs font-medium text-emerald-800">
            {msg}
          </p>
        )}

        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}

        {photos && photos.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-6 italic">
            Belum ada foto dalam album dokumentasi kegiatan ini.
          </p>
        )}

        {/* Photos grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 max-h-[50vh] overflow-y-auto pr-1">
          {photos?.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-square shadow-xs"
            >
              <img
                src={photo.photo_url}
                alt="Dokumentasi"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                <button
                  onClick={() => handleSetCover(photo.photo_url)}
                  className="rounded bg-yellow-500 px-2 py-1 text-[10px] font-bold text-blue-950 hover:bg-yellow-400"
                >
                  Jadikan Cover
                </button>

                <button
                  onClick={() => handleDeletePhoto(photo)}
                  className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-700 self-end"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ---------- Komponen Utama AdminActivities ---------- */
export default function AdminActivities() {
  const { data: activities, loading, error, reload } = useFetch(
    () => fetchActivities(false),
    []
  )

  const [formActivity, setFormActivity] = useState<Activity | null | 'new'>(null)
  const [albumActivity, setAlbumActivity] = useState<Activity | null>(null)

  const handleDelete = async (a: Activity) => {
    if (!confirm(`Hapus kegiatan "${a.title}" beserta seluruh foto dokumentasinya?`)) return
    try {
      const photos = await fetchActivityPhotos(a.id)
      if (photos.length > 0) {
        await removeFiles(
          'activity-photos',
          photos.map((p) => p.storage_path)
        )
      }
      const { error: err } = await supabase.from('activities').delete().eq('id', a.id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-950">
            Kelola Kegiatan & Galeri Dokumentasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah agenda kegiatan baru, tentukan status pelaksanaan, dan unggah foto dokumentasi ke album.
          </p>
        </div>

        <button
          onClick={() => setFormActivity('new')}
          className={`${btnPrimary} shadow-md`}
        >
          <Plus className="h-4 w-4" />
          Tambah Kegiatan Baru
        </button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} />}

      <div className="space-y-4">
        {activities?.map((a) => (
          <div
            key={a.id}
            className={`${card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                {a.cover_url ? (
                  <img src={a.cover_url} alt={a.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-950 text-[10px] text-yellow-400 text-center p-1 font-semibold">
                    No Cover
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {a.category}
                  </span>
                  {a.is_upcoming ? (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      Mendatang
                    </span>
                  ) : (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      Terlaksana
                    </span>
                  )}
                  {!a.is_published && (
                    <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                      DRAF (Sembunyi)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base truncate">
                  {a.title}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                  <span>{formatDate(a.event_date)}</span>
                  {a.location && <span>• {a.location}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setAlbumActivity(a)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-bold text-yellow-400 hover:bg-blue-900 transition"
              >
                <Images className="h-3.5 w-3.5" />
                Kelola Album Foto
              </button>
              <button
                onClick={() => setFormActivity(a)}
                className="p-2 text-slate-500 hover:text-blue-950 transition"
                title="Ubah info kegiatan"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(a)}
                className="p-2 text-slate-400 hover:text-red-600 transition"
                title="Hapus kegiatan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!loading && activities?.length === 0 && (
          <div className={`${card} p-12 text-center text-slate-500`}>
            Belum ada kegiatan. Klik tombol "Tambah Kegiatan Baru" untuk mulai menambahkan agenda.
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Ubah */}
      {formActivity && (
        <ActivityForm
          activity={formActivity === 'new' ? null : formActivity}
          onClose={() => setFormActivity(null)}
          onSaved={() => {
            setFormActivity(null)
            reload()
          }}
        />
      )}

      {/* Modal Album Dokumentasi Foto */}
      {albumActivity && (
        <PhotoManager
          activity={albumActivity}
          onClose={() => setAlbumActivity(null)}
          onChanged={() => reload()}
        />
      )}
    </div>
  )
}
