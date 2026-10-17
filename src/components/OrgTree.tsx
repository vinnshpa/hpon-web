import type { OrgPosition, OrgUnit } from '../types'
import Avatar from './Avatar'
import RoleBadge from './RoleBadge'
import { card } from '../lib/ui'
import { Award, Compass, Layers, MapPin, ChevronDown } from 'lucide-react'

interface OrgTreeProps {
  units: OrgUnit[]
  positions: OrgPosition[]
}

export default function OrgTree({ units, positions }: OrgTreeProps) {
  // 1. Dewan Pembina & Pendiri (category: 'advisor')
  const advisorUnits = units.filter((u) => u.category === 'advisor')
  const advisorUnit = advisorUnits[0]
  const advisorPositions = advisorUnit
    ? positions.filter((p) => p.unit_id === advisorUnit.id).sort((a, b) => a.sort_order - b.sort_order)
    : []

  // 2. BPH Inti (category: 'core')
  const coreUnits = units.filter((u) => u.category === 'core')
  const coreUnit = coreUnits[0]
  const corePositions = coreUnit
    ? positions.filter((p) => p.unit_id === coreUnit.id).sort((a, b) => a.sort_order - b.sort_order)
    : []

  // 3. BPH Bidang (category: 'division')
  // Root and sub-units
  const divisionUnits = units
    .filter((u) => u.category === 'division' && u.parent_id !== null)
    .sort((a, b) => a.sort_order - b.sort_order)

  // 4. Koordinator Wilayah (category: 'region')
  // Root and sub-units
  const regionUnits = units
    .filter((u) => u.category === 'region' && u.parent_id !== null)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-16">
      {/* 1. SEKSI DEWAN PEMBINA & PENDIRI */}
      <section className="relative">
        <div className="mb-6 flex items-center gap-3 border-b-2 border-yellow-500 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500 text-blue-950 font-bold shadow-xs">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-blue-950 tracking-wide sm:text-2xl">
              Dewan Pembina & Pendiri
            </h3>
            <p className="text-xs text-slate-500">
              Pengarah, pelindung, dan perintis berdirinya organisasi
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {advisorPositions.map((pos) => {
            const isAssigned = Boolean(pos.person_name?.trim())
            return (
              <div
                key={pos.id}
                className={`${card} border-t-4 border-yellow-500 p-6 text-center ${
                  !isAssigned ? 'opacity-70 bg-slate-50' : 'bg-gradient-to-b from-yellow-50/30 to-white'
                }`}
              >
                <div className="relative mx-auto mb-4 inline-block">
                  <Avatar
                    name={pos.person_name}
                    url={pos.photo_url}
                    className="h-24 w-24 sm:h-28 sm:w-28 mx-auto ring-4 ring-yellow-400/60 shadow-md"
                  />
                  <div className="absolute -bottom-2 inset-x-0">
                    <RoleBadge title={pos.title} variant="gold" />
                  </div>
                </div>

                <h4 className="mt-3 text-lg font-bold text-blue-950">
                  {pos.person_name || 'Belum Ditetapkan'}
                </h4>
                {pos.subtitle ? (
                  <p className="mt-1 text-xs font-semibold text-yellow-700">{pos.subtitle}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">Pembina Kehormatan</p>
                )}
                {pos.social_link && (
                  <a
                    href={pos.social_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-blue-900 underline hover:text-yellow-600"
                  >
                    Profil / Kontak
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. SEKSI BPH INTI */}
      <section>
        <div className="mb-6 flex items-center gap-3 border-b-2 border-yellow-500 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950 text-yellow-400 font-bold shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-blue-950 tracking-wide sm:text-2xl">
              Badan Pengurus Harian (BPH) Inti
            </h3>
            <p className="text-xs text-slate-500">
              Pimpinan eksekutif pengambil kebijakan dan manajerial utama organisasi
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {corePositions.map((pos) => {
            const isAssigned = Boolean(pos.person_name?.trim())
            return (
              <div
                key={pos.id}
                className={`${card} border-t-4 border-blue-900 p-5 text-center ${
                  !isAssigned ? 'opacity-70 bg-slate-50' : 'bg-white'
                }`}
              >
                <Avatar
                  name={pos.person_name}
                  url={pos.photo_url}
                  className="mx-auto h-20 w-20 ring-4 ring-slate-100 shadow-sm"
                />
                <h4 className="mt-3 font-bold text-slate-900 text-base">
                  {pos.person_name || 'Belum Ditetapkan'}
                </h4>
                <div className="mt-1.5">
                  <RoleBadge title={pos.title} variant="navy" />
                </div>
                {pos.subtitle && (
                  <p className="mt-2 text-xs font-medium text-slate-600">{pos.subtitle}</p>
                )}
                {pos.social_link && (
                  <a
                    href={pos.social_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-blue-800 hover:text-yellow-600 underline"
                  >
                    Tautan LinkedIn / Medsos
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. SEKSI BPH BIDANG (7 BIDANG) */}
      <section>
        <div className="mb-6 flex items-center gap-3 border-b-2 border-yellow-500 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-blue-950 tracking-wide sm:text-2xl">
              BPH Bagian Bidang (Divisi Kerja)
            </h3>
            <p className="text-xs text-slate-500">
              7 Pilar kerja operasional yang menjalankan roda program kerja organisasi
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {divisionUnits.map((unit) => {
            const unitPositions = positions
              .filter((p) => p.unit_id === unit.id)
              .sort((a, b) => a.sort_order - b.sort_order)

            return (
              <details
                key={unit.id}
                open
                className={`${card} border-l-4 border-emerald-600 p-5 group`}
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-blue-950 select-none">
                  <span className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                    {unit.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {unitPositions.length} Posisi
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>

                <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  {unitPositions.map((pos) => {
                    const isAssigned = Boolean(pos.person_name?.trim())
                    return (
                      <div
                        key={pos.id}
                        className={`flex items-center gap-3.5 rounded-xl p-2.5 ring-1 ring-slate-100 ${
                          !isAssigned ? 'bg-slate-50/70 opacity-70' : 'bg-slate-50/40'
                        }`}
                      >
                        <Avatar
                          name={pos.person_name}
                          url={pos.photo_url}
                          className="h-12 w-12 text-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {pos.person_name || 'Belum Ditetapkan'}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            <RoleBadge
                              title={pos.title}
                              variant={pos.title.toLowerCase().includes('koordinator') ? 'emerald' : 'slate'}
                            />
                            {pos.subtitle && (
                              <span className="truncate text-xs text-slate-500">
                                {pos.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {unitPositions.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Belum ada posisi di bidang ini.</p>
                  )}
                </div>
              </details>
            )
          })}
        </div>
      </section>

      {/* 4. SEKSI KOORDINATOR WILAYAH (5 WILAYAH - TERPISAH) */}
      <section>
        <div className="mb-6 flex items-center gap-3 border-b-2 border-yellow-500 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-yellow-400 font-bold shadow-xs">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-blue-950 tracking-wide sm:text-2xl">
              Koordinator & Pengurus Wilayah (5 Wilayah)
            </h3>
            <p className="text-xs text-slate-500">
              Jaringan kepengurusan cabang dan penghubung kader di berbagai daerah
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regionUnits.map((unit) => {
            const unitPositions = positions
              .filter((p) => p.unit_id === unit.id)
              .sort((a, b) => a.sort_order - b.sort_order)

            return (
              <div
                key={unit.id}
                className={`${card} border-t-4 border-yellow-500 p-5 flex flex-col justify-between`}
              >
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-extrabold text-blue-950 text-base">
                      {unit.name}
                    </h4>
                  </div>

                  <div className="space-y-3 pt-2">
                    {unitPositions.map((pos) => {
                      const isAssigned = Boolean(pos.person_name?.trim())
                      return (
                        <div
                          key={pos.id}
                          className={`flex items-center gap-3 rounded-lg p-2 ring-1 ring-slate-100 ${
                            !isAssigned ? 'bg-slate-50/60 opacity-60' : 'bg-slate-50'
                          }`}
                        >
                          <Avatar
                            name={pos.person_name}
                            url={pos.photo_url}
                            className="h-10 w-10 text-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {pos.person_name || 'Belum Ditetapkan'}
                            </p>
                            <span className="block text-[11px] font-semibold text-yellow-700">
                              {pos.title}
                            </span>
                            {pos.subtitle && (
                              <span className="block truncate text-[10px] text-slate-500">
                                {pos.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
