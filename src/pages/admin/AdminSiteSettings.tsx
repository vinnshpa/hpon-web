import { useState, useEffect, type FormEvent } from 'react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { updateSiteSettings, uploadFile } from '../../lib/api'
import { DEFAULT_SETTINGS } from '../../lib/constants'
import { btnGhost, btnPrimary, card, inputCls } from '../../lib/ui'
import ErrorBox from '../../components/ErrorBox'
import Avatar from '../../components/Avatar'
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  Target,
  Sparkles,
  Phone,
  FileText,
  UserCheck,
} from 'lucide-react'
import type { SiteSettings } from '../../types'

export default function AdminSiteSettings() {
  const { settings, refreshSettings } = useSiteSettings()

  // Helper untuk memastikan tidak ada property yang bernilai null/undefined
  const normalizeSettings = (s: Partial<SiteSettings>): SiteSettings => ({
    ...DEFAULT_SETTINGS,
    ...s,
    leader_welcome: {
      ...DEFAULT_SETTINGS.leader_welcome,
      ...(s?.leader_welcome || {}),
    },
    contact_info: {
      ...DEFAULT_SETTINGS.contact_info,
      ...(s?.contact_info || {}),
    },
    stats: s?.stats?.length ? s.stats : DEFAULT_SETTINGS.stats,
    missions: s?.missions?.length ? s.missions : DEFAULT_SETTINGS.missions,
    pillars: s?.pillars?.length ? s.pillars : DEFAULT_SETTINGS.pillars,
    documents: s?.documents?.length ? s.documents : DEFAULT_SETTINGS.documents,
  })

  const [form, setForm] = useState<SiteSettings>(() => normalizeSettings(settings))
  const [leaderPhoto, setLeaderPhoto] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sinkronkan form saat data terbaru selesai diambil dari database
  useEffect(() => {
    if (settings) {
      setForm(normalizeSettings(settings))
    }
  }, [settings])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let leaderPhotoUrl = form.leader_welcome?.photo_url || ''

      // Jika ada file foto ketua umum baru diunggah
      if (leaderPhoto) {
        const uploadRes = await uploadFile('org-assets', leaderPhoto, 'leader')
        leaderPhotoUrl = uploadRes.url
      }

      const updatedData: SiteSettings = {
        ...form,
        leader_welcome: {
          ...form.leader_welcome,
          photo_url: leaderPhotoUrl,
        },
      }

      await updateSiteSettings(updatedData)
      await refreshSettings()
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }

  // Helper Misi
  const handleAddMission = () => {
    setForm({
      ...form,
      missions: [...(form.missions || []), ''],
    })
  }

  const handleUpdateMission = (index: number, val: string) => {
    const next = [...(form.missions || [])]
    next[index] = val
    setForm({ ...form, missions: next })
  }

  const handleRemoveMission = (index: number) => {
    setForm({
      ...form,
      missions: form.missions.filter((_, i) => i !== index),
    })
  }

  // Helper Stats
  const handleUpdateStat = (index: number, field: 'value' | 'label', val: string) => {
    const next = [...(form.stats || [])]
    next[index] = { ...next[index], [field]: val }
    setForm({ ...form, stats: next })
  }

  // Helper Dokumen
  const handleAddDocument = () => {
    setForm({
      ...form,
      documents: [
        ...(form.documents || []),
        { title: '', desc: '', file_url: '' },
      ],
    })
  }

  const handleUpdateDocument = (index: number, field: 'title' | 'desc' | 'file_url', val: string) => {
    const next = [...(form.documents || [])]
    next[index] = { ...next[index], [field]: val }
    setForm({ ...form, documents: next })
  }

  const handleRemoveDocument = (index: number) => {
    setForm({
      ...form,
      documents: form.documents.filter((_, i) => i !== index),
    })
  }

  const handleUploadDocFile = async (index: number, file: File) => {
    try {
      const res = await uploadFile('org-assets', file, 'documents')
      handleUpdateDocument(index, 'file_url', res.url)
    } catch (e: unknown) {
      alert('Gagal mengunggah dokumen: ' + ((e as { message?: string })?.message || 'Error'))
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-950">
            Pengaturan Website & Konten CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seluruh teks profil, visi-misi, sambutan ketua umum, dan kontak dapat diperbarui langsung dari sini.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`${btnPrimary} px-6 py-2.5 shadow-md`}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="font-semibold">Perubahan berhasil disimpan dan langsung tayang di website!</p>
        </div>
      )}

      {error && <ErrorBox message={error} />}

      {/* 1. INFORMASI DASAR ORGANISASI */}
      <div className={`${card} p-6 sm:p-8 space-y-5 border-t-4 border-blue-950`}>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-slate-900 text-lg">Identitas Pokok Organisasi</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Organisasi
            </label>
            <input
              type="text"
              required
              value={form.org_name || ''}
              onChange={(e) => setForm({ ...form, org_name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Kabinet / Periode Kepengurusan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kabinet Sinergi Progresif 2024–2025"
              value={form.cabinet_name || ''}
              onChange={(e) => setForm({ ...form, cabinet_name: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tagline / Slogan Organisasi
          </label>
          <input
            type="text"
            required
            value={form.org_tagline || ''}
            onChange={(e) => setForm({ ...form, org_tagline: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      {/* 2. SAMBUTAN KETUA UMUM */}
      <div className={`${card} p-6 sm:p-8 space-y-5 border-t-4 border-yellow-500`}>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserCheck className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-slate-900 text-lg">Sambutan Ketua Umum (Tampil di Beranda)</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3 text-center sm:text-left">
            <label className="block text-xs font-semibold text-slate-700">Foto Ketua Umum</label>
            <Avatar
              name={form.leader_welcome?.name || 'Ketua Umum'}
              url={leaderPhoto ? URL.createObjectURL(leaderPhoto) : (form.leader_welcome?.photo_url || null)}
              className="h-28 w-28 mx-auto sm:mx-0 ring-4 ring-yellow-400/50"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setLeaderPhoto(e.target.files[0])
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-blue-950 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-yellow-400 hover:file:bg-blue-900 cursor-pointer"
            />
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ketua Umum</label>
                <input
                  type="text"
                  value={form.leader_welcome?.name || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leader_welcome: { ...form.leader_welcome, name: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Gelar</label>
                <input
                  type="text"
                  value={form.leader_welcome?.title || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leader_welcome: { ...form.leader_welcome, title: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Kutipan / Sambutan Singkat</label>
              <textarea
                rows={3}
                value={form.leader_welcome?.quote || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leader_welcome: { ...form.leader_welcome, quote: e.target.value },
                  })
                }
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TENTANG, VISI & MISI */}
      <div className={`${card} p-6 sm:p-8 space-y-6 border-t-4 border-blue-900`}>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-slate-900 text-lg">Sejarah, Visi, dan Misi</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sejarah / Tentang Organisasi (Tampil di Halaman Profil)
          </label>
          <textarea
            rows={4}
            value={form.about_text || ''}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Visi Organisasi
          </label>
          <textarea
            rows={2}
            value={form.vision || ''}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Poin-Poin Misi Organisasi
            </label>
            <button
              type="button"
              onClick={handleAddMission}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-950 hover:text-yellow-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Poin Misi
            </button>
          </div>

          <div className="space-y-2.5">
            {form.missions?.map((misi, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={misi}
                  onChange={(e) => handleUpdateMission(idx, e.target.value)}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMission(idx)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"
                  title="Hapus poin misi"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. STATISTIK UTAMA (4 ANGKA KEY IMPACT) */}
      <div className={`${card} p-6 sm:p-8 space-y-5 border-t-4 border-yellow-500`}>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Target className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-slate-900 text-lg">4 Angka Capaian / Statistik (Beranda)</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {form.stats?.map((stat, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Statistik {i + 1}
              </label>
              <input
                type="text"
                placeholder="Angka (mis: 1.000+)"
                value={stat.value}
                onChange={(e) => handleUpdateStat(i, 'value', e.target.value)}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Keterangan (mis: Pelajar)"
                value={stat.label}
                onChange={(e) => handleUpdateStat(i, 'label', e.target.value)}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. KONTAK, MEDSOS & MAPS */}
      <div className={`${card} p-6 sm:p-8 space-y-5 border-t-4 border-blue-900`}>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-slate-900 text-lg">Kontak, WhatsApp & Google Maps</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp (Contoh: +6281234567890)
            </label>
            <input
              type="text"
              value={form.contact_info?.whatsapp || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, whatsapp: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email Resmi
            </label>
            <input
              type="email"
              value={form.contact_info?.email || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, email: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Akun Instagram (Contoh: @hpon_official)
            </label>
            <input
              type="text"
              value={form.contact_info?.instagram || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, instagram: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Sekretariat Lengkap
            </label>
            <input
              type="text"
              value={form.contact_info?.address || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, address: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Google Maps Embed URL (Iframe Src)
          </label>
          <input
            type="text"
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.contact_info?.maps_embed_url || ''}
            onChange={(e) =>
              setForm({
                ...form,
                contact_info: { ...form.contact_info, maps_embed_url: e.target.value },
              })
            }
            className={inputCls}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Dapatkan dari Google Maps &rarr; Bagikan &rarr; Sematkan Peta &rarr; Salin URL di dalam parameter src.
          </p>
        </div>
      </div>

      {/* 6. DOKUMEN RESMI (AD/ART DLL) */}
      <div className={`${card} p-6 sm:p-8 space-y-5 border-t-4 border-yellow-500`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <h3 className="font-bold text-slate-900 text-lg">Pusat Dokumen Resmi (AD/ART, Company Profile)</h3>
          </div>
          <button
            type="button"
            onClick={handleAddDocument}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-950 hover:text-yellow-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Dokumen
          </button>
        </div>

        <div className="space-y-4">
          {form.documents?.map((doc, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Dokumen #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(idx)}
                  className="text-red-500 text-xs font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Judul Dokumen (mis: AD/ART Organisasi)"
                  value={doc.title}
                  onChange={(e) => handleUpdateDocument(idx, 'title', e.target.value)}
                  className={inputCls}
                />
                <input
                  type="text"
                  placeholder="Keterangan singkat"
                  value={doc.desc}
                  onChange={(e) => handleUpdateDocument(idx, 'desc', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="url"
                  placeholder="Link file PDF atau URL unduhan..."
                  value={doc.file_url}
                  onChange={(e) => handleUpdateDocument(idx, 'file_url', e.target.value)}
                  className={`${inputCls} flex-1`}
                />
                <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-blue-950 px-3 py-2 text-xs font-semibold text-yellow-400 hover:bg-blue-900 transition">
                  <Upload className="h-3.5 w-3.5" />
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUploadDocFile(idx, e.target.files[0])
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating/Bottom Action Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`${btnPrimary} px-8 py-3 text-base shadow-lg`}
        >
          <Save className="h-5 w-5" />
          {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}
        </button>
      </div>
    </form>
  )
}
