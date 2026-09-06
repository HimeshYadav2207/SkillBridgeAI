import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppShell from './components/AppShell'

import Landing from './screens/Landing'
import Login from './screens/Login'
import Register from './screens/Register'
import Dashboard from './screens/Dashboard'
import Assessment from './screens/Assessment'
import AptitudeTest from './screens/AptitudeTest'
import Internships from './screens/Internships'
import Mentors from './screens/Mentors'
import Portfolio from './screens/Portfolio'
import InternshipTracker from './screens/InternshipTracker'
import Resources from './screens/Resources'
import Recruiter from './screens/Recruiter'
import Faculty from './screens/Faculty'
import Govt from './screens/Govt'
import Institution from './screens/Institution'

function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary mx-auto flex items-center justify-center text-white font-black text-lg mb-3">SB</div>
        <div className="text-sm text-gray-400">Loading SkillBridge...</div>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth()
  if (loading) return children
  if (user) {
    const roleHome = { recruiter: '/recruiter', faculty: '/faculty', institution: '/institution' }
    return <Navigate to={roleHome[user.role] || '/dashboard'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
        <Route path="/register" element={<RequireGuest><Register /></RequireGuest>} />

        {/* STUDENT PORTAL */}
        <Route path="/dashboard" element={
          <RequireAuth roles={['student']}>
            <AppShell><Dashboard /></AppShell>
          </RequireAuth>
        } />
        <Route path="/assessment" element={
          <RequireAuth roles={['student']}>
            <AppShell><Assessment /></AppShell>
          </RequireAuth>
        } />
        <Route path="/aptitude" element={
          <RequireAuth roles={['student']}>
    <AppShell><AptitudeTest /></AppShell>
  </RequireAuth>
        } />
        <Route path="/internships" element={
          <RequireAuth roles={['student']}>
            <AppShell><Internships /></AppShell>
          </RequireAuth>
        } />
        <Route path="/mentors" element={
          <RequireAuth roles={['student']}>
            <AppShell><Mentors /></AppShell>
          </RequireAuth>
        } />
        <Route path="/portfolio" element={
          <RequireAuth roles={['student']}>
            <AppShell><Portfolio /></AppShell>
          </RequireAuth>
        } />
        <Route path="/tracker" element={
  <RequireAuth roles={['student']}>
    <AppShell><InternshipTracker /></AppShell>
  </RequireAuth>
} />
        <Route path="/resources" element={
          <RequireAuth roles={['student']}>
            <AppShell><Resources /></AppShell>
          </RequireAuth>
        } />

        {/* RECRUITER PORTAL */}
        <Route path="/recruiter/*" element={
          <RequireAuth roles={['recruiter']}>
            <AppShell><Recruiter /></AppShell>
          </RequireAuth>
        } />

        {/* FACULTY PORTAL */}
        <Route path="/faculty/*" element={
          <RequireAuth roles={['faculty']}>
            <AppShell><Faculty /></AppShell>
          </RequireAuth>
        } />

        {/* GOVT PORTAL — public, no login required */}
        <Route path="/govt/*" element={<Govt />} />

        {/* INSTITUTION PORTAL */}
        <Route path="/institution/*" element={
          <RequireAuth roles={['institution']}>
            <AppShell><Institution /></AppShell>
          </RequireAuth>
        } />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}