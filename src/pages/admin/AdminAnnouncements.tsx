import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchAnnouncements, uploadFile } from '../../lib/api'
import { errMsg, useFetch } from '../../hooks/useFetch'
import { formatDate } from '../../lib/constants'
import { btnDanger, btnGhost, btnPrimary, card, inputCls } from '../../lib/ui'
import type { Announcement } from '../../types'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import ErrorBox from '../../components/ErrorBox'
import {
  Plus,
  Edit2,
  Trash2,
  Pin,
  Calendar,
  Download,
  Upload,
} from 'lucide-react'

/* ---------- Modal Form Pengumuman ---------- */
interface AnnouncementFormProps {
  item: Announcement | null
  onClose: () => void
  onSaved: () => void
}

function AnnouncementForm({ item, onClose, onSaved }: AnnouncementFormProps) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [category, setCategory] = useState(item?.category ?? 'Warta Resmi')
  const [content, setContent] = useState(item?.content ?? '')
  const [isPinned, setIsPinned] = useState(item?.is_pinned ?? false)
  const [isPublished, setIsPublished] = useState(item?.is_published ?? true)
  const [fileUrl, setFileUrl] = useState(item?.file_url ?? '')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let finalFileUrl = fileUrl
      if (docFile) {
        const uploadRes = await uploadFile('org-assets', docFile, 'announcements')
        finalFileUrl = uploadRes.url
      }

      const payload = {
        title: title.trim(),
        category: category.trim() || 'Warta Resmi',
        content: content.trim(),
        is_pinned: isPinned,
        is_published: isPublished,
        file_url: finalFileUrl || null,
      }

      if (item) {
        const { error: err } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', item.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('announcements').insert(payload)
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
      title={item ? 'Ubah Pengumuman' : 'Buat Pengumuman Baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBox message={error} />}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Pengumuman <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Maklumat Musyawarah Tahunan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kategori
          </label>
          <input
            type="text"
            placeholder="Penting, Warta Resmi, Pemberitahuan, dll."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="Tuliskan isi pengumuman secara jelas di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lampiran Dokumen PDF (Opsional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) setDocFile(e.target.files[0])
            }}
            className="block w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-blue-950 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-yellow-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded text-blue-950 focus:ring-yellow-500"
            />
            Sematkan di Atas (Pin)
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
            {saving ? 'Menyimpan...' : 'Simpan Pengumuman'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Komponen Utama AdminAnnouncements ---------- */
export default function AdminAnnouncements() {
  const { data: list, loading, error, reload } = useFetch(
    () => fetchAnnouncements(undefined, false),
    []
  )

  const [activeForm, setActiveForm] = useState<Announcement | null | 'new'>(null)

  const handleDelete = async (item: Announcement) => {
    if (!confirm(`Hapus pengumuman "${item.title}"?`)) return
    try {
      const { error: err } = await supabase.from('announcements').delete().eq('id', item.id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  const handleTogglePin = async (item: Announcement) => {
    try {
      const { error: err } = await supabase
        .from('announcements')
        .update({ is_pinned: !item.is_pinned })
        .eq('id', item.id)
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
            Kelola Pengumuman & Warta Resmi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Terbitkan surat edaran, maklumat, atau warta organisasi lengkap dengan lampiran PDF.
          </p>
        </div>

        <button
          onClick={() => setActiveForm('new')}
          className={`${btnPrimary} shadow-md`}
        >
          <Plus className="h-4 w-4" />
          Buat Pengumuman Baru
        </button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} />}

      <div className="space-y-4">
        {list?.map((item) => (
          <div
            key={item.id}
            className={`${card} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.is_pinned ? 'border-l-4 border-yellow-500 bg-yellow-50/15' : ''
            }`}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {item.is_pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-0.5 font-bold text-blue-950">
                    <Pin className="h-3 w-3" />
                    Disematkan
                  </span>
                )}
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                  {item.category}
                </span>
                <span>{formatDate(item.created_at || '')}</span>
                {!item.is_published && (
                  <span className="rounded-md bg-red-100 px-2 py-0.5 font-bold text-red-700">
                    Draf
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{item.content}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleTogglePin(item)}
                className={`p-2 rounded-lg transition ${
                  item.is_pinned
                    ? 'text-yellow-600 bg-yellow-100'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title={item.is_pinned ? 'Lepas Sematan' : 'Sematkan di Atas'}
              >
                <Pin className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveForm(item)}
                className="p-2 text-slate-500 hover:text-blue-950 transition"
                title="Ubah Pengumuman"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-slate-400 hover:text-red-600 transition"
                title="Hapus Pengumuman"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!loading && list?.length === 0 && (
          <div className={`${card} p-12 text-center text-slate-500`}>
            Belum ada pengumuman yang dibuat. Klik tombol di atas untuk membuat pengumuman pertama.
          </div>
        )}
      </div>

      {activeForm && (
        <AnnouncementForm
          item={activeForm === 'new' ? null : activeForm}
          onClose={() => setActiveForm(null)}
          onSaved={() => {
            setActiveForm(null)
            reload()
          }}
        />
      )}
    </div>
  )
}
