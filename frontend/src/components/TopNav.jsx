import { useLocation } from 'react-router-dom'

const TITLES = {
  // Student
  '/dashboard':   'Dashboard',
  '/assessment':  'Skill Assessment',
  '/internships': 'Internships',
  '/careers':     'Career Discovery',
  '/mentors':     'Find a Mentor',
  '/portfolio':   'My Portfolio',
  // Recruiter
  '/recruiter':            'Recruiter Dashboard',
  '/recruiter/candidates': 'Candidate Search',
  '/recruiter/jobs':       'Job Postings',
  '/recruiter/post':       'Post a Job',
  '/recruiter/analytics':  'Recruiter Analytics',
  // Faculty
  '/faculty':              'Faculty Dashboard',
  '/faculty/students':     'My Students',
  '/faculty/research':     'Research Projects',
  '/faculty/fdps':         'FDP Programs',
  '/faculty/assessments':  'Assessment Review',
  // Government
  '/govt':              'Ministry Overview',
  '/govt/skills':       'Skill Gap Analysis',
  '/govt/districts':    'District Reports',
  '/govt/automation':   'Automation Risk',
  '/govt/alerts':       'Policy Alerts',
  // Institution
  '/institution':              'Institution Dashboard',
  '/institution/placements':   'Placement Records',
  '/institution/naac':         'NAAC Reports',
  '/institution/mous':         'MoU Registry',
  '/institution/analytics':    'Institution Analytics',
  // Public
  '/':         'Welcome',
  '/login':    'Sign In',
  '/register': 'Create Account',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'U'
}

export default function TopNav({ dark, toggleTheme, user, onLogout }) {
  const { pathname } = useLocation()

  // Match longest prefix
  const title = Object.keys(TITLES)
    .filter((k) => pathname === k || pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 220,
        right: 0,
        height: 56,
        zIndex: 40,
        background: 'rgba(13,17,23,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        gap: '1rem',
      }}
    >
      {/* Page title */}
      <span
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#e6edf3',
          flex: 1,
        }}
      >
        {TITLES[title] ?? 'SkillBridge'}
      </span>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search…"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8,
            color: '#e6edf3',
            fontSize: '0.8rem',
            fontFamily: 'DM Sans, sans-serif',
            padding: '5px 10px 5px 30px',
            outline: 'none',
            width: 180,
          }}
        />
      </div>

      {/* Notification bell */}
      <button
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.55)',
          padding: 6,
          borderRadius: 8,
          lineHeight: 0,
          transition: 'color 0.15s',
        }}
        aria-label="Notifications"
        onMouseEnter={(e) => (e.currentTarget.style.color = '#e6edf3')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {/* Dot */}
        <span
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#ef4444',
            border: '1.5px solid #0d1117',
          }}
        />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem',
          lineHeight: 0,
          padding: 6,
          borderRadius: 8,
          color: 'rgba(255,255,255,0.55)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#e6edf3')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00b4d8, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 700,
          fontFamily: 'Syne, sans-serif',
          color: '#fff',
          cursor: 'default',
          flexShrink: 0,
        }}
        title={user?.name ?? 'User'}
      >
        {getInitials(user?.name)}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
          fontFamily: 'DM Sans, sans-serif',
          padding: '4px 10px',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ef4444'
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        Sign out
      </button>
    </header>
  )
}
