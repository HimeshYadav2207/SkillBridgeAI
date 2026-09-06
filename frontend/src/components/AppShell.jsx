import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AiAssistant from './AiAssistant'

const NAV = {
  student: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/assessment', icon: '📝', label: 'Skill Assessment' },
    { to: '/aptitude', icon: '🎯', label: 'Aptitude Test' },
    { to: '/internships', icon: '💼', label: 'Internships' },
    { to: '/mentors', icon: '🧑‍🏫', label: 'Find Mentors' },
    { to: '/portfolio', icon: '🗂', label: 'My Portfolio' },
    { to: '/tracker', icon: '📅', label: 'Internship Tracker' },
    { to: '/resources', icon: '📚', label: 'Learning Resources' },
  ],
  recruiter: [
    { to: '/recruiter', icon: '⊞', label: 'Dashboard' },
    { to: '/recruiter/candidates', icon: '👥', label: 'Candidates' },
    { to: '/recruiter/jobs', icon: '📋', label: 'Job Postings' },
    { to: '/recruiter/post', icon: '➕', label: 'Post a Job' },
    { to: '/recruiter/analytics', icon: '📊', label: 'Analytics' },
  ],
  faculty: [
    { to: '/faculty', icon: '⊞', label: 'Dashboard' },
    { to: '/faculty/students', icon: '🎓', label: 'My Students' },
    { to: '/faculty/skills', icon: '📊', label: 'Skill Trends' },
    { to: '/faculty/curriculum', icon: '📚', label: 'Curriculum' },
  ],
  institution: [
    { to: '/institution', icon: '⊞', label: 'Dashboard' },
    { to: '/institution/placements', icon: '🏆', label: 'Placements' },
    { to: '/institution/analytics', icon: '📊', label: 'Analytics' },
    { to: '/institution/naac', icon: '✅', label: 'NAAC/NBA' },
  ],
}

const ACCENT = {
  student: 'bg-primary',
  recruiter: 'bg-emerald-600',
  faculty: 'bg-purple-600',
  institution: 'bg-rose-600',
}

const TITLES = {
  '/dashboard': 'Dashboard', '/assessment': 'Skill Assessment', '/internships': 'Internships',
  '/mentors': 'Find Mentors', '/portfolio': 'My Portfolio', '/resources': 'Learning Resources', '/aptitude': 'Aptitude Test',
  '/recruiter': 'Recruiter Dashboard', '/recruiter/candidates': 'Candidates',
  '/recruiter/jobs': 'Job Postings', '/recruiter/post': 'Post a Job', '/recruiter/analytics': 'Analytics',
  '/faculty': 'Faculty Dashboard', '/faculty/students': 'My Students', '/faculty/skills': 'Skill Trends', '/faculty/curriculum': 'Curriculum', '/faculty/fdp': 'FDP & Opportunities',
  '/institution': 'Institution Dashboard', '/institution/placements': 'Placements','/tracker': 'Internship Tracker', '/institution/analytics': 'Analytics', '/institution/naac': 'NAAC/NBA',
}

// ── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    college: user?.college || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary'

  async function submit() {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      await axios.put('/api/auth/profile', form)
      await onSaved()
      onClose()
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save. Try again.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2">{error}</div>}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
            <input className={inp} value={form.name} onChange={set('name')} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Headline</label>
            <input className={inp} value={form.headline} onChange={set('headline')} placeholder="e.g. Full Stack Developer · Looking for internships" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">College / University</label>
            <input className={inp} value={form.college} onChange={set('college')} placeholder="e.g. IIT Bombay" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Bio</label>
            <textarea className={inp + ' resize-none'} rows={3} value={form.bio} onChange={set('bio')} placeholder="Tell recruiters and mentors about yourself..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">GitHub URL</label>
            <input className={inp} value={form.github} onChange={set('github')} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">LinkedIn URL</label>
            <input className={inp} value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/username" />
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main AppShell ────────────────────────────────────────────────────────────
export default function AppShell({ children }) {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = user?.role || 'student'
  const links = NAV[role] || NAV.student
  const accent = ACCENT[role] || 'bg-primary'
  const title = TITLES[location.pathname] || 'SkillBridge'

  const [showProfile, setShowProfile] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Load unread count on mount (students only)
  useEffect(() => {
    if (role !== 'student') return
    axios.get('/api/students/notifications')
      .then(r => {
        const notifs = r.data.notifications || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.read).length)
      })
      .catch(() => {})
  }, [role])

  function toggleNotif() {
    setShowProfile(false)
    setShowNotif(v => {
      if (!v && role === 'student') {
        setNotifLoading(true)
        axios.get('/api/students/notifications')
          .then(r => {
            const notifs = r.data.notifications || []
            setNotifications(notifs)
            setUnreadCount(notifs.filter(n => !n.read).length)
          })
          .catch(() => {})
          .finally(() => setNotifLoading(false))
      }
      return !v
    })
  }

  function markAllRead() {
    if (role !== 'student') return
    axios.post('/api/students/notifications/mark-read').then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }).catch(() => {})
  }

  function handleLogout() { logout(); navigate('/login') }

  function openEdit() {
    setShowProfile(false)
    setShowEditModal(true)
  }

  function timeAgo(date) {
    if (!date) return ''
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full w-[220px] bg-white border-r border-gray-100 flex flex-col z-40">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${accent} flex items-center justify-center text-white font-bold text-xs`}>SB</div>
            <span className="font-black text-gray-900">SkillBridge</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/recruiter' || l.to === '/faculty' || l.to === '/institution'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="text-base w-5">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-full ${accent} flex items-center justify-center text-white text-xs font-bold`}>
              {user?.name?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-gray-400 hover:text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Sign out</button>
        </div>
      </aside>

      {/* TOPNAV */}
      <div className="ml-[220px] flex-1">
        <header className="fixed top-0 left-[220px] right-0 h-14 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 z-30">
          <h1 className="font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-400 w-44">
              <span>🔍</span><span className="text-xs">Search...</span>
            </div>

            {/* BELL */}
            <div className="relative" ref={notifRef}>
              <button onClick={toggleNotif}
                className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-base">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {unreadCount === 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                )}
              </button>

              {/* Notifications panel */}
              {showNotif && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifLoading ? (
                      <div className="py-8 text-center text-xs text-gray-400">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <div className="text-3xl mb-2">🔔</div>
                        <p className="text-xs text-gray-400">No notifications yet</p>
                        <p className="text-xs text-gray-300 mt-1">Complete your skill assessment to get started</p>
                      </div>
                    ) : (
                      notifications.map((n, i) => {
                        const text = n.message || n.body || ''
                        const heading = n.title || (text.length > 50 ? text.slice(0, 50) + '…' : text)
                        const body = n.title ? text : ''
                        const icon = n.type === 'success' ? '🎉' : n.type === 'warning' ? '📅' : n.type === 'info' ? 'ℹ️' : '📣'
                        return (
                          <div key={i} className={`px-4 py-3 border-b border-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex gap-3 items-start">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm shrink-0">{icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 leading-snug">{heading}</p>
                                {body && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>}
                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                              </div>
                              {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1"></div>}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE AVATAR */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowNotif(false); setShowProfile(v => !v) }}
                className={`w-8 h-8 rounded-full ${accent} flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer`}>
                {user?.name?.[0] || '?'}
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 badge bg-gray-50 text-gray-500 capitalize text-[10px]">{role}</span>
                  </div>
                  <div className="py-1">
                    <button onClick={openEdit}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                      <span>✏️</span> Edit Profile
                    </button>
                    {role === 'student' && (
                      <button onClick={() => { setShowProfile(false); navigate('/portfolio') }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                        <span>🗂</span> My Portfolio
                      </button>
                    )}
                    <button onClick={() => {
                        setShowProfile(false)
                        const home = { recruiter: '/recruiter', faculty: '/faculty', institution: '/institution' }
                        navigate(home[role] || '/dashboard')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                      <span>⊞</span> Dashboard
                    </button>
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="pt-14 min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSaved={refreshUser}
        />
      )}

      {/* AI CAREER ASSISTANT — students only */}
      {role === 'student' && <AiAssistant />}
    </div>
  )
}
