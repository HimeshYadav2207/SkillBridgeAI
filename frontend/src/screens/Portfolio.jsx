import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// ── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  )
}
const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary'

// ── Add Project Modal ─────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', tech: '', link: '' })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  async function submit() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await onSave({ type: 'project', ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) })
      onClose()
    } finally { setSaving(false) }
  }
  return (
    <Modal title="Add Project" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Project Title *"><input className={inp} value={form.title} onChange={set('title')} placeholder="e.g. E-Commerce App" /></Field>
        <Field label="Description"><textarea className={inp + ' resize-none'} rows={3} value={form.description} onChange={set('description')} placeholder="What did you build? What did you learn?" /></Field>
        <Field label="Technologies (comma separated)"><input className={inp} value={form.tech} onChange={set('tech')} placeholder="React, Node.js, MongoDB" /></Field>
        <Field label="GitHub / Demo Link"><input className={inp} value={form.link} onChange={set('link')} placeholder="https://github.com/..." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          <button onClick={submit} disabled={saving || !form.title.trim()} className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Add Certificate Modal ────────────────────────────────────────────────────
function AddCertModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', issuer: '', date: '', badge: '🏅', link: '' })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  async function submit() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await onSave({ type: 'certificate', ...form })
      onClose()
    } finally { setSaving(false) }
  }
  const badges = ['🏅', '⚛', '🐍', '🗃', '☁', '🔐', '📊', '🤖', '🌐']
  return (
    <Modal title="Add Certificate" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Certificate Name *"><input className={inp} value={form.title} onChange={set('title')} placeholder="e.g. AWS Cloud Practitioner" /></Field>
        <Field label="Issuing Organisation"><input className={inp} value={form.issuer} onChange={set('issuer')} placeholder="e.g. Amazon, Coursera, HackerRank" /></Field>
        <Field label="Date Earned"><input className={inp} type="month" value={form.date} onChange={set('date')} /></Field>
        <Field label="Certificate URL"><input className={inp} value={form.link} onChange={set('link')} placeholder="https://..." /></Field>
        <Field label="Badge Icon">
          <div className="flex gap-2 flex-wrap">
            {badges.map(b => (
              <button key={b} onClick={() => setForm(f => ({ ...f, badge: b }))}
                className={`text-2xl p-1.5 rounded-lg border-2 ${form.badge === b ? 'border-primary bg-blue-50' : 'border-transparent hover:border-gray-200'}`}>{b}</button>
            ))}
          </div>
        </Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          <button onClick={submit} disabled={saving || !form.title.trim()} className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Certificate'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Add Experience Modal ──────────────────────────────────────────────────────
function AddExpModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', company: '', period: '', description: '' })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  async function submit() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await onSave({ type: 'experience', ...form })
      onClose()
    } finally { setSaving(false) }
  }
  return (
    <Modal title="Add Experience" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Role / Position *"><input className={inp} value={form.title} onChange={set('title')} placeholder="e.g. Frontend Intern" /></Field>
        <Field label="Company / Organisation"><input className={inp} value={form.company} onChange={set('company')} placeholder="e.g. TechStartup Pvt Ltd" /></Field>
        <Field label="Period"><input className={inp} value={form.period} onChange={set('period')} placeholder="e.g. Jun–Aug 2024" /></Field>
        <Field label="What did you do?"><textarea className={inp + ' resize-none'} rows={3} value={form.description} onChange={set('description')} placeholder="Describe your responsibilities, what you built, and what you learned." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          <button onClick={submit} disabled={saving || !form.title.trim()} className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Experience'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ icon, label, sub, onAdd }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-sm text-gray-400 mb-5">{sub}</p>
      <button onClick={onAdd} className="btn-primary text-sm px-6 py-2">+ Add Now</button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'project' | 'certificate' | 'experience'
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    axios.get('/api/students/portfolio')
      .then(r => setItems(r.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  async function addItem(data) {
    const r = await axios.post('/api/students/portfolio', data)
    setItems(prev => [...prev, r.data])
  }

  async function removeItem(id) {
    setDeleting(id)
    try {
      await axios.delete(`/api/students/portfolio/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
    } finally { setDeleting(null) }
  }

  const projects = items.filter(i => i.type === 'project')
  const certs = items.filter(i => i.type === 'certificate')
  const exp = items.filter(i => i.type === 'experience')

  const TABS = ['overview', 'projects', 'certificates', 'experience']

  // Profile info
  const profileName = user?.name || 'Student'
  const profileCollege = user?.college || ''
  const profileBio = user?.bio || 'Complete your profile to add a bio.'
  const profileHeadline = user?.headline || (user?.role || 'Student')
  const profileSkillScore = user?.skillScore || 0
  const profileGithub = user?.github || ''
  const profileLinkedin = user?.linkedin || ''

  // Compute profile completion %
  const filled = [user?.name, user?.college, user?.bio, user?.github, user?.linkedin, projects.length > 0, certs.length > 0].filter(Boolean).length
  const completion = Math.round((filled / 7) * 100)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-gray-400">Loading portfolio...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* PROFILE HEADER */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-3xl font-black shrink-0">
            {profileName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">{profileName}</h2>
                <p className="text-gray-500 text-sm">{profileHeadline}{profileCollege ? ` · ${profileCollege}` : ''}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-md">{profileBio}</p>
              </div>
              {profileSkillScore > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-center shrink-0">
                  <div className="text-2xl font-black text-primary">{profileSkillScore}</div>
                  <div className="text-[10px] text-gray-500">Skill Score</div>
                </div>
              )}
            </div>
            {(profileGithub || profileLinkedin) && (
              <div className="flex gap-3 mt-3">
                {profileGithub && <a href={profileGithub.startsWith('http') ? profileGithub : `https://${profileGithub}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">🔗 GitHub</a>}
                {profileLinkedin && <a href={profileLinkedin.startsWith('http') ? profileLinkedin : `https://${profileLinkedin}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">💼 LinkedIn</a>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🗂', label: 'Projects', value: projects.length, desc: 'Public repositories', tab: 'projects' },
            { icon: '🏅', label: 'Certificates', value: certs.length, desc: 'Verified credentials', tab: 'certificates' },
            { icon: '💼', label: 'Experience', value: exp.length, desc: 'Internships & open source', tab: 'experience' },
          ].map(s => (
            <button key={s.label} onClick={() => setActiveTab(s.tab)} className="card p-5 text-center hover:border-primary/30 transition-colors text-left w-full">
              <div className="text-3xl mb-2 text-center">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900 text-center">{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 text-center">{s.label}</div>
              <div className="text-xs text-gray-400 text-center">{s.desc}</div>
            </button>
          ))}
          <div className="card p-5 md:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-900">Profile Completion</span>
              <span className="text-sm font-bold text-primary">{completion}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-primary to-teal h-2.5 rounded-full transition-all" style={{ width: completion + '%' }} />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              <span className={user?.name ? 'text-emerald-600' : 'text-amber-500'}>{user?.name ? '✓' : '⚠'} Name</span>
              <span className={user?.college ? 'text-emerald-600' : 'text-amber-500'}>{user?.college ? '✓' : '⚠'} College</span>
              <span className={user?.bio ? 'text-emerald-600' : 'text-amber-500'}>{user?.bio ? '✓' : '⚠'} Bio</span>
              <span className={user?.github ? 'text-emerald-600' : 'text-amber-500'}>{user?.github ? '✓' : '⚠'} GitHub</span>
              <span className={user?.linkedin ? 'text-emerald-600' : 'text-amber-500'}>{user?.linkedin ? '✓' : '⚠'} LinkedIn</span>
              <span className={projects.length > 0 ? 'text-emerald-600' : 'text-amber-500'}>{projects.length > 0 ? '✓' : '⚠'} Projects</span>
              <span className={certs.length > 0 ? 'text-emerald-600' : 'text-amber-500'}>{certs.length > 0 ? '✓' : '⚠'} Certificates</span>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.length === 0
            ? <EmptyState icon="🗂" label="No projects yet" sub="Showcase your GitHub projects, personal builds, or course projects." onAdd={() => setModal('project')} />
            : <>
              {projects.map(p => (
                <div key={p._id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                      {p.description && <p className="text-sm text-gray-500 mt-1">{p.description}</p>}
                      {p.tech?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tech.map(t => <span key={t} className="badge bg-gray-50 text-gray-600 text-[10px]">{t}</span>)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(p._id)} disabled={deleting === p._id}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0" title="Remove">
                      {deleting === p._id ? '...' : '×'}
                    </button>
                  </div>
                  {p.link && (
                    <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer"
                      className="inline-block mt-3 btn-outline text-xs px-3 py-1.5">🔗 View Code</a>
                  )}
                </div>
              ))}
              <button onClick={() => setModal('project')} className="w-full card p-4 text-center text-primary font-semibold text-sm hover:bg-blue-50 transition-colors">
                + Add New Project
              </button>
            </>
          }
        </div>
      )}

      {/* CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-3">
          {certs.length === 0
            ? <EmptyState icon="🏅" label="No certificates yet" sub="Add certifications from Coursera, HackerRank, AWS, Google, and more." onAdd={() => setModal('certificate')} />
            : <>
              {certs.map(c => (
                <div key={c._id} className="card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">{c.badge}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                    <p className="text-xs text-gray-500">{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.link && (
                      <a href={c.link.startsWith('http') ? c.link : `https://${c.link}`} target="_blank" rel="noreferrer"
                        className="text-xs text-primary hover:underline">View</a>
                    )}
                    <span className="badge bg-emerald-50 text-emerald-600 text-[10px]">Verified</span>
                    <button onClick={() => removeItem(c._id)} disabled={deleting === c._id}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none ml-1" title="Remove">
                      {deleting === c._id ? '...' : '×'}
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setModal('certificate')} className="w-full card p-4 text-center text-primary font-semibold text-sm hover:bg-blue-50 transition-colors">
                + Add Certificate
              </button>
            </>
          }
        </div>
      )}

      {/* EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {exp.length === 0
            ? <EmptyState icon="💼" label="No experience yet" sub="Add internships, part-time roles, or open source contributions." onAdd={() => setModal('experience')} />
            : <>
              {exp.map(e => (
                <div key={e._id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-base shrink-0">💼</div>
                        <div>
                          <h3 className="font-bold text-gray-900">{e.title}</h3>
                          <p className="text-xs text-gray-500">{e.company}{e.period ? ` · ${e.period}` : ''}</p>
                        </div>
                      </div>
                      {e.description && <p className="text-sm text-gray-600 mt-2 ml-10">{e.description}</p>}
                    </div>
                    <button onClick={() => removeItem(e._id)} disabled={deleting === e._id}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0" title="Remove">
                      {deleting === e._id ? '...' : '×'}
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setModal('experience')} className="w-full card p-4 text-center text-primary font-semibold text-sm hover:bg-blue-50 transition-colors">
                + Add Experience
              </button>
            </>
          }
        </div>
      )}

      {/* MODALS */}
      {modal === 'project' && <AddProjectModal onClose={() => setModal(null)} onSave={addItem} />}
      {modal === 'certificate' && <AddCertModal onClose={() => setModal(null)} onSave={addItem} />}
      {modal === 'experience' && <AddExpModal onClose={() => setModal(null)} onSave={addItem} />}
    </div>
  )
}
