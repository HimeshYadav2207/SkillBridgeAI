import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function InstitutionHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/institution/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const stats = data?.stats || { students: 0, placed: 0, recruiters: 0, avgPackage: '12.4' }
  const placementRate = stats.students > 0 ? Math.round((stats.placed / stats.students) * 100) : 0
  const recentPlacements = data?.recentPlacements || []

  const departments = [
    { name: 'Computer Science', students: 420, placed: 318, rate: 76 },
    { name: 'Electronics', students: 380, placed: 247, rate: 65 },
    { name: 'Mechanical', students: 290, placed: 156, rate: 54 },
    { name: 'Civil', students: 210, placed: 98, rate: 47 },
    { name: 'Information Tech', students: 340, placed: 272, rate: 80 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Institution Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">{user?.college || 'IIT Bombay'} — Placement & Analytics Overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.students.toLocaleString(), icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Placed', value: stats.placed.toLocaleString(), icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Placement Rate', value: placementRate + '%', icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Package', value: '₹' + stats.avgPackage + ' LPA', icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* DEPARTMENT BREAKDOWN */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Department-wise Placement</h3>
        <div className="space-y-4">
          {departments.map(d => (
            <div key={d.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{d.name}</span>
                <span className="text-xs text-gray-500">{d.placed}/{d.students} placed · <span className="font-bold text-gray-900">{d.rate}%</span></span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${d.rate >= 70 ? 'bg-emerald-500' : d.rate >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: d.rate + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT PLACEMENTS — live from DB */}
      {recentPlacements.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Placements</h3>
            <span className="badge bg-emerald-50 text-emerald-700">Live data</span>
          </div>
          <div className="space-y-3">
            {recentPlacements.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                  {p.studentName?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{p.studentName}</div>
                  <div className="text-xs text-gray-500">{p.college}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span>{p.logo}</span> {p.company}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✅ {p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOP RECRUITERS */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Recruiting Companies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Flipkart', 'Swiggy'].map((c, i) => (
            <div key={c} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
              <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-sm">{['🌐','💻','📦','🏢','💼','⚙','🛒','🍔'][i]}</div>
              <span className="text-xs font-semibold text-gray-700 truncate">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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

export default function Institution() {
  return (
    <Routes>
      <Route index element={<InstitutionHome />} />
      <Route path="placements" element={<Placements />} />
      <Route path="analytics" element={<InstitutionHome />} />
      <Route path="naac" element={<Naac />} />
    </Routes>
  )
}
