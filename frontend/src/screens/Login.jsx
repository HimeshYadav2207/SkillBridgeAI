import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ParticleBackground from '../components/ParticleBackground'

function redirect(role, navigate) {
  if (role === 'recruiter') navigate('/recruiter')
  else if (role === 'faculty') navigate('/faculty')
  else if (role === 'institution') navigate('/institution')
  else navigate('/dashboard')
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)', color: '#f1f5f9',
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const labelStyle = {
  fontSize: 11, color: 'rgba(148,163,184,1)', display: 'block',
  marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
}
const btnStyle = (disabled) => ({
  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
  background: disabled ? 'rgba(100,116,139,0.3)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  color: disabled ? '#64748b' : '#fff', fontWeight: 800, fontSize: 14,
  cursor: disabled ? 'not-allowed' : 'pointer',
  boxShadow: disabled ? 'none' : '0 0 20px rgba(59,130,246,0.4)', transition: 'all 0.2s',
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Login state
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot password state
  const [phase, setPhase] = useState('login') // login | forgot | otp | reset
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpOtpReceived, setFpOtpReceived] = useState('') // shown on screen for demo
  const [fpNewPass, setFpNewPass] = useState('')
  const [fpConfirmPass, setFpConfirmPass] = useState('')
  const [fpError, setFpError] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [fpSuccess, setFpSuccess] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      redirect(user.role, navigate)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setFpError(''); setFpLoading(true)
    try {
      const r = await axios.post('/api/auth/forgot-password', { email: fpEmail })
      setFpOtpReceived(r.data.otp) // show OTP on screen for demo
      setPhase('otp')
    } catch (err) {
      setFpError(err.response?.data?.error || 'Email not found')
    } finally { setFpLoading(false) }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setFpError(''); setFpLoading(true)
    try {
      await axios.post('/api/auth/verify-otp', { email: fpEmail, otp: fpOtp })
      setPhase('reset')
    } catch (err) {
      setFpError(err.response?.data?.error || 'Invalid OTP')
    } finally { setFpLoading(false) }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (fpNewPass !== fpConfirmPass) { setFpError('Passwords do not match'); return }
    if (fpNewPass.length < 6) { setFpError('Password must be at least 6 characters'); return }
    setFpError(''); setFpLoading(true)
    try {
      await axios.post('/api/auth/reset-password', { email: fpEmail, otp: fpOtp, newPassword: fpNewPass })
      setFpSuccess(true)
      setTimeout(() => { setPhase('login'); setFpSuccess(false); setFpEmail(''); setFpOtp(''); setFpNewPass(''); setFpConfirmPass('') }, 2000)
    } catch (err) {
      setFpError(err.response?.data?.error || 'Reset failed')
    } finally { setFpLoading(false) }
  }

  const bgStyle = {
    minHeight: '100vh', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  }

  return (
    <div style={bgStyle}>
      <ParticleBackground count={80} dark />
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 24px rgba(59,130,246,0.5)' }}>SB</div>
            <span style={{ fontWeight: 900, color: '#fff', fontSize: 26, letterSpacing: -1 }}>SkillBridge</span>
          </Link>
          <p style={{ color: 'rgba(148,163,184,1)', fontSize: 13 }}>
            {phase === 'login' ? 'Sign in to your account' :
             phase === 'forgot' ? 'Reset your password' :
             phase === 'otp' ? 'Enter verification code' :
             'Set new password'}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px' }}>

          {/* ── LOGIN PHASE ── */}
          {phase === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <button type="button" onClick={() => { setPhase('forgot'); setFpError('') }}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  Forgot Password?
                </button>
              </div>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#fca5a5', marginBottom: 16 }}>{error}</div>
              )}
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(100,116,139,1)', marginTop: 20 }}>
                No account?{' '}
                <Link to="/register" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
              </p>
            </form>
          )}

          {/* ── FORGOT PHASE ── */}
          {phase === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ color: 'rgba(148,163,184,1)', fontSize: 13, marginBottom: 20 }}>
                Enter your registered email and we'll send you a verification code.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Registered Email</label>
                <input type="email" required value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
              {fpError && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#fca5a5', marginBottom: 16 }}>{fpError}</div>
              )}
              <button type="submit" disabled={fpLoading} style={btnStyle(fpLoading)}>
                {fpLoading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" onClick={() => setPhase('login')}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ── OTP PHASE ── */}
          {phase === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ color: 'rgba(148,163,184,1)', fontSize: 13, marginBottom: 16 }}>
                Enter the 6-digit OTP sent to <strong style={{ color: '#60a5fa' }}>{fpEmail}</strong>
              </p>

              {/* Demo OTP display */}
              {fpOtpReceived && (
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
                  <p style={{ color: 'rgba(148,163,184,1)', fontSize: 11, marginBottom: 4 }}>🔐 Demo Mode — Your OTP is:</p>
                  <p style={{ color: '#6ee7b7', fontSize: 28, fontWeight: 900, letterSpacing: 8 }}>{fpOtpReceived}</p>
                  <p style={{ color: 'rgba(100,116,139,1)', fontSize: 10, marginTop: 4 }}>Valid for 10 minutes</p>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Enter OTP</label>
                <input type="text" required value={fpOtp} onChange={e => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••" maxLength={6} style={{ ...inputStyle, textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: 900 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
              {fpError && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#fca5a5', marginBottom: 16 }}>{fpError}</div>
              )}
              <button type="submit" disabled={fpLoading || fpOtp.length !== 6} style={btnStyle(fpLoading || fpOtp.length !== 6)}>
                {fpLoading ? 'Verifying...' : 'Verify OTP →'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" onClick={() => { setPhase('forgot'); setFpOtp(''); setFpOtpReceived('') }}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ← Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ── RESET PHASE ── */}
          {phase === 'reset' && (
            <form onSubmit={handleReset}>
              {fpSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <p style={{ color: '#6ee7b7', fontWeight: 700, fontSize: 16 }}>Password Reset Successfully!</p>
                  <p style={{ color: 'rgba(148,163,184,1)', fontSize: 13, marginTop: 8 }}>Redirecting to login...</p>
                </div>
              ) : (
                <>
                  <p style={{ color: 'rgba(148,163,184,1)', fontSize: 13, marginBottom: 20 }}>
                    Set a new password for <strong style={{ color: '#60a5fa' }}>{fpEmail}</strong>
                  </p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" required value={fpNewPass} onChange={e => setFpNewPass(e.target.value)}
                      placeholder="Min 6 characters" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" required value={fpConfirmPass} onChange={e => setFpConfirmPass(e.target.value)}
                      placeholder="Re-enter new password" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  {fpError && (
                    <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#fca5a5', marginBottom: 16 }}>{fpError}</div>
                  )}
                  <button type="submit" disabled={fpLoading} style={btnStyle(fpLoading)}>
                    {fpLoading ? 'Resetting...' : 'Reset Password →'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}