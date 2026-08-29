import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'student', label: '🎓 Student', desc: 'Find internships & mentors' },
  { value: 'recruiter', label: '🏢 Recruiter', desc: 'Hire top talent' },
  { value: 'faculty', label: '👨‍🏫 Faculty', desc: 'Guide students' },
  { value: 'institution', label: '🎪 Institution', desc: 'Manage placements' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', college: '', company: '', gstin: '', companyReg: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const user = await register(form)
      if (user.role === 'recruiter') navigate('/recruiter')
      else if (user.role === 'faculty') navigate('/faculty')
      else if (user.role === 'institution') navigate('/institution')
      else navigate('/dashboard')
    } catch (err) { setError(err.response?.data?.error || 'Registration failed') }
    finally { setLoading(false) }
  }

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">SB</div>
            <span className="font-black text-gray-900 text-2xl">SkillBridge</span>
          </Link>
          <p className="text-gray-500 text-sm">Create your free account</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-2 font-medium">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button type="button" key={r.value} onClick={() => setForm(p => ({ ...p, role: r.value }))}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${form.role === r.value ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'}`}>
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {[{ k: 'name', label: 'Full Name', ph: 'e.g. Ravi Pandey', type: 'text' },
              { k: 'email', label: 'Email', ph: 'you@example.com', type: 'email' },
              { k: 'password', label: 'Password', ph: 'Min 6 characters', type: 'password' }
            ].map(({ k, label, ph, type }) => (
              <div key={k}>
                <label className="text-xs text-gray-500 block mb-1.5 font-medium">{label}</label>
                <input type={type} required value={form[k]} onChange={f(k)} placeholder={ph} className="input" />
              </div>
            ))}

            {(form.role === 'student' || form.role === 'faculty' || form.role === 'institution') && (
              <div>
                <label className="text-xs text-gray-500 block mb-1.5 font-medium">College / University</label>
                <input value={form.college} onChange={f('college')} placeholder="e.g. IIT Bombay • B.Tech CSE" className="input" />
              </div>
            )}
            {form.role === 'recruiter' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5 font-medium">Company Name</label>
                  <input value={form.company} onChange={f('company')} placeholder="e.g. Google India" className="input" required />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5 font-medium">GSTIN Number <span className="text-red-400">*</span></label>
                  <input value={form.gstin} onChange={f('gstin')} placeholder="e.g. 27AAPFU0939F1ZV" className="input" maxLength={15} style={{textTransform:'uppercase'}} />
                  <p className="text-[10px] text-gray-400 mt-1">15-digit GST Identification Number for company verification</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5 font-medium">Company Registration No. <span className="text-gray-400">(optional)</span></label>
                  <input value={form.companyReg} onChange={f('companyReg')} placeholder="e.g. U72200MH2004PTC144786 or CIN" className="input" />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                  ⚠️ Your account will be reviewed within 24 hours after GSTIN verification. You can post jobs after approval.
                </div>
              </div>
            )}

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600">{error}</div>}

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
