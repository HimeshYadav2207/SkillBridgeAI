import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  pending:     { label: 'Applied',      color: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-400' },
  shortlisted: { label: 'Shortlisted',  color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400' },
  interview:   { label: 'Interview',    color: 'bg-purple-50 text-purple-700',dot: 'bg-purple-400' },
  hired:       { label: 'Hired 🎉',     color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  rejected:    { label: 'Not Selected', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400' },
}

const CAREER_DOMAINS = [
  { id: 'web',     icon: '💻', label: 'Web Development',       desc: 'React, Node.js, fullstack' },
  { id: 'ai',      icon: '🤖', label: 'AI / Machine Learning', desc: 'Python, PyTorch, NLP' },
  { id: 'data',    icon: '📊', label: 'Data Science',          desc: 'SQL, Pandas, visualization' },
  { id: 'cloud',   icon: '☁️', label: 'Cloud & DevOps',        desc: 'AWS, Docker, CI/CD' },
  { id: 'cyber',   icon: '🔐', label: 'Cybersecurity',         desc: 'Networking, ethical hacking' },
  { id: 'mobile',  icon: '📱', label: 'Mobile Development',    desc: 'Android, iOS, Flutter' },
  { id: 'game',    icon: '🎮', label: 'Game Development',      desc: 'Unity, Unreal, C++' },
  { id: 'iot',     icon: '🔧', label: 'Embedded & IoT',        desc: 'Arduino, Raspberry Pi' },
  { id: 'product', icon: '📋', label: 'Product Management',    desc: 'Agile, roadmaps, strategy' },
  { id: 'design',  icon: '🎨', label: 'UI/UX Design',          desc: 'Figma, Prototyping, UX' },
]

function CareerInterestModal({ current, onClose, onSave }) {
  const [selected, setSelected] = useState(current || [])
  const [saving, setSaving] = useState(false)

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  async function save() {
    setSaving(true)
    try {
      await axios.put('/api/auth/profile', { interests: selected })
      onSave(selected)
      onClose()
    } catch {}
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Career Interests</h3>
            <p className="text-xs text-gray-500 mt-0.5">Select up to 3 domains you want to work in</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
          {CAREER_DOMAINS.map(d => (
            <button key={d.id} onClick={() => toggle(d.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                selected.includes(d.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 hover:border-gray-200'
              } ${!selected.includes(d.id) && selected.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}>
              <div className="text-2xl mb-1">{d.icon}</div>
              <div className="text-xs font-bold text-gray-900">{d.label}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{d.desc}</div>
              {selected.includes(d.id) && (
                <div className="text-[10px] text-primary font-bold mt-1">✓ Selected</div>
              )}
            </button>
          ))}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-2">
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving || selected.length === 0}
            className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">
            {saving ? 'Saving...' : `Save ${selected.length > 0 ? `(${selected.length} selected)` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interests, setInterests] = useState(user?.interests || [])

  useEffect(() => {
    axios.get('/api/students/dashboard')
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
    axios.get('/api/students/my-applications')
      .then(r => setApplications(r.data.applications || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setInterests(user?.interests || [])
  }, [user])

  function handleInterestSave(newInterests) {
    setInterests(newInterests)
    refreshUser()
  }

  const stats = data?.stats || { applications: 0, skillScore: 0, profileViews: 0, interviews: 0 }
  const assessment = data?.assessment || { done: false }
  const recentActivity = data?.recentActivity || []

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-primary mx-auto mb-3 flex items-center justify-center text-white font-bold">SB</div>
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* GREETING */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">
            {assessment.done
              ? 'Your AI skill analysis is ready. Check your matches below.'
              : 'Complete your skill assessment to unlock internship matches.'}
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 text-center">
          <div className="text-2xl font-black text-primary">{stats.skillScore}</div>
          <div className="text-xs text-gray-500">Skill Score</div>
        </div>
      </div>

      {/* CAREER INTERESTS BANNER — shown if not set */}
      {interests.length === 0 && (
        <div className="card p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-gray-900">Set Your Career Interests</h3>
                <p className="text-sm text-gray-500 mt-0.5">Tell us what domains you want to work in — we'll personalize your job matches</p>
              </div>
            </div>
            <button onClick={() => setShowInterestModal(true)} className="btn-primary text-sm px-5 py-2 shrink-0">
              Set Interests →
            </button>
          </div>
        </div>
      )}

      {/* CAREER INTERESTS CARD — shown if set */}
      {interests.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">🎯 Career Interests</h3>
            <button onClick={() => setShowInterestModal(true)} className="text-xs text-primary hover:underline font-semibold">
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map(id => {
              const domain = CAREER_DOMAINS.find(d => d.id === id)
              if (!domain) return null
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
                  <span>{domain.icon}</span>
                  <span className="text-sm font-semibold text-primary">{domain.label}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            💡 Your job matches on the Internships page are personalized based on these interests
          </p>
        </div>
      )}

      {/* ONBOARDING BANNER */}
      {!assessment.done && (
        <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="font-bold text-gray-900">Take your AI Skill Assessment</h3>
                <p className="text-sm text-gray-500 mt-0.5">24 questions · ~15 min · Unlocks your skill profile & internship matches</p>
              </div>
            </div>
            <Link to="/assessment" className="btn-primary text-sm px-5 py-2 shrink-0">Start Now →</Link>
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t border-blue-100">
            {[['📝', 'Complete Assessment'], ['📊', 'Get Skill Profile'], ['💼', 'Match Internships']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: stats.applications, change: stats.applications === 0 ? 'None yet' : `${stats.applications} total`, color: 'text-blue-600' },
          { label: 'Profile Views', value: stats.profileViews, change: stats.profileViews === 0 ? 'Complete profile to get views' : `${stats.profileViews} views`, color: 'text-purple-600' },
          { label: 'Interviews', value: stats.interviews, change: stats.interviews === 0 ? 'Apply to get interviews' : `${stats.interviews} scheduled`, color: 'text-emerald-600' },
          { label: 'Skill Score', value: stats.skillScore || '—', change: stats.skillScore === 0 ? 'Take assessment' : 'out of 100', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm font-semibold text-gray-700">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1 opacity-80`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* MY APPLICATIONS */}
      {applications.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">My Applications</h3>
            <span className="badge bg-blue-50 text-blue-700">{applications.length} total</span>
          </div>
          <div className="space-y-3">
            {applications.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
              return (
                <div key={app._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {app.logo || '💼'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{app.title}</div>
                    <div className="text-xs text-gray-500">{app.company}{app.location ? ` · ${app.location}` : ''}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                      {cfg.label}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Link to="/internships" className="block text-center text-sm text-primary font-semibold mt-4 hover:underline">
            Browse more opportunities →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SKILL GAP */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">AI Skill Gap Analysis</h3>
            {assessment.done
              ? <span className="badge bg-emerald-50 text-emerald-700">Assessment complete</span>
              : <span className="badge bg-amber-50 text-amber-700">Pending assessment</span>
            }
          </div>
          {assessment.done && assessment.skillScores?.length > 0 ? (
            <div className="space-y-3">
              {assessment.skillScores.map(({ skill, score }) => (
                <div key={skill} className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 w-32 font-medium">{skill}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-primary to-teal h-2.5 rounded-full transition-all duration-500"
                      style={{ width: score + '%' }} />
                  </div>
                  <div className="text-xs font-bold text-gray-700 w-10 text-right">{score}%</div>
                  {score < 60 && <span className="badge bg-red-50 text-red-600 text-[10px]">Gap</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 text-sm mb-1">Your skill profile will appear here</p>
              <p className="text-gray-400 text-xs mb-4">Complete the assessment to see your strengths and gaps</p>
              <Link to="/assessment" className="btn-primary text-sm px-5 py-2">Take Assessment →</Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {assessment.done ? (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Top Match 🎯</h3>
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-bold text-gray-900">Google SWE Intern</div>
              <div className="text-sm text-gray-500 mt-1">Bangalore • ₹80,000/mo</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '94%' }} />
                </div>
                <span className="text-xs font-bold text-emerald-600">94% match</span>
              </div>
              <Link to="/internships" className="block w-full mt-3 btn-primary text-sm py-2 text-center">View All Matches</Link>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-1">Internship Matches</h3>
              <p className="text-xs text-gray-500 mb-4">Take the assessment to unlock AI-matched internships tailored to your skills</p>
              <Link to="/assessment" className="btn-primary text-sm py-2 block">Unlock Matches</Link>
            </div>
          )}

          {/* RECENT ACTIVITY */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs shrink-0">
                      {a.type === 'application' ? '💼' : a.type === 'assessment' ? '📝' : '⚡'}
                    </div>
                    <div>
                      <p className="text-gray-700 text-xs">{a.text}</p>
                      <p className="text-gray-400 text-[10px]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">No activity yet</p>
                <p className="text-xs text-gray-400 mt-1">Start by taking the skill assessment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CAREER INTEREST MODAL */}
      {showInterestModal && (
        <CareerInterestModal
          current={interests}
          onClose={() => setShowInterestModal(false)}
          onSave={handleInterestSave}
        />
      )}
    </div>
  )
}