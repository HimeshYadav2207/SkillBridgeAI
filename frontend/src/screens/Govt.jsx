import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const NAV = [
  { to: '/govt', label: 'Overview', icon: '⊞' },
  { to: '/govt/skills', label: 'Skill Gaps', icon: '📊' },
  { to: '/govt/districts', label: 'Districts', icon: '🗺️' },
  { to: '/govt/policies', label: 'Policies', icon: '📋' },
  { to: '/govt/reports', label: 'Reports', icon: '📄' },
]

function GovtShell({ children }) {
  const location = useLocation()
  const TITLES = {
    '/govt': 'National Overview',
    '/govt/skills': 'Skill Gap Analysis',
    '/govt/districts': 'District Overview',
    '/govt/policies': 'Policy Management',
    '/govt/reports': 'Reports',
  }
  const title = TITLES[location.pathname] || 'Government Dashboard'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full w-[220px] bg-white border-r border-gray-100 flex flex-col z-40">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-xs">SB</div>
            <div>
              <div className="font-black text-gray-900 text-sm">SkillBridge</div>
              <div className="text-[10px] text-amber-600 font-semibold">Government Portal</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/govt'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="text-base w-5">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-amber-700 mb-1">🏛️ Public Dashboard</div>
            <div className="text-[10px] text-amber-600">No login required</div>
          </div>
          <Link to="/" className="mt-3 w-full text-xs text-gray-400 hover:text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 transition-colors block text-center">← Back to SkillBridge</Link>
        </div>
      </aside>

      {/* TOPNAV */}
      <div className="ml-[220px] flex-1">
        <header className="fixed top-0 left-[220px] right-0 h-14 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 z-30">
          <h1 className="font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="badge bg-amber-50 text-amber-700 text-xs">🏛️ Government Analytics</span>
            <span className="badge bg-emerald-50 text-emerald-600 text-xs">Live Data</span>
          </div>
        </header>
        <main className="pt-14 min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function GovtHome() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/govt/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const kpis = data?.kpis || { students: 482391, institutions: 1247, partners: 3618, placed: 109204 }
  const alerts = data?.alerts || [
    { type: 'gap', msg: 'AI/ML skill gap widened by 12% in Maharashtra', severity: 'high' },
    { type: 'info', msg: 'Karnataka placement rate improved to 68%', severity: 'low' },
    { type: 'gap', msg: 'Tier-3 colleges show 31% skill deficit in DSA', severity: 'medium' },
  ]

  const kpiItems = [
    { label: 'Students Registered', value: kpis.students.toLocaleString(), icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Institutions', value: kpis.institutions.toLocaleString(), icon: '🏛️', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Industry Partners', value: kpis.partners.toLocaleString(), icon: '🤝', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Successfully Placed', value: kpis.placed.toLocaleString(), icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  const nationalSkills = [
    { skill: 'JavaScript / Web Dev', demand: 89, supply: 72 },
    { skill: 'Python / Data Science', demand: 92, supply: 55 },
    { skill: 'AI / Machine Learning', demand: 95, supply: 38 },
    { skill: 'Cloud Computing', demand: 82, supply: 45 },
    { skill: 'Cybersecurity', demand: 78, supply: 29 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">National Employment & Skill Intelligence</h2>
        <p className="text-gray-500 text-sm mt-1">Real-time aggregated data across all registered institutions — updated daily</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiItems.map(k => (
          <div key={k.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center text-xl mb-3`}>{k.icon}</div>
            <div className={`text-2xl font-black mb-1 ${k.color}`}>{k.value}</div>
            <div className="text-xs text-gray-500">{k.label}</div>
          </div>
        ))}
      </div>

      {/* NATIONAL SKILL GAP OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-5">National Skill Demand vs Supply</h3>
          <div className="space-y-5">
            {nationalSkills.map(s => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{s.skill}</span>
                  <span className="text-red-500 text-xs font-bold">Gap: {s.demand - s.supply}%</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-14 text-gray-400">Demand</span>
                    <div className="flex-1 bg-blue-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: s.demand + '%' }} /></div>
                    <span className="font-bold text-gray-700 w-8">{s.demand}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-14 text-gray-400">Supply</span>
                    <div className="flex-1 bg-emerald-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: s.supply + '%' }} /></div>
                    <span className="font-bold text-gray-700 w-8">{s.supply}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* PLACEMENT RATE BY STATE */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">State-wise Placement Rate</h3>
            <div className="space-y-2">
              {[['Karnataka', 68], ['Tamil Nadu', 72], ['Maharashtra', 61], ['Delhi NCR', 65], ['UP', 43], ['Bihar', 35]].map(([state, val]) => (
                <div key={state} className="flex items-center gap-2">
                  <div className="text-xs text-gray-600 w-24">{state}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${val >= 65 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: val + '%' }} />
                  </div>
                  <div className="text-xs font-bold text-gray-700 w-8">{val}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTS */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">⚠ AI Alerts</h3>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${a.severity === 'high' ? 'bg-red-50 text-red-700' : a.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <span>{a.severity === 'high' ? '🔴' : a.severity === 'medium' ? '🟡' : '🟢'}</span>
                  <span>{a.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SKILL GAPS ───────────────────────────────────────────────────────────────
function SkillGaps() {
  const gaps = [
    { skill: 'Artificial Intelligence', nationalAvg: 38, target: 75, states: ['UP', 'Bihar', 'MP'], trend: 'worsening' },
    { skill: 'Cloud Computing', nationalAvg: 45, target: 70, states: ['Rajasthan', 'Jharkhand'], trend: 'stable' },
    { skill: 'Cybersecurity', nationalAvg: 29, target: 65, states: ['All Tier-3'], trend: 'worsening' },
    { skill: 'Data Engineering', nationalAvg: 52, target: 72, states: ['WB', 'Odisha'], trend: 'improving' },
    { skill: 'System Design', nationalAvg: 41, target: 80, states: ['Tier-2 cities'], trend: 'stable' },
    { skill: 'DevOps / CI-CD', nationalAvg: 33, target: 68, states: ['Pan India'], trend: 'worsening' },
  ]
  return (
    <div className="space-y-4">
      <div className="card p-4 bg-amber-50 border-amber-100">
        <p className="text-sm text-amber-800 font-semibold">📊 Critical skill gaps identified by AI analysis across 1,247 institutions nationwide</p>
      </div>
      {gaps.map(g => (
        <div key={g.skill} className="card p-5">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-gray-900">{g.skill}</h4>
            <div className="flex items-center gap-2">
              <span className={`badge text-[10px] ${g.trend === 'worsening' ? 'bg-red-50 text-red-600' : g.trend === 'improving' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {g.trend === 'worsening' ? '↓ Worsening' : g.trend === 'improving' ? '↑ Improving' : '→ Stable'}
              </span>
              <span className="badge bg-red-50 text-red-600 text-xs">Gap: {g.target - g.nationalAvg}%</span>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-24 text-gray-500">National Avg</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: g.nationalAvg + '%' }} /></div>
              <span className="font-bold text-gray-700 w-8">{g.nationalAvg}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-24 text-gray-500">Target 2025</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: g.target + '%' }} /></div>
              <span className="font-bold text-gray-700 w-8">{g.target}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Most affected regions: {g.states.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

// ─── DISTRICTS ────────────────────────────────────────────────────────────────
function Districts() {
  const districts = [
    { name: 'Bangalore Urban', state: 'Karnataka', institutions: 87, students: 42000, placement: 74, jobs: 18400 },
    { name: 'Mumbai', state: 'Maharashtra', institutions: 112, students: 68000, placement: 65, jobs: 24100 },
    { name: 'Chennai', state: 'Tamil Nadu', institutions: 94, students: 51000, placement: 71, jobs: 19800 },
    { name: 'Hyderabad', state: 'Telangana', institutions: 76, students: 44000, placement: 69, jobs: 17200 },
    { name: 'Lucknow', state: 'Uttar Pradesh', institutions: 63, students: 37000, placement: 43, jobs: 7800 },
    { name: 'Patna', state: 'Bihar', institutions: 41, students: 22000, placement: 35, jobs: 4200 },
    { name: 'Jaipur', state: 'Rajasthan', institutions: 55, students: 31000, placement: 48, jobs: 8900 },
    { name: 'Bhubaneswar', state: 'Odisha', institutions: 38, students: 19000, placement: 52, jobs: 6100 },
  ]
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">District-level Employment Overview</h3>
      <div className="card divide-y divide-gray-50">
        {districts.map(d => (
          <div key={d.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                <p className="text-xs text-gray-400">{d.state}</p>
              </div>
              <div className={`text-lg font-black ${d.placement >= 65 ? 'text-emerald-600' : d.placement >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{d.placement}%</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
              <span>🏛️ {d.institutions} institutions</span>
              <span>🎓 {d.students.toLocaleString()} students</span>
              <span>💼 {d.jobs.toLocaleString()} job openings</span>
            </div>
            <div className="mt-2 bg-gray-100 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${d.placement >= 65 ? 'bg-emerald-500' : d.placement >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: d.placement + '%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── POLICIES ─────────────────────────────────────────────────────────────────
function Policies() {
  const policies = [
    { title: 'National AI Skill Mission 2025', status: 'Active', budget: '₹2,400 Cr', impact: '500K students', desc: 'Nationwide AI/ML curriculum integration across engineering colleges.' },
    { title: 'Digital India Coding Bootcamps', status: 'Active', budget: '₹800 Cr', impact: '200K students', desc: 'Free 3-month coding bootcamps for Tier-2 and Tier-3 college students.' },
    { title: 'Tier-3 College Upliftment Scheme', status: 'Draft', budget: '₹1,200 Cr', impact: '350K students', desc: 'Infrastructure, mentoring, and industry connect for underserved colleges.' },
    { title: 'Industry-Academia Bridge Program', status: 'Under Review', budget: '₹600 Cr', impact: '150K students', desc: 'Mandatory 6-month industry projects as part of graduation requirements.' },
    { title: 'Women in Tech Initiative', status: 'Active', budget: '₹400 Cr', impact: '80K students', desc: 'Scholarships, mentoring, and placement support for women in STEM.' },
  ]
  return (
    <div className="space-y-4">
      {policies.map(p => (
        <div key={p.title} className="card p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-bold text-gray-900">{p.title}</h4>
            <span className={`badge text-xs shrink-0 ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : p.status === 'Draft' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>💰 Budget: {p.budget}</span>
            <span>👥 Target: {p.impact}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports() {
  const reports = [
    { name: 'Q3 2024 National Skill Gap Report', date: 'Oct 2024', size: '4.2 MB', type: 'PDF' },
    { name: 'Annual Placement Analysis 2024', date: 'Jan 2025', size: '8.7 MB', type: 'PDF' },
    { name: 'District Performance Summary', date: 'Dec 2024', size: '2.1 MB', type: 'Excel' },
    { name: 'Industry Demand Forecast 2025', date: 'Nov 2024', size: '5.3 MB', type: 'PDF' },
    { name: 'Women in STEM Progress Report', date: 'Sep 2024', size: '3.1 MB', type: 'PDF' },
  ]
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Published Reports</h3>
        <span className="badge bg-blue-50 text-blue-700 text-xs">Public Access</span>
      </div>
      {reports.map(r => (
        <div key={r.name} className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">{r.type === 'Excel' ? '📊' : '📄'}</div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{r.name}</p>
            <p className="text-xs text-gray-400">{r.date} · {r.size} · {r.type}</p>
          </div>
          <button className="text-primary text-sm font-semibold hover:underline shrink-0">Download</button>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Govt() {
  return (
    <GovtShell>
      <Routes>
        <Route index element={<GovtHome />} />
        <Route path="skills" element={<SkillGaps />} />
        <Route path="districts" element={<Districts />} />
        <Route path="policies" element={<Policies />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </GovtShell>
  )
}
