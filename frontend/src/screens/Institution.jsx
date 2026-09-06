import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// ── Institution Home ──────────────────────────────────────────────────────────
function InstitutionHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/institution/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const stats = data?.stats || { students: 1640, placed: 1057, recruiters: 48, avgPackage: '12.4' }
  const placementRate = Math.round((stats.placed / stats.students) * 100)
  const recentPlacements = data?.recentPlacements || []

  const departments = [
    { name: 'Computer Science', students: 420, placed: 318, rate: 76, avgPkg: '18.2' },
    { name: 'Electronics', students: 380, placed: 247, rate: 65, avgPkg: '14.5' },
    { name: 'Mechanical', students: 290, placed: 156, rate: 54, avgPkg: '10.2' },
    { name: 'Civil', students: 210, placed: 98, rate: 47, avgPkg: '8.8' },
    { name: 'Information Tech', students: 340, placed: 272, rate: 80, avgPkg: '16.7' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Institution Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">{user?.college || 'IIT Bombay'} — Placement & Analytics Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.students.toLocaleString(), icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50', change: '+12% vs last year' },
          { label: 'Students Placed', value: stats.placed.toLocaleString(), icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+8% vs last year' },
          { label: 'Placement Rate', value: placementRate + '%', icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50', change: 'Industry avg: 58%' },
          { label: 'Avg Package', value: '₹' + stats.avgPackage + ' LPA', icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50', change: '+₹1.2L vs last year' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-600 font-semibold">{s.label}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Placement Readiness Alert */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Placement Ready', value: '487', desc: 'Score > 70%', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          { label: 'Needs Upskilling', value: '312', desc: 'Score 40–70%', color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'At Risk', value: '198', desc: 'Score < 40%', color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.color} text-center`}>
            <div className="text-3xl font-black">{s.value}</div>
            <div className="text-xs font-bold mt-0.5">{s.label}</div>
            <div className="text-[10px] opacity-70">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Department Breakdown */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Department-wise Placement</h3>
        <div className="space-y-4">
          {departments.map(d => (
            <div key={d.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{d.name}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-600 font-semibold">₹{d.avgPkg} LPA avg</span>
                  <span className="text-gray-500">{d.placed}/{d.students} · <span className="font-bold text-gray-900">{d.rate}%</span></span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${d.rate >= 70 ? 'bg-emerald-500' : d.rate >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: d.rate + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Recruiters */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Recruiting Companies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Google', icon: '🌐', hired: 24 },
            { name: 'Microsoft', icon: '💻', hired: 18 },
            { name: 'Amazon', icon: '📦', hired: 31 },
            { name: 'Infosys', icon: '🏢', hired: 67 },
            { name: 'TCS', icon: '💼', hired: 89 },
            { name: 'Wipro', icon: '⚙', hired: 54 },
            { name: 'Flipkart', icon: '🛒', hired: 15 },
            { name: 'Swiggy', icon: '🍔', hired: 12 },
          ].map(c => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-sm">{c.icon}</div>
                <span className="text-xs font-semibold text-gray-700">{c.name}</span>
              </div>
              <span className="text-xs font-black text-primary">{c.hired}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Analytics Dashboard ───────────────────────────────────────────────────────
function Analytics() {
  const monthlyData = [
    { month: 'Jan', placed: 42, applied: 120, skillScore: 58 },
    { month: 'Feb', placed: 67, applied: 145, skillScore: 61 },
    { month: 'Mar', placed: 89, applied: 198, skillScore: 63 },
    { month: 'Apr', placed: 134, applied: 245, skillScore: 65 },
    { month: 'May', placed: 187, applied: 312, skillScore: 67 },
    { month: 'Jun', placed: 221, applied: 356, skillScore: 70 },
  ]
  const max = Math.max(...monthlyData.map(d => d.placed))

  const skillDemand = [
    { skill: 'AI/ML', demand: 95, supply: 40, gap: 55 },
    { skill: 'Cloud & DevOps', demand: 88, supply: 35, gap: 53 },
    { skill: 'Full Stack', demand: 85, supply: 65, gap: 20 },
    { skill: 'Data Science', demand: 82, supply: 45, gap: 37 },
    { skill: 'Cybersecurity', demand: 78, supply: 28, gap: 50 },
    { skill: 'Mobile Dev', demand: 72, supply: 50, gap: 22 },
  ]

  const recruitmentOutcomes = [
    { stage: 'Applied', count: 1356, pct: 100, color: 'bg-blue-500' },
    { stage: 'Shortlisted', count: 678, pct: 50, color: 'bg-purple-500' },
    { stage: 'Interviewed', count: 340, pct: 25, color: 'bg-amber-500' },
    { stage: 'Offered', count: 204, pct: 15, color: 'bg-emerald-500' },
    { stage: 'Joined', count: 163, pct: 12, color: 'bg-teal-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Analytics & Reporting</h3>
        <p className="text-gray-500 text-sm mt-0.5">Data-driven insights for placement readiness and skill demand trends</p>
      </div>

      {/* Monthly Placement Trend */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Monthly Placement Trend</h3>
        <div className="flex items-end gap-3 h-40 mb-3">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-700">{d.placed}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-400 transition-all"
                style={{ height: `${(d.placed / max) * 100}%` }} />
              <span className="text-xs text-gray-500">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          {[
            { label: 'Total Placed', value: monthlyData.reduce((a, d) => a + d.placed, 0) },
            { label: 'Total Applied', value: monthlyData.reduce((a, d) => a + d.applied, 0) },
            { label: 'Avg Skill Score', value: Math.round(monthlyData.reduce((a, d) => a + d.skillScore, 0) / monthlyData.length) + '%' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-primary">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Demand vs Supply */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Skill Demand vs Student Supply</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-blue-500 rounded inline-block"></span>Industry Demand</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded inline-block"></span>Student Supply</span>
          </div>
        </div>
        <div className="space-y-4">
          {skillDemand.map(s => (
            <div key={s.skill}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{s.skill}</span>
                <span className="text-xs text-red-500 font-bold">Gap: {s.gap}%</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-14">Demand</span>
                  <div className="flex-1 bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: s.demand + '%' }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{s.demand}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-14">Supply</span>
                  <div className="flex-1 bg-emerald-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: s.supply + '%' }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{s.supply}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruitment Funnel */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Recruitment Funnel — This Season</h3>
        <div className="space-y-3">
          {recruitmentOutcomes.map(r => (
            <div key={r.stage} className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 w-24">{r.stage}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div className={`${r.color} h-8 rounded-full flex items-center justify-end pr-3 transition-all`}
                  style={{ width: r.pct + '%' }}>
                  <span className="text-white text-xs font-bold">{r.count}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500 w-8">{r.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-700 font-semibold">💡 Conversion rate: 12% of applicants get placed. Industry benchmark is 10%.</p>
        </div>
      </div>

      {/* Package Distribution */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Package Distribution</h3>
        <div className="space-y-3">
          {[
            { range: '> ₹20 LPA', pct: 8, count: 85, color: 'bg-emerald-500' },
            { range: '₹15–20 LPA', pct: 14, count: 148, color: 'bg-blue-500' },
            { range: '₹10–15 LPA', pct: 31, count: 328, color: 'bg-purple-500' },
            { range: '₹6–10 LPA', pct: 34, count: 359, color: 'bg-amber-500' },
            { range: '< ₹6 LPA', pct: 13, count: 137, color: 'bg-gray-400' },
          ].map(p => (
            <div key={p.range} className="flex items-center gap-3">
              <div className="text-xs text-gray-600 w-28">{p.range}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div className={`${p.color} h-2.5 rounded-full`} style={{ width: p.pct + '%' }} />
              </div>
              <div className="text-xs font-bold text-gray-700 w-8">{p.pct}%</div>
              <div className="text-xs text-gray-400 w-12">{p.count} students</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Report Button */}
      <div className="card p-5 bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">📄 Export Analytics Report</h3>
            <p className="text-xs text-gray-500 mt-0.5">Download placement and skill analytics for NAAC/NBA submissions</p>
          </div>
          <button className="btn-primary text-sm px-5 py-2" onClick={() => alert('Report generation would be implemented with backend integration')}>
            Export PDF →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Placements ────────────────────────────────────────────────────────────────
function Placements() {
  const data = [
    { month: 'Aug', placed: 42 }, { month: 'Sep', placed: 89 }, { month: 'Oct', placed: 134 },
    { month: 'Nov', placed: 187 }, { month: 'Dec', placed: 221 }, { month: 'Jan', placed: 156 },
  ]
  const max = Math.max(...data.map(d => d.placed))

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Monthly Placement Trend</h3>
        <div className="flex items-end gap-3 h-40">
          {data.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-700">{d.placed}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-400 transition-all"
                style={{ height: `${(d.placed / max) * 100}%` }} />
              <span className="text-xs text-gray-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Package Distribution</h3>
        <div className="space-y-3">
          {[['> ₹20 LPA', 8], ['₹15–20 LPA', 14], ['₹10–15 LPA', 31], ['₹6–10 LPA', 34], ['< ₹6 LPA', 13]].map(([range, pct]) => (
            <div key={range} className="flex items-center gap-3">
              <div className="text-xs text-gray-600 w-28">{range}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-primary to-teal h-2.5 rounded-full" style={{ width: pct + '%' }} />
              </div>
              <div className="text-xs font-bold text-gray-700 w-8">{pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── NAAC/NBA ──────────────────────────────────────────────────────────────────
function Naac() {
  const criteria = [
    { code: 'C1', name: 'Curricular Aspects', score: 3.4, max: 4, status: 'Good' },
    { code: 'C2', name: 'Teaching-Learning & Evaluation', score: 3.2, max: 4, status: 'Good' },
    { code: 'C3', name: 'Research, Innovations & Extension', score: 2.8, max: 4, status: 'Satisfactory' },
    { code: 'C4', name: 'Infrastructure & Learning Resources', score: 3.6, max: 4, status: 'Good' },
    { code: 'C5', name: 'Student Support & Progression', score: 3.1, max: 4, status: 'Good' },
    { code: 'C6', name: 'Governance, Leadership & Management', score: 3.3, max: 4, status: 'Good' },
    { code: 'C7', name: 'Institutional Values & Best Practices', score: 3.5, max: 4, status: 'Good' },
  ]
  const overall = (criteria.reduce((acc, c) => acc + c.score, 0) / criteria.length).toFixed(2)

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-primary to-blue-800 text-white text-center">
        <div className="text-xs uppercase tracking-widest text-blue-200 mb-2">NAAC Accreditation Score</div>
        <div className="text-6xl font-black mb-2">{overall}</div>
        <div className="text-blue-200 text-sm">Grade A+ (Accredited)</div>
      </div>
      <div className="space-y-3">
        {criteria.map(c => (
          <div key={c.code} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="badge bg-blue-50 text-blue-700 text-[10px] mr-2">{c.code}</span>
                <span className="text-sm font-semibold text-gray-900">{c.name}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-gray-900">{c.score}</span>
                <span className="text-xs text-gray-400">/{c.max}</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-teal h-2 rounded-full" style={{ width: `${(c.score / c.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Institution() {
  return (
    <Routes>
      <Route index element={<InstitutionHome />} />
      <Route path="placements" element={<Placements />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="naac" element={<Naac />} />
    </Routes>
  )
}