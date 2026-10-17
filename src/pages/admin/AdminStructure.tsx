import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchOrgStructure, uploadFile } from '../../lib/api'
import { errMsg, useFetch } from '../../hooks/useFetch'
import { btnDanger, btnGhost, btnPrimary, card, inputCls } from '../../lib/ui'
import { parseSocialLink, formatSocialLinkPayload } from '../../lib/constants'
import type { OrgPosition, OrgUnit } from '../../types'
import Modal from '../../components/Modal'
import Avatar from '../../components/Avatar'
import PhotoPositionAdjuster from '../../components/PhotoPositionAdjuster'
import RoleBadge from '../../components/RoleBadge'
import Spinner from '../../components/Spinner'
import ErrorBox from '../../components/ErrorBox'
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Award,
  Compass,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react'

/* ---------- Modal Form Jabatan & Pejabat ---------- */
interface PositionModalProps {
  unit: OrgUnit
  position: OrgPosition | null
  nextOrder: number
  onClose: () => void
  onSaved: () => void
}

function PositionModal({ unit, position, nextOrder, onClose, onSaved }: PositionModalProps) {
  const [title, setTitle] = useState(position?.title ?? '')
  const [personName, setPersonName] = useState(position?.person_name ?? '')
  const [subtitle, setSubtitle] = useState(position?.subtitle ?? '')
  const parsedSocial = parseSocialLink(position?.social_link)
  const [socialLabel, setSocialLabel] = useState(parsedSocial?.label ?? '')
  const [socialUrl, setSocialUrl] = useState(parsedSocial?.url ?? '')
  const [photoUrl, setPhotoUrl] = useState(position?.photo_url ?? '')
  const [photoPos, setPhotoPos] = useState<string>(() => {
    if (position?.photo_url) {
      const match = position.photo_url.match(/#pos=(\d+)_(\d+)/)
      if (match) return `${match[1]}% ${match[2]}%`
    }
    return '50% 20%'
  })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let finalPhoto = photoUrl
      if (file) {
        const uploadRes = await uploadFile('org-assets', file, 'officers')
        finalPhoto = uploadRes.url
      }

      // Gabungkan koordinat posisi ke URL foto agar tersimpan dan tampil presisi di seluruh web
      if (finalPhoto) {
        const cleanUrl = finalPhoto.replace(/#pos=\d+_\d+/, '')
        const match = photoPos.match(/(\d+)%\s+(\d+)%/)
        if (match) {
          finalPhoto = `${cleanUrl}#pos=${match[1]}_${match[2]}`
        }
      }

      const finalSocial = formatSocialLinkPayload(socialLabel, socialUrl)

      const payload = {
        unit_id: unit.id,
        title: title.trim(),
        person_name: personName.trim() || null,
        subtitle: subtitle.trim() || null,
        social_link: finalSocial,
        photo_url: finalPhoto || null,
      }

      if (position) {
        const { error: err } = await supabase
          .from('org_positions')
          .update(payload)
          .eq('id', position.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('org_positions')
          .insert({ ...payload, sort_order: nextOrder })
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
      title={`${position ? 'Ubah' : 'Tambah'} Jabatan: ${unit.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBox message={error} />}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Jabatan / Posisi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Koordinator Bidang, Anggota, Sekretaris"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Pejabat / Pengurus
          </label>
          <input
            type="text"
            placeholder="Contoh: Muhammad Ihsan Pratama, S.T."
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Biarkan kosong jika jabatan ini belum ditentukan pengurusnya.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Keterangan / Subtitle (Asal Kampus / Stambuk / Profesi)
          </label>
          <input
            type="text"
            placeholder="Contoh: Universitas Sumatera Utara | Stambuk 2021"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Tautan Profil / Medsos / Kontak (Opsional)
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama / Judul Tombol
              </label>
              <input
                type="text"
                placeholder="Misal: Instagram / LinkedIn / CV"
                value={socialLabel}
                onChange={(e) => setSocialLabel(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Alamat URL / Tautan
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/username atau linkedin.com/in/..."
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Nama tombol bebas diisi (contoh: "Instagram", "LinkedIn", "Portofolio", atau "Profil Pengurus").
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Foto Resmi Pengurus
          </label>
          <div className="flex items-center gap-4">
            <Avatar
              name={personName}
              url={file ? URL.createObjectURL(file) : photoUrl}
              position={photoPos}
              className="h-20 w-20 ring-2 ring-yellow-400 shadow-sm"
            />
            <div className="flex-1 space-y-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0])
                }}
                className="text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-blue-950 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-yellow-400 hover:file:bg-blue-900 cursor-pointer"
              />
              {photoUrl && !file && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl('')
                    setFile(null)
                  }}
                  className="text-[11px] text-red-600 hover:underline block pt-0.5"
                >
                  Hapus Foto Ini
                </button>
              )}
            </div>
          </div>

          {/* Kontrol Geser Foto 4 Arah (Atas, Bawah, Kiri, Kanan) */}
          {(file || photoUrl) && (
            <div className="pt-1">
              <PhotoPositionAdjuster
                value={photoPos}
                onChange={setPhotoPos}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Menyimpan...' : 'Simpan Jabatan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Modal Form Unit Baru ---------- */
interface UnitModalProps {
  unit: OrgUnit | null
  parentCategory: OrgUnit['category']
  parentId: string | null
  nextOrder: number
  onClose: () => void
  onSaved: () => void
}

function UnitModal({ unit, parentCategory, parentId, nextOrder, onClose, onSaved }: UnitModalProps) {
  const [name, setName] = useState(unit?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (unit) {
        const { error: err } = await supabase
          .from('org_units')
          .update({ name: name.trim() })
          .eq('id', unit.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('org_units').insert({
          name: name.trim(),
          category: parentCategory,
          parent_id: parentId,
          sort_order: nextOrder,
        })
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
    <Modal title={unit ? 'Ubah Nama Unit' : 'Tambah Unit Baru'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBox message={error} />}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Unit / Bidang / Wilayah
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Bidang Kewirausahaan, Wilayah 6"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* ---------- Komponen Utama AdminStructure ---------- */
export default function AdminStructure() {
  const { data, loading, error, reload } = useFetch(fetchOrgStructure, [])

  const [activePosModal, setActivePosModal] = useState<{
    unit: OrgUnit
    position: OrgPosition | null
  } | null>(null)

  const [activeUnitModal, setActiveUnitModal] = useState<{
    unit: OrgUnit | null
    parentCategory: OrgUnit['category']
    parentId: string | null
  } | null>(null)

  const [message, setMessage] = useState<string | null>(null)

  const units = data?.units ?? []
  const positions = data?.positions ?? []

  // Move position
  const handleMovePos = async (posList: OrgPosition[], index: number, direction: -1 | 1) => {
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= posList.length) return

    const current = posList[index]
    const target = posList[targetIdx]

    try {
      await Promise.all([
        supabase.from('org_positions').update({ sort_order: target.sort_order }).eq('id', current.id),
        supabase.from('org_positions').update({ sort_order: current.sort_order }).eq('id', target.id),
      ])
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  // Delete position
  const handleDeletePos = async (pos: OrgPosition) => {
    if (!confirm(`Hapus jabatan "${pos.title}" (${pos.person_name || 'Kosong'})?`)) return
    try {
      const { error: err } = await supabase.from('org_positions').delete().eq('id', pos.id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  // Delete unit
  const handleDeleteUnit = async (u: OrgUnit) => {
    if (!confirm(`Hapus unit "${u.name}" beserta seluruh jabatan di dalamnya?`)) return
    try {
      const { error: err } = await supabase.from('org_units').delete().eq('id', u.id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  // Filter groups
  const advisorUnits = units.filter((u) => u.category === 'advisor')
  const coreUnits = units.filter((u) => u.category === 'core')
  const divisionRoot = units.find((u) => u.category === 'division' && !u.parent_id)
  const divisionUnits = units.filter((u) => u.category === 'division' && u.parent_id)
  const regionRoot = units.find((u) => u.category === 'region' && !u.parent_id)
  const regionUnits = units.filter((u) => u.category === 'region' && u.parent_id)

  const renderPositions = (unit: OrgUnit) => {
    const unitPositions = positions
      .filter((p) => p.unit_id === unit.id)
      .sort((a, b) => a.sort_order - b.sort_order)

    return (
      <div className="space-y-2 mt-3">
        {unitPositions.map((pos, idx) => (
          <div
            key={pos.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-yellow-500/50 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                name={pos.person_name}
                url={pos.photo_url}
                className="h-10 w-10 text-xs shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {pos.person_name || <span className="italic text-slate-400">Belum Ditetapkan</span>}
                  </span>
                  <RoleBadge title={pos.title} variant="navy" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  {pos.subtitle && (
                    <span className="truncate text-xs text-slate-500">{pos.subtitle}</span>
                  )}
                  {pos.social_link && (() => {
                    const s = parseSocialLink(pos.social_link)
                    if (!s) return null
                    return (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100">
                        🔗 {s.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={idx === 0}
                onClick={() => handleMovePos(unitPositions, idx, -1)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                title="Pindah ke Atas"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                disabled={idx === unitPositions.length - 1}
                onClick={() => handleMovePos(unitPositions, idx, 1)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActivePosModal({ unit, position: pos })}
                className="rounded p-1 text-blue-900 hover:bg-blue-50 transition"
                title="Ubah Pejabat & Foto"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePos(pos)}
                className="rounded p-1 text-red-500 hover:bg-red-50 transition"
                title="Hapus Jabatan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {unitPositions.length === 0 && (
          <p className="text-xs text-slate-400 italic py-2">Belum ada jabatan pada unit ini.</p>
        )}

        <button
          onClick={() =>
            setActivePosModal({
              unit,
              position: null,
            })
          }
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-blue-950 hover:bg-yellow-50 hover:border-yellow-400 transition"
        >
          <Plus className="h-3.5 w-3.5 text-yellow-600" />
          Tambah Jabatan di {unit.name}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-blue-950">
          Editor Struktur Kepengurusan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola data nama orang, foto resmi, dan jabatan pengurus. Setiap perubahan langsung tampil di halaman Profil publik.
        </p>
      </div>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} />}

      {/* 1. DEWAN PEMBINA & PENDIRI */}
      <section className={`${card} p-6 border-t-4 border-yellow-500`}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-bold text-slate-900">
            1. Dewan Pembina & Pendiri
          </h3>
        </div>
        {advisorUnits.map((u) => (
          <div key={u.id}>{renderPositions(u)}</div>
        ))}
      </section>

      {/* 2. BPH INTI */}
      <section className={`${card} p-6 border-t-4 border-blue-950`}>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-bold text-slate-900">
            2. Badan Pengurus Harian (BPH) Inti
          </h3>
        </div>
        {coreUnits.map((u) => (
          <div key={u.id}>{renderPositions(u)}</div>
        ))}
      </section>

      {/* 3. BPH BIDANG */}
      <section className={`${card} p-6 border-t-4 border-emerald-600`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              3. BPH Bagian Bidang (Divisi)
            </h3>
          </div>
          {divisionRoot && (
            <button
              onClick={() =>
                setActiveUnitModal({
                  unit: null,
                  parentCategory: 'division',
                  parentId: divisionRoot.id,
                })
              }
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Bidang Baru
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {divisionUnits.map((div) => (
            <div key={div.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm">{div.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setActiveUnitModal({
                        unit: div,
                        parentCategory: 'division',
                        parentId: div.parent_id,
                      })
                    }
                    className="p-1 text-slate-400 hover:text-blue-900"
                    title="Ubah nama bidang"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(div)}
                    className="p-1 text-slate-400 hover:text-red-500"
                    title="Hapus bidang"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {renderPositions(div)}
            </div>
          ))}
        </div>
      </section>

      {/* 4. KOORDINATOR WILAYAH */}
      <section className={`${card} p-6 border-t-4 border-yellow-500`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-slate-900">
              4. Koordinator & Pengurus Wilayah (Terpisah)
            </h3>
          </div>
          {regionRoot && (
            <button
              onClick={() =>
                setActiveUnitModal({
                  unit: null,
                  parentCategory: 'region',
                  parentId: regionRoot.id,
                })
              }
              className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-blue-950 hover:bg-yellow-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Wilayah Baru
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regionUnits.map((reg) => (
            <div key={reg.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm truncate">{reg.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setActiveUnitModal({
                        unit: reg,
                        parentCategory: 'region',
                        parentId: reg.parent_id,
                      })
                    }
                    className="p-1 text-slate-400 hover:text-blue-900"
                    title="Ubah nama wilayah"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(reg)}
                    className="p-1 text-slate-400 hover:text-red-500"
                    title="Hapus wilayah"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {renderPositions(reg)}
            </div>
          ))}
        </div>
      </section>

      {/* MODAL JABATAN */}
      {activePosModal && (
        <PositionModal
          unit={activePosModal.unit}
          position={activePosModal.position}
          nextOrder={positions.filter((p) => p.unit_id === activePosModal.unit.id).length + 1}
          onClose={() => setActivePosModal(null)}
          onSaved={() => {
            setActivePosModal(null)
            reload()
          }}
        />
      )}

      {/* MODAL UNIT */}
      {activeUnitModal && (
        <UnitModal
          unit={activeUnitModal.unit}
          parentCategory={activeUnitModal.parentCategory}
          parentId={activeUnitModal.parentId}
          nextOrder={units.filter((u) => u.category === activeUnitModal.parentCategory).length + 1}
          onClose={() => setActiveUnitModal(null)}
          onSaved={() => {
            setActiveUnitModal(null)
            reload()
          }}
        />
      )}
    </div>
  )
}
