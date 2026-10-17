import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import Logo from '../../components/Logo'
import AdminStructure from './AdminStructure'
import AdminSiteSettings from './AdminSiteSettings'
import AdminActivities from './AdminActivities'
import AdminAnnouncements from './AdminAnnouncements'
import AdminMessages from './AdminMessages'
import {
  Users,
  Settings,
  Calendar,
  Megaphone,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'

const TABS = [
  { id: 'structure', label: 'Struktur Organisasi', icon: Users },
  { id: 'settings', label: 'Pengaturan Web (CMS)', icon: Settings },
  { id: 'activities', label: 'Kegiatan & Galeri', icon: Calendar },
  { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
  { id: 'messages', label: 'Kotak Masuk Pesan', icon: Mail },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  const { settings } = useSiteSettings()
  const [activeTab, setActiveTab] = useState<TabId>('structure')

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-blue-900/60 bg-blue-950 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-wide text-white">
                  Panel Administrator
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
                  <ShieldCheck className="h-3 w-3" />
                  Pengurus Resmi
                </span>
              </div>
              <p className="text-xs text-slate-400">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-yellow-400 transition"
            >
              Lihat Website
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-red-600 hover:text-white transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="mx-auto flex max-w-6xl overflow-x-auto px-4 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'border-yellow-500 text-yellow-400 bg-blue-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-blue-900/20'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === 'structure' && <AdminStructure />}
        {activeTab === 'settings' && <AdminSiteSettings />}
        {activeTab === 'activities' && <AdminActivities />}
        {activeTab === 'announcements' && <AdminAnnouncements />}
        {activeTab === 'messages' && <AdminMessages />}
      </main>
    </div>
  )
}
