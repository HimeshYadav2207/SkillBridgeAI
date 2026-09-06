import { useState, useEffect } from 'react'
import axios from 'axios'

const WEEKS = [
  { week: 1, title: 'Onboarding & Setup', desc: 'Environment setup, team introduction, project briefing', status: 'completed' },
  { week: 2, title: 'Learning & Exploration', desc: 'Codebase exploration, technology stack familiarization', status: 'completed' },
  { week: 3, title: 'First Task Assigned', desc: 'Working on first assigned module with mentor guidance', status: 'completed' },
  { week: 4, title: 'Feature Development', desc: 'Building core features independently', status: 'current' },
  { week: 5, title: 'Code Review & Iteration', desc: 'Peer reviews, bug fixes, and improvements', status: 'upcoming' },
  { week: 6, title: 'Final Delivery', desc: 'Project completion, documentation, and handover', status: 'upcoming' },
]

const MENTOR_FEEDBACK = [
  { week: 1, mentor: 'Rahul Verma', role: 'Senior Engineer', rating: 5, comment: 'Great start! Picked up the tools quickly and asked the right questions during onboarding.', date: '2026-08-15' },
  { week: 2, mentor: 'Rahul Verma', role: 'Senior Engineer', rating: 4, comment: 'Good progress on understanding the codebase. Needs to improve on writing cleaner commit messages.', date: '2026-08-22' },
  { week: 3, mentor: 'Priya Kapoor', role: 'Tech Lead', rating: 5, comment: 'Excellent work on the first task. Completed ahead of schedule and the code quality is impressive.', date: '2026-08-29' },
]

const SKILLS_DEVELOPED = [
  { skill: 'React.js', progress: 75, prev: 50 },
  { skill: 'Node.js', progress: 60, prev: 33 },
  { skill: 'System Design', progress: 45, prev: 33 },
  { skill: 'Git & CI/CD', progress: 80, prev: 20 },
  { skill: 'Agile/Scrum', progress: 70, prev: 0 },
]

export default function InternshipTracker() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('progress')
  const [checkIn, setCheckIn] = useState({ tasks: '', challenges: '', learning: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    axios.get('/api/students/my-applications')
      .then(r => {
        const apps = r.data.applications || []
        setApplications(apps)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeInternship = applications.find(a => a.status === 'hired') || null

  function submitCheckIn() {
    if (!checkIn.tasks.trim()) return
    setSubmitted(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-gray-400">Loading internship tracker...</p>
    </div>
  )

  if (!activeInternship) return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">💼</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">No Active Internship</h2>
        <p className="text-gray-500 text-sm mb-6">You don't have an active internship yet. Apply to opportunities and get hired to track your progress here.</p>
        <a href="/internships" className="btn-primary px-6 py-2 text-sm">Browse Internships →</a>
      </div>

      {/* Demo mode for SIH */}
      <div className="mt-4 card p-4 bg-amber-50 border-amber-200">
        <p className="text-xs text-amber-700 font-semibold text-center">
          👇 Demo Preview — This is how the tracker looks when you have an active internship
        </p>
      </div>
      <DemoTracker activeTab={activeTab} setActiveTab={setActiveTab} checkIn={checkIn} setCheckIn={setCheckIn} submitted={submitted} submitCheckIn={submitCheckIn} />
    </div>
  )

  return (
    <TrackerContent
      internship={activeInternship}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      checkIn={checkIn}
      setCheckIn={setCheckIn}
      submitted={submitted}
      submitCheckIn={submitCheckIn}
    />
  )
}

function DemoTracker({ activeTab, setActiveTab, checkIn, setCheckIn, submitted, submitCheckIn }) {
  const demoInternship = {
    title: 'Software Engineer Intern',
    company: 'Google India',
    location: 'Bangalore',
    logo: '🌐',
    stipend: '₹80,000/mo',
    duration: '3 months',
  }
  return <TrackerContent internship={demoInternship} activeTab={activeTab} setActiveTab={setActiveTab} checkIn={checkIn} setCheckIn={setCheckIn} submitted={submitted} submitCheckIn={submitCheckIn} isDemo />
}

function TrackerContent({ internship, activeTab, setActiveTab, checkIn, setCheckIn, submitted, submitCheckIn, isDemo }) {
  const completedWeeks = WEEKS.filter(w => w.status === 'completed').length
  const totalWeeks = WEEKS.length
  const overallProgress = Math.round((completedWeeks / totalWeeks) * 100)

  const tabs = [
    { key: 'progress', label: '📅 Weekly Progress' },
    { key: 'feedback', label: '💬 Mentor Feedback' },
    { key: 'skills', label: '📈 Skills Developed' },
    { key: 'checkin', label: '✏️ Weekly Check-in' },
  ]

  return (
    <div className="space-y-6">
      {/* Internship Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shrink-0">
            {internship.logo || '💼'}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">{internship.title}</h2>
                <p className="text-gray-600 font-semibold">{internship.company}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>📍 {internship.location || 'Bangalore'}</span>
                  <span>💰 {internship.stipend || '₹50,000/mo'}</span>
                  <span>⏱ {internship.duration || '3 months'}</span>
                </div>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✅ Active
              </span>
            </div>

            {/* Overall Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">Overall Progress</span>
                <span className="font-bold text-primary">{overallProgress}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-primary to-teal h-3 rounded-full transition-all"
                  style={{ width: overallProgress + '%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{completedWeeks} of {totalWeeks} weeks completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-primary text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Weekly Progress */}
      {activeTab === 'progress' && (
        <div className="space-y-3">
          {WEEKS.map((w, i) => (
            <div key={w.week} className={`card p-5 border-l-4 ${w.status === 'completed' ? 'border-emerald-500' : w.status === 'current' ? 'border-primary' : 'border-gray-200'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${w.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : w.status === 'current' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                  {w.status === 'completed' ? '✓' : w.week}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">Week {w.week}: {w.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : w.status === 'current' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {w.status === 'completed' ? '✅ Completed' : w.status === 'current' ? '🔄 In Progress' : '⏳ Upcoming'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{w.desc}</p>
                  {w.status === 'current' && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 font-semibold">📌 Current week — submit your weekly check-in to mark progress</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="card p-4 bg-blue-50 border-blue-100">
            <p className="text-xs text-blue-700 font-semibold">💬 Mentor feedback is submitted weekly by your assigned industry mentor</p>
          </div>
          {MENTOR_FEEDBACK.map((f, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {f.mentor[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{f.mentor}</p>
                    <p className="text-xs text-gray-500">{f.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= f.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Week {f.week} · {new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">"{f.comment}"</p>
            </div>
          ))}
          <div className="card p-5 border-dashed border-gray-300 text-center">
            <p className="text-xs text-gray-400">Week 4 feedback pending — your mentor will submit it at end of the week</p>
          </div>
        </div>
      )}

      {/* Skills Developed */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="card p-4 bg-emerald-50 border-emerald-100">
            <p className="text-xs text-emerald-700 font-semibold">📈 Skill scores are updated weekly based on mentor assessment and task completion</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Skills Growth During Internship</h3>
            <div className="space-y-5">
              {SKILLS_DEVELOPED.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{s.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Before: {s.prev}%</span>
                      <span className="text-xs font-bold text-emerald-600">Now: {s.progress}%</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
                        +{s.progress - s.prev}%
                      </span>
                    </div>
                  </div>
                  <div className="relative bg-gray-100 rounded-full h-3">
                    <div className="absolute bg-gray-300 h-3 rounded-full" style={{ width: s.prev + '%' }} />
                    <div className="absolute bg-gradient-to-r from-primary to-teal h-3 rounded-full transition-all"
                      style={{ width: s.progress + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
            <h3 className="font-bold text-gray-900 mb-2">🏅 Internship Completion Certificate</h3>
            <p className="text-xs text-gray-500 mb-3">Complete all 6 weeks and get a verified completion certificate added to your portfolio</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: overallProgress + '%' }} />
              </div>
              <span className="text-xs font-bold text-primary">{overallProgress}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{totalWeeks - completedWeeks} weeks remaining to unlock certificate</p>
          </div>
        </div>
      )}

      {/* Weekly Check-in */}
      {activeTab === 'checkin' && (
        <div className="space-y-4">
          {submitted ? (
            <div className="card p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-bold text-gray-900 mb-1">Check-in Submitted!</h3>
              <p className="text-sm text-gray-500">Your week 4 progress has been recorded. Your mentor will review and provide feedback.</p>
              <button onClick={() => {}} className="mt-4 btn-outline text-sm px-6 py-2">View Progress →</button>
            </div>
          ) : (
            <>
              <div className="card p-4 bg-blue-50 border-blue-100">
                <p className="text-xs text-blue-700 font-semibold">✏️ Week 4 Check-in — Submit before end of week</p>
              </div>
              <div className="card p-6 space-y-4">
                <h3 className="font-bold text-gray-900">Weekly Progress Check-in</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">What tasks did you complete this week? *</label>
                  <textarea value={checkIn.tasks} onChange={e => setCheckIn(p => ({ ...p, tasks: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={3}
                    placeholder="e.g. Completed the user authentication module, fixed 3 bugs in the payment flow..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">What challenges did you face?</label>
                  <textarea value={checkIn.challenges} onChange={e => setCheckIn(p => ({ ...p, challenges: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={2}
                    placeholder="e.g. Struggled with async state management in React..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">What did you learn this week?</label>
                  <textarea value={checkIn.learning} onChange={e => setCheckIn(p => ({ ...p, learning: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={2}
                    placeholder="e.g. Learned how to implement JWT authentication, understood CI/CD pipeline..." />
                </div>
                <button onClick={submitCheckIn} disabled={!checkIn.tasks.trim()}
                  className="w-full btn-primary py-3 text-sm disabled:opacity-50">
                  Submit Week 4 Check-in →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}