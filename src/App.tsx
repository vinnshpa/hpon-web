import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/Spinner'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import Announcements from './pages/Announcements'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin pages lazy loaded
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

export default function App() {
  return (
    <Suspense fallback={<Spinner className="min-h-screen" />}>
      <Routes>
        {/* Halaman Publik Terbuka */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/kegiatan" element={<Activities />} />
          <Route path="/kegiatan/:id" element={<ActivityDetail />} />
          <Route path="/pengumuman" element={<Announcements />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Portal Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboard Admin (Terlindungi) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
