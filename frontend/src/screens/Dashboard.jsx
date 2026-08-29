import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  pending:     { label: 'Applied',     color: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-400' },
  shortlisted: { label: 'Shortlisted', color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400' },
  interview:   { label: 'Interview',   color: 'bg-purple-50 text-purple-700',dot: 'bg-purple-400' },
  hired:       { label: 'Hired 🎉',    color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  rejected:    { label: 'Not Selected',color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    axios.get('/api/students/dashboard')
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
    axios.get('/api/students/my-applications')
      .then(r => setApplications(r.data.applications || []))
      .catch(() => {})
  }, [])

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

      {/* ONBOARDING BANNER — shown for new users */}
      {!assessment.done && (
        <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="font-bold text-gray-900">Take your AI Skill Assessment</h3>
                <p className="text-sm text-gray-500 mt-0.5">8 questions · ~10 min · Unlocks your skill profile & internship matches</p>
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
          { label: 'Applications', value: stats.applications, change: stats.applications === 0 ? 'None yet' : `${stats.applications} total`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Profile Views', value: stats.profileViews, change: stats.profileViews === 0 ? 'Complete profile to get views' : `${stats.profileViews} views`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Interviews', value: stats.interviews, change: stats.interviews === 0 ? 'Apply to get interviews' : `${stats.interviews} scheduled`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Skill Score', value: stats.skillScore || '—', change: stats.skillScore === 0 ? 'Take assessment' : 'out of 100', color: 'text-amber-600', bg: 'bg-amber-50' },
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
        {/* SKILL GAP — real data after assessment, prompt before */}
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
          {/* TOP MATCH — only show after assessment */}
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
    </div>
  )
}
