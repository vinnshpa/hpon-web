import { useState, useMemo } from 'react'
import { useFetch } from '../hooks/useFetch'
import { fetchActivities } from '../lib/api'
import PageHeader from '../components/PageHeader'
import ActivityCard from '../components/ActivityCard'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import { inputCls, btnGhost } from '../lib/ui'
import { Search, Sparkles } from 'lucide-react'

export default function Activities() {
  const [tab, setTab] = useState<'all' | 'upcoming' | 'past'>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const { data: activities, loading, error } = useFetch(fetchActivities, [])

  // Categories list
  const categories = useMemo(() => {
    if (!activities) return []
    const cats = activities.map((a) => a.category).filter(Boolean)
    return Array.from(new Set(cats))
  }, [activities])

  // Filtered list
  const filtered = useMemo(() => {
    if (!activities) return []
    return activities.filter((act) => {
      // Tab filter
      if (tab === 'upcoming' && !act.is_upcoming) return false
      if (tab === 'past' && act.is_upcoming) return false

      // Category filter
      if (category && act.category !== category) return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchTitle = act.title.toLowerCase().includes(q)
        const matchDesc = act.description?.toLowerCase().includes(q) || false
        const matchLoc = act.location?.toLowerCase().includes(q) || false
        if (!matchTitle && !matchDesc && !matchLoc) return false
      }

      return true
    })
  }, [activities, tab, category, search])

  return (
    <div>
      <PageHeader
        title="Kegiatan & Galeri Dokumentasi"
        subtitle="Arsip agenda kerja, aksi sosial kemasyarakatan, serta dokumentasi foto kegiatan organisasi."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        {/* Filters and Tabs */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setTab('all')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === 'all'
                  ? 'bg-blue-950 text-yellow-400 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-200'
              }`}
            >
              Semua Kegiatan
            </button>
            <button
              onClick={() => setTab('upcoming')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-200'
              }`}
            >
              Agenda Mendatang
            </button>
            <button
              onClick={() => setTab('past')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === 'past'
                  ? 'bg-blue-950 text-yellow-400 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-200'
              }`}
            >
              Telah Terlaksana (Galeri)
            </button>
          </div>

          {/* Search & Category */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputCls} pl-9 py-2 text-sm`}
              />
            </div>

            {categories.length > 0 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputCls} py-2 text-sm w-auto`}
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {(search || category) && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('')
                }}
                className={btnGhost}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada kegiatan ditemukan</h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba sesuaikan kata kunci pencarian atau pilih tab yang lain.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      </div>
    </div>
  )
}
