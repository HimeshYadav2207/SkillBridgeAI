import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function FacultyHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/faculty/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const stats = data?.stats || { students: 142, avgScore: 67, assessments: 38, placements: 24 }
  const skillTrends = data?.skillTrends || [
    { skill: 'JavaScript', demand: 89, students: 72 },
    { skill: 'Python', demand: 92, students: 55 },
    { skill: 'React', demand: 78, students: 68 },
    { skill: 'ML/AI', demand: 95, students: 40 },
    { skill: 'System Design', demand: 87, students: 50 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Welcome, Prof. {user?.name?.split(' ').pop()} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Student placement and skill analytics for your department</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Students', value: stats.students, icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Skill Score', value: stats.avgScore, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Assessments', value: stats.assessments, icon: '📝', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Placed', value: stats.placements, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-2`}>{s.icon}</div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Industry Demand vs Student Proficiency</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-blue-500 rounded inline-block"></span>Demand</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded inline-block"></span>Students</span>
          </div>
        </div>
        <div className="space-y-4">
          {skillTrends.map(t => (
            <div key={t.skill}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{t.skill}</span>
                <span className="text-xs text-red-500 font-semibold">Gap: {t.demand - t.students}%</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-14">Industry</span>
                  <div className="flex-1 bg-blue-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: t.demand + '%' }} /></div>
                  <span className="text-xs font-bold text-gray-700 w-8">{t.demand}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-14">Students</span>
                  <div className="flex-1 bg-emerald-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: t.students + '%' }} /></div>
                  <span className="text-xs font-bold text-gray-700 w-8">{t.students}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Students() {
  const students = [
    { name: 'Arjun Kumar', score: 82, status: 'Placed', company: 'Google', risk: 'low' },
    { name: 'Priya Mehta', score: 74, status: 'Searching', company: '—', risk: 'medium' },
    { name: 'Rahul Singh', score: 55, status: 'Searching', company: '—', risk: 'high' },
    { name: 'Sneha Patel', score: 91, status: 'Placed', company: 'Microsoft', risk: 'low' },
    { name: 'Vikram Nair', score: 63, status: 'Searching', company: '—', risk: 'medium' },
  ]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">My Students</h3>
        <span className="badge bg-blue-50 text-blue-700">{students.length} students</span>
      </div>
      <div className="card divide-y divide-gray-50">
        {students.map(s => (
          <div key={s.name} className="p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{s.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-400">{s.status} {s.company !== '—' ? `· ${s.company}` : ''}</p>
            </div>
            <div className="text-center">
              <div className="font-black text-gray-900">{s.score}</div>
              <div className="text-[10px] text-gray-400">score</div>
            </div>
            <span className={`badge text-[10px] ${s.risk === 'low' ? 'bg-emerald-50 text-emerald-600' : s.risk === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
              {s.risk} risk
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Curriculum() {
  const gaps = [
    { course: 'Web Development', gap: 'Missing: GraphQL, WebSockets', priority: 'High' },
    { course: 'Database Systems', gap: 'Missing: NoSQL, Redis', priority: 'Medium' },
    { course: 'AI/ML', gap: 'Missing: PyTorch, Transformers', priority: 'High' },
    { course: 'DevOps', gap: 'Missing: Docker, Kubernetes', priority: 'Medium' },
  ]
  return (
    <div className="space-y-4">
      <div className="card p-5 bg-blue-50 border-blue-100">
        <p className="text-sm text-blue-800 font-semibold">💡 AI Curriculum Recommendations based on industry skill gap analysis:</p>
      </div>
      {gaps.map(g => (
        <div key={g.course} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-gray-900">{g.course}</h4>
              <p className="text-sm text-gray-500 mt-1">{g.gap}</p>
            </div>
            <span className={`badge text-xs ${g.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{g.priority}</span>
          </div>
          <button className="mt-3 text-primary text-sm font-semibold hover:underline">View Suggested Modules →</button>
        </div>
      ))}
    </div>
  )
}

export default function Faculty() {
  return (
    <Routes>
      <Route index element={<FacultyHome />} />
      <Route path="students" element={<Students />} />
      <Route path="skills" element={<FacultyHome />} />
      <Route path="curriculum" element={<Curriculum />} />
    </Routes>
  )
}
