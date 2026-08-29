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
    if (role === 'recruiter' && !gstin) return res.status(400).json({ error: 'GSTIN is required for recruiter accounts' })
    const existing = await db.users.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const recruiterVerified = false // admin must approve
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
    const { name, bio, college, github, linkedin, headline } = req.body
    const updates = {}
    if (name && name.trim()) updates.name = name.trim()
    if (bio !== undefined) updates.bio = bio
    if (college !== undefined) updates.college = college
    if (github !== undefined) updates.github = github
    if (linkedin !== undefined) updates.linkedin = linkedin
    if (headline !== undefined) updates.headline = headline
    await db.users.update({ _id: req.user.id }, { $set: updates })
    const user = await db.users.findOne({ _id: req.user.id })
    const { password: _, ...safe } = user
    res.json({ user: safe })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
