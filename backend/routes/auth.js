const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

function sign(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email, avatar: user.name?.[0]?.toUpperCase() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, college, company, gstin, companyReg } = req.body
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' })
    //if (role === 'recruiter' && !gstin) return res.status(400).json({ error: 'GSTIN is required for recruiter accounts' })
    const existing = await db.users.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const recruiterVerified = true // admin must approve
    const user = await db.users.insert({ name, email, password: hash, role, college: college || '', company: company || '', gstin: gstin || '', companyReg: companyReg || '', recruiterVerified, createdAt: new Date(), skillScore: 0, verified: false })
    res.json({ token: sign(user), user: { id: user._id, name, email, role, college, company } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await db.users.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email, role: user.role, college: user.college, company: user.company } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    if (!user) return res.status(404).json({ error: 'Not found' })
    const { password: _, ...safe } = user
    res.json(safe)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Update profile
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, bio, college, github, linkedin, headline, interests } = req.body
    const updates = {}
    if (name && name.trim()) updates.name = name.trim()
    if (bio !== undefined) updates.bio = bio
    if (college !== undefined) updates.college = college
    if (github !== undefined) updates.github = github
    if (linkedin !== undefined) updates.linkedin = linkedin
    if (interests !== undefined) updates.interests = interests
    await db.users.update({ _id: req.user.id }, { $set: updates })
    const user = await db.users.findOne({ _id: req.user.id })
    const { password: _, ...safe } = user
    res.json({ user: safe })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
// In-memory OTP store (resets on server restart — fine for demo)
const otpStore = {}

// Forgot Password — generate OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })
    const user = await db.users.findOne({ email })
    if (!user) return res.status(404).json({ error: 'No account found with this email' })
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore[email] = { otp, expiry: Date.now() + 10 * 60 * 1000 }
    // In production this would be emailed — returning for demo
    res.json({ message: 'OTP generated successfully', otp, email })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const record = otpStore[email]
    if (!record) return res.status(400).json({ error: 'OTP not found. Please request again.' })
    if (Date.now() > record.expiry) {
      delete otpStore[email]
      return res.status(400).json({ error: 'OTP expired. Please request again.' })
    }
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })
    res.json({ message: 'OTP verified', verified: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const record = otpStore[email]
    if (!record || record.otp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP' })
    const hash = await bcrypt.hash(newPassword, 10)
    await db.users.update({ email }, { $set: { password: hash } })
    delete otpStore[email]
    res.json({ message: 'Password reset successfully' })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
module.exports = router
