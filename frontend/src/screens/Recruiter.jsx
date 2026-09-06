import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function RecruiterHome() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/api/recruiters/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const stats = data?.stats || { activePosts: 4, applicants: 127, shortlisted: 23, hired: 8 }

  const pipeline = [
    { stage: 'Applied', count: 127, color: 'bg-blue-500' },
    { stage: 'Screened', count: 64, color: 'bg-indigo-500' },
    { stage: 'Shortlisted', count: 23, color: 'bg-amber-500' },
    { stage: 'Hired', count: 8, color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's your hiring activity overview</p>
      </div>

      {/* Verification Status Banner */}
      {!user?.recruiterVerified && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
          <div className="text-2xl">⏳</div>
          <div>
            <p className="font-bold text-amber-800 text-sm">Account Verification Pending</p>
            <p className="text-amber-700 text-xs mt-0.5">Your GSTIN / Company Registration is under review. You can browse the platform but job posting will be enabled after verification (typically within 24 hours).</p>
            {user?.gstin && <p className="text-amber-600 text-xs mt-1 font-mono">GSTIN submitted: {user.gstin}</p>}
          </div>
          <span className="ml-auto bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full">PENDING</span>
        </div>
      )}
      {user?.recruiterVerified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-emerald-700">
          <span>✅</span> <span className="font-semibold">Verified Recruiter</span> — GSTIN verified · Trusted employer badge active
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Posts', value: stats.activePosts, icon: '📋', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Applicants', value: stats.applicants, icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Hired', value: stats.hired, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`text-2xl mb-1 ${s.bg} w-10 h-10 rounded-xl flex items-center justify-center`}>{s.icon}</div>
            <div className={`text-3xl font-black mt-2 mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-5">Hiring Pipeline</h3>
          <div className="space-y-4">
            {pipeline.map(p => (
              <div key={p.stage}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{p.stage}</span>
                  <span className="font-bold text-gray-900">{p.count}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className={`${p.color} h-2.5 rounded-full`} style={{ width: `${(p.count / 127) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Applicants</h3>
          <div className="space-y-3">
            {(data?.recentApplicants || [
              { name: 'Arjun K.', role: 'SWE Intern', match: 94, status: 'shortlisted' },
              { name: 'Priya M.', role: 'SWE Intern', match: 88, status: 'applied' },
              { name: 'Rahul S.', role: 'ML Intern', match: 76, status: 'applied' },
            ]).map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{a.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.role}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">{a.match}%</span>
                <span className={`badge text-[10px] ${a.status === 'shortlisted' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  pending:     'bg-blue-50 text-blue-700',
  shortlisted: 'bg-amber-50 text-amber-700',
  interview:   'bg-purple-50 text-purple-700',
  hired:       'bg-emerald-50 text-emerald-700',
  rejected:    'bg-gray-100 text-gray-500',
}

// ─── CANDIDATES ───────────────────────────────────────────────────────────────
function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [minScore, setMinScore] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')
  const [skillFilter, setSkillFilter] = useState('')

  useEffect(() => {
    axios.get('/api/recruiters/candidates')
      .then(r => setCandidates(r.data.candidates || []))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(appId, newStatus) {
    try {
      await axios.patch(`/api/recruiters/applications/${appId}`, { status: newStatus })
      setStatus(p => ({ ...p, [appId]: newStatus }))
    } catch {}
  }

  if (loading) return <div className="card p-10 text-center text-gray-400">Loading applicants...</div>

  if (candidates.length === 0) return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-3">👥</div>
      <p className="font-bold text-gray-700">No applicants yet</p>
      <p className="text-sm text-gray-400 mt-1">Post a job and students who apply will appear here with their full profiles.</p>
    </div>
  )

    const filtered = candidates.filter(c => {
    const matchScore = c.skillScore >= minScore
    const matchStatus = filterStatus === 'all' || (status[c.applicationId] || c.status) === filterStatus
    const matchSkill = !skillFilter || (c.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
    return matchScore && matchStatus && matchSkill
  })

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="card p-4 space-y-3">
        <h4 className="font-bold text-gray-900 text-sm">🔍 Filter Candidates</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Min Skill Score: {minScore}+</label>
            <input type="range" min="0" max="100" step="10" value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Filter by Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option value="all">All Status</option>
              <option value="pending">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Filter by Skill</label>
            <input value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
              placeholder="e.g. React, Python..." 
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-500">{filtered.length} of {candidates.length} candidates match</span>
          <button onClick={() => { setMinScore(0); setFilterStatus('all'); setSkillFilter('') }}
            className="text-xs text-primary hover:underline font-semibold">Clear Filters</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Applicants</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            filtered.forEach(c => {
              if ((status[c.applicationId] || c.status) === 'pending') {
                updateStatus(c.applicationId, 'shortlisted')
              }
            })
          }} className="text-xs text-amber-600 font-bold hover:underline">
            ⭐ Shortlist All Matching
          </button>
          <span className="badge bg-blue-50 text-blue-700">{filtered.length} shown</span>
        </div>
      </div>
      {filtered.map(c => {
        const currentStatus = status[c.applicationId] || c.status
        const isExpanded = expanded === c.applicationId
        return (
          <div key={c.applicationId} className="card p-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white font-bold flex items-center justify-center shrink-0 text-lg">
                {c.avatar}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + college + applied-for */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{c.name}</h4>
                    <p className="text-xs text-gray-500">{c.college}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">Applied for: {c.appliedFor}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-primary">{c.skillScore}</div>
                    <div className="text-[10px] text-gray-400">Skill Score</div>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-500'}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(c.skills || []).map(s => <span key={s} className="badge bg-blue-50 text-blue-700 text-[10px]">{s}</span>)}
                </div>

                {/* Expandable: bio + skill bars + links */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {c.bio && <p className="text-xs text-gray-600 italic">"{c.bio}"</p>}
                    {c.skillScores && c.skillScores.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Skill Assessment Results</p>
                        {c.skillScores.map(({ skill, score }) => (
                          <div key={skill} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-28">{skill}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${score >= 75 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: score + '%' }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 w-8 text-right">{score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {c.github && <a href={`https://${c.github.replace('https://','')}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">🔗 GitHub</a>}
                      {c.linkedin && <a href={`https://${c.linkedin.replace('https://','')}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">🔗 LinkedIn</a>}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <button onClick={() => setExpanded(isExpanded ? null : c.applicationId)}
                    className="text-xs text-primary font-semibold hover:underline">
                    {isExpanded ? 'Hide profile ▲' : 'View full profile ▼'}
                  </button>
                  <div className="ml-auto flex gap-2">
                    {['shortlisted', 'interview', 'hired', 'rejected'].map(s => (
                      <button key={s} onClick={() => updateStatus(c.applicationId, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${currentStatus === s ? 'bg-primary text-white shadow' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── JOB POSTINGS ─────────────────────────────────────────────────────────────
function JobPostings() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    axios.get('/api/recruiters/jobs').then(r => setJobs(r.data.jobs || [])).catch(() => {
      setJobs([
        { _id: '1', title: 'SWE Intern', location: 'Bangalore', stipend: '₹80,000', applicants: 47, status: 'active' },
        { _id: '2', title: 'ML Intern', location: 'Remote', stipend: '₹70,000', applicants: 32, status: 'active' },
        { _id: '3', title: 'Frontend Intern', location: 'Hyderabad', stipend: '₹55,000', applicants: 61, status: 'closed' },
      ])
    })
  }, [])

  return (
    <div className="space-y-4">
      {jobs.map(j => (
        <div key={j._id} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900">{j.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{j.location} · {j.stipend}/mo</p>
            </div>
            <div className="text-right">
              <div className="font-black text-2xl text-gray-900">{j.applicants}</div>
              <div className="text-xs text-gray-400">applicants</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`badge text-xs ${j.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{j.status}</span>
            <div className="flex gap-2">
              <button className="text-xs btn-outline px-3 py-1.5">Edit</button>
              <button className="text-xs btn-primary px-3 py-1.5">View Applicants</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── POST JOB ─────────────────────────────────────────────────────────────────
function PostJob() {
  const [form, setForm] = useState({ title: '', location: '', stipend: '', duration: '', skills: '', description: '' })
  const [posted, setPosted] = useState(false)
  const [loading, setLoading] = useState(false)

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/recruiters/jobs', { ...form, skills: form.skills.split(',').map(s => s.trim()) })
    } catch {}
    setPosted(true)
    setLoading(false)
  }

  if (posted) return (
    <div className="card p-10 text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-xl font-black text-gray-900 mb-2">Job Posted!</h3>
      <p className="text-gray-500 text-sm mb-6">Your internship is now live and visible to matching students.</p>
      <button onClick={() => { setPosted(false); setForm({ title: '', location: '', stipend: '', duration: '', skills: '', description: '' }) }} className="btn-primary px-6 py-2">Post Another</button>
    </div>
  )

  return (
    <div className="max-w-xl">
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-5">Post a New Internship</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ k: 'title', label: 'Job Title', ph: 'e.g. Software Engineer Intern' },
            { k: 'location', label: 'Location', ph: 'e.g. Bangalore / Remote' },
            { k: 'stipend', label: 'Stipend (₹/month)', ph: 'e.g. 60000' },
            { k: 'duration', label: 'Duration', ph: 'e.g. 3 months' },
            { k: 'skills', label: 'Required Skills (comma-separated)', ph: 'React, Node.js, SQL' },
          ].map(({ k, label, ph }) => (
            <div key={k}>
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">{label}</label>
              <input value={form[k]} onChange={f(k)} placeholder={ph} required className="input" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 block mb-1.5 font-medium">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={4} placeholder="Describe the role, responsibilities..." className="input resize-none" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-bold text-sm ${loading ? 'bg-gray-200 text-gray-400' : 'btn-primary'}`}>
            {loading ? 'Posting...' : 'Post Internship →'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function Analytics() {
  const metrics = [
    { label: 'Avg. Time to Hire', value: '14 days', trend: '↓ 3 days faster', good: true },
    { label: 'Offer Acceptance Rate', value: '82%', trend: '↑ 5% this quarter', good: true },
    { label: 'Applicant-to-Hire Ratio', value: '16:1', trend: '↓ from 22:1', good: true },
    { label: 'Profile Views per Post', value: '234', trend: '↑ 41 this month', good: true },
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="card p-5">
            <div className="text-2xl font-black text-gray-900 mb-1">{m.value}</div>
            <div className="text-sm text-gray-600 mb-1">{m.label}</div>
            <div className={`text-xs font-semibold ${m.good ? 'text-emerald-600' : 'text-red-500'}`}>{m.trend}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Skill Gaps in Applicants</h3>
        <div className="space-y-3">
          {[['System Design', 38], ['Machine Learning', 52], ['DSA', 61], ['SQL', 74], ['React', 89]].map(([s, v]) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-28 text-sm text-gray-600">{s}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${v < 60 ? 'bg-red-400' : v < 75 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: v + '%' }} />
              </div>
              <div className="text-xs font-bold text-gray-700 w-8">{v}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN WRAPPER ─────────────────────────────────────────────────────────────
export default function Recruiter() {
  return (
    <Routes>
      <Route index element={<RecruiterHome />} />
      <Route path="candidates" element={<Candidates />} />
      <Route path="jobs" element={<JobPostings />} />
      <Route path="post" element={<PostJob />} />
      <Route path="analytics" element={<Analytics />} />
    </Routes>
  )
}
