import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// ── Faculty Home ─────────────────────────────────────────────────────────────
function FacultyHome() {
  const { user } = useAuth()
  const stats = { students: 142, avgScore: 67, assessments: 38, placements: 24 }
  const skillTrends = [
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
        <p className="text-gray-500 text-sm mt-1">Student placement analytics and industry collaboration opportunities</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Students', value: stats.students, icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Skill Score', value: stats.avgScore, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Assessments Done', value: stats.assessments, icon: '📝', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Students Placed', value: stats.placements, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-2`}>{s.icon}</div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🏭', label: 'Browse FDPs', desc: 'Faculty development programs', color: 'bg-blue-50 border-blue-200 text-blue-700', path: 'fdp' },
            { icon: '🔬', label: 'Research Projects', desc: 'Industry collaboration', color: 'bg-purple-50 border-purple-200 text-purple-700', path: 'fdp' },
            { icon: '💼', label: 'Consultancy', desc: 'Industry opportunities', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', path: 'fdp' },
            { icon: '📚', label: 'Curriculum Gap', desc: 'AI recommendations', color: 'bg-amber-50 border-amber-200 text-amber-700', path: 'curriculum' },
          ].map(a => (
            <NavLink key={a.label} to={a.path}
              className={`p-4 rounded-xl border ${a.color} hover:shadow-md transition-all`}>
              <div className="text-2xl mb-2">{a.icon}</div>
              <div className="text-xs font-bold">{a.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{a.desc}</div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Skill Gap Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Industry Demand vs Student Proficiency</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-blue-500 rounded inline-block"></span>Industry Demand</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-500 rounded inline-block"></span>Student Level</span>
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
                  <div className="flex-1 bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: t.demand + '%' }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{t.demand}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-14">Students</span>
                  <div className="flex-1 bg-emerald-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: t.students + '%' }} />
                  </div>
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

// ── Students ─────────────────────────────────────────────────────────────────
function Students() {
  const students = [
    { name: 'Arjun Kumar', score: 82, status: 'Placed', company: 'Google', risk: 'low', skills: ['React', 'Python'] },
    { name: 'Priya Mehta', score: 74, status: 'Searching', company: '—', risk: 'medium', skills: ['JavaScript', 'SQL'] },
    { name: 'Rahul Singh', score: 55, status: 'Searching', company: '—', risk: 'high', skills: ['Python'] },
    { name: 'Sneha Patel', score: 91, status: 'Placed', company: 'Microsoft', risk: 'low', skills: ['ML/AI', 'Python'] },
    { name: 'Vikram Nair', score: 63, status: 'Searching', company: '—', risk: 'medium', skills: ['React', 'Node.js'] },
    { name: 'Ananya Sharma', score: 78, status: 'Interview', company: 'Amazon', risk: 'low', skills: ['Java', 'DSA'] },
    { name: 'Rohan Gupta', score: 45, status: 'Searching', company: '—', risk: 'high', skills: ['JavaScript'] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">My Students</h3>
        <span className="badge bg-blue-50 text-blue-700">{students.length} students</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        {[
          { label: 'Placed', value: students.filter(s => s.status === 'Placed').length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'In Interview', value: students.filter(s => s.status === 'Interview').length, color: 'bg-purple-50 text-purple-700' },
          { label: 'Searching', value: students.filter(s => s.status === 'Searching').length, color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`card p-3 text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card divide-y divide-gray-50">
        {students.map(s => (
          <div key={s.name} className="p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{s.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">{s.name}</p>
              <div className="flex gap-1 mt-0.5 flex-wrap">
                {s.skills.map(sk => <span key={sk} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{sk}</span>)}
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className="font-black text-gray-900">{s.score}</div>
              <div className="text-[10px] text-gray-400">score</div>
            </div>
            <div className="text-center shrink-0">
              <span className={`badge text-[10px] ${s.status === 'Placed' ? 'bg-emerald-50 text-emerald-600' : s.status === 'Interview' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                {s.status}
              </span>
              {s.company !== '—' && <div className="text-[10px] text-gray-400 mt-0.5">{s.company}</div>}
            </div>
            <span className={`badge text-[10px] shrink-0 ${s.risk === 'low' ? 'bg-emerald-50 text-emerald-600' : s.risk === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
              {s.risk} risk
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FDP & Opportunities ───────────────────────────────────────────────────────
function FDPOpportunities() {
  const [activeTab, setActiveTab] = useState('fdp')
  const [applying, setApplying] = useState(null)
  const [applied, setApplied] = useState(new Set())

  const opportunities = {
    fdp: [
      { id: 'f1', title: 'Faculty Development Program in AI & ML', org: 'IIT Bombay', duration: '2 weeks', mode: 'Offline', location: 'Mumbai', deadline: '2026-10-15', stipend: '₹15,000', seats: 30, tags: ['AI', 'ML', 'Deep Learning'], color: 'bg-blue-50 border-blue-200' },
      { id: 'f2', title: 'Industry 4.0 Technologies FDP', org: 'TCS iON', duration: '5 days', mode: 'Online', location: 'Remote', deadline: '2026-10-20', stipend: 'Free', seats: 100, tags: ['IoT', 'Automation', 'Cloud'], color: 'bg-purple-50 border-purple-200' },
      { id: 'f3', title: 'Modern Web Technologies Workshop', org: 'Google India', duration: '3 days', mode: 'Hybrid', location: 'Bangalore', deadline: '2026-11-01', stipend: '₹5,000', seats: 50, tags: ['React', 'Node.js', 'Cloud'], color: 'bg-emerald-50 border-emerald-200' },
      { id: 'f4', title: 'Data Science & Analytics FDP', org: 'NASSCOM', duration: '1 week', mode: 'Online', location: 'Remote', deadline: '2026-11-10', stipend: 'Free', seats: 200, tags: ['Python', 'SQL', 'Visualization'], color: 'bg-amber-50 border-amber-200' },
    ],
    internship: [
      { id: 'i1', title: 'Faculty Internship — R&D Division', org: 'DRDO', duration: '8 weeks', mode: 'Offline', location: 'Delhi', deadline: '2026-10-25', stipend: '₹50,000/mo', seats: 10, tags: ['Research', 'Defense Tech'], color: 'bg-red-50 border-red-200' },
      { id: 'i2', title: 'Industry Faculty Internship', org: 'Microsoft Research', duration: '12 weeks', mode: 'Hybrid', location: 'Hyderabad', deadline: '2026-11-05', stipend: '₹80,000/mo', seats: 5, tags: ['AI Research', 'NLP'], color: 'bg-blue-50 border-blue-200' },
      { id: 'i3', title: 'Product Development Faculty Intern', org: 'Flipkart', duration: '6 weeks', mode: 'Offline', location: 'Bangalore', deadline: '2026-11-15', stipend: '₹60,000/mo', seats: 8, tags: ['Product', 'Engineering'], color: 'bg-amber-50 border-amber-200' },
    ],
    consultancy: [
      { id: 'c1', title: 'Technical Consultant — AI Strategy', org: 'Infosys BPM', duration: 'Ongoing', mode: 'Remote', location: 'Remote', deadline: '2026-10-30', stipend: '₹1,20,000/mo', seats: 3, tags: ['AI', 'Strategy', 'Consulting'], color: 'bg-emerald-50 border-emerald-200' },
      { id: 'c2', title: 'Curriculum Design Consultant', org: 'AICTE', duration: '3 months', mode: 'Hybrid', location: 'Delhi', deadline: '2026-11-20', stipend: '₹80,000/mo', seats: 10, tags: ['Education', 'Curriculum'], color: 'bg-purple-50 border-purple-200' },
      { id: 'c3', title: 'Research Consultant — Healthcare AI', org: 'Apollo Hospitals', duration: '6 months', mode: 'Hybrid', location: 'Chennai', deadline: '2026-12-01', stipend: '₹1,00,000/mo', seats: 2, tags: ['Healthcare', 'AI', 'Research'], color: 'bg-red-50 border-red-200' },
    ],
    research: [
      { id: 'r1', title: 'Collaborative Research — Smart Cities', org: 'L&T Technology Services', duration: '1 year', mode: 'Hybrid', location: 'Mumbai', deadline: '2026-11-01', stipend: '₹2,00,000 grant', seats: 5, tags: ['IoT', 'Smart City', 'Research'], color: 'bg-blue-50 border-blue-200' },
      { id: 'r2', title: 'Joint Research — NLP for Indian Languages', org: 'Google AI India', duration: '2 years', mode: 'Remote', location: 'Remote', deadline: '2026-11-30', stipend: '₹5,00,000 grant', seats: 3, tags: ['NLP', 'Languages', 'AI'], color: 'bg-emerald-50 border-emerald-200' },
      { id: 'r3', title: 'Industry-Academia Research — Cybersecurity', org: 'CERT-In', duration: '1 year', mode: 'Hybrid', location: 'Delhi', deadline: '2026-12-15', stipend: '₹3,00,000 grant', seats: 4, tags: ['Cybersecurity', 'Research'], color: 'bg-red-50 border-red-200' },
    ],
  }

  const tabs = [
    { key: 'fdp', label: '🏭 FDPs', count: opportunities.fdp.length },
    { key: 'internship', label: '💼 Faculty Internships', count: opportunities.internship.length },
    { key: 'consultancy', label: '🤝 Consultancy', count: opportunities.consultancy.length },
    { key: 'research', label: '🔬 Research Projects', count: opportunities.research.length },
  ]

  function apply(id) {
    setApplying(id)
    setTimeout(() => {
      setApplied(prev => new Set([...prev, id]))
      setApplying(null)
    }, 800)
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">FDP & Industry Opportunities</h3>
        <p className="text-sm text-gray-500 mt-0.5">Faculty Development Programs, internships, consultancy, and collaborative research projects</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-primary text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'}`}>
            {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities[activeTab].map(op => (
          <div key={op.id} className={`card p-5 border ${op.color}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-bold text-gray-900">{op.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${op.mode === 'Online' ? 'bg-emerald-100 text-emerald-700' : op.mode === 'Offline' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {op.mode}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">{op.org}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span>📍 {op.location}</span>
                  <span>⏱ {op.duration}</span>
                  <span>💰 {op.stipend}</span>
                  <span>👥 {op.seats} seats</span>
                  <span className="text-red-500 font-semibold">📅 Deadline: {new Date(op.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {op.tags.map(t => <span key={t} className="badge bg-white text-gray-600 text-[10px] border border-gray-200">{t}</span>)}
                </div>
              </div>
              <div className="shrink-0">
                {applied.has(op.id)
                  ? <button disabled className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">✓ Applied</button>
                  : <button onClick={() => apply(op.id)} disabled={applying === op.id}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                      {applying === op.id ? '...' : 'Apply Now'}
                    </button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Curriculum ────────────────────────────────────────────────────────────────
function Curriculum() {
  const gaps = [
    { course: 'Web Development', gap: 'Missing: GraphQL, WebSockets, Next.js', priority: 'High', demand: 89 },
    { course: 'Database Systems', gap: 'Missing: NoSQL, Redis, MongoDB', priority: 'Medium', demand: 76 },
    { course: 'AI/ML', gap: 'Missing: PyTorch, Transformers, LLMs', priority: 'High', demand: 95 },
    { course: 'DevOps', gap: 'Missing: Docker, Kubernetes, CI/CD', priority: 'Medium', demand: 82 },
    { course: 'Cybersecurity', gap: 'Missing: Ethical Hacking, OWASP, Penetration Testing', priority: 'High', demand: 88 },
  ]
  return (
    <div className="space-y-4">
      <div className="card p-5 bg-blue-50 border-blue-100">
        <p className="text-sm text-blue-800 font-semibold">💡 AI Curriculum Recommendations based on real-time industry skill gap analysis</p>
        <p className="text-xs text-blue-600 mt-1">Last updated: Based on 500+ job postings analyzed this month</p>
      </div>
      {gaps.map(g => (
        <div key={g.course} className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{g.course}</h4>
                <span className={`badge text-xs ${g.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{g.priority} Priority</span>
              </div>
              <p className="text-sm text-gray-500">{g.gap}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">Industry demand:</span>
                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: g.demand + '%' }} />
                </div>
                <span className="text-xs font-bold text-blue-600">{g.demand}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
  <a href={`https://www.coursera.org/search?query=${encodeURIComponent(g.course)}`} target="_blank" rel="noreferrer"
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:shadow-sm transition-all">
    📘 Coursera
  </a>
  <a href={`https://nptel.ac.in/course.html?searchQuery=${encodeURIComponent(g.course)}`} target="_blank" rel="noreferrer"
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:shadow-sm transition-all">
    🎓 NPTEL
  </a>
  <a href={`https://swayam.gov.in/explorer?searchText=${encodeURIComponent(g.course)}`} target="_blank" rel="noreferrer"
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:shadow-sm transition-all">
    🇮🇳 SWAYAM
  </a>
  <a href={`https://diksha.gov.in/explore?key=${encodeURIComponent(g.course)}`} target="_blank" rel="noreferrer"
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:shadow-sm transition-all">
    📚 DIKSHA
  </a>
  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(g.course + ' tutorial')}`} target="_blank" rel="noreferrer"
    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:shadow-sm transition-all">
    ▶ YouTube
  </a>
</div>
        </div>
      ))}
    </div>
  )
}

// ── Main Faculty Component ─────────────────────────────────────────────────────
export default function Faculty() {
  return (
    <Routes>
      <Route index element={<FacultyHome />} />
      <Route path="students" element={<Students />} />
      <Route path="skills" element={<FacultyHome />} />
      <Route path="curriculum" element={<Curriculum />} />
      <Route path="fdp" element={<FDPOpportunities />} />
    </Routes>
  )
}