const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')
const https = require('https')

// Get student dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    const applications = await db.applications.find({ studentId: req.user.id })
    const assessment = await db.assessments.findOne({ studentId: req.user.id })
    const interviews = applications.filter(a => a.status === 'interview').length

    const recentActivity = []
    if (applications.length > 0) {
      const sorted = [...applications].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      sorted.slice(0, 2).forEach(a => {
        recentActivity.push({ type: 'application', text: `Applied to an internship`, time: timeAgo(a.appliedAt) })
      })
    }
    if (assessment) {
      recentActivity.push({ type: 'assessment', text: 'Completed Skill Assessment', time: timeAgo(assessment.completedAt) })
    }

    res.json({
      profile: { name: user.name, college: user.college, skillScore: user.skillScore || 0, role: user.role },
      stats: {
        applications: applications.length,
        skillScore: user.skillScore || 0,
        profileViews: user.profileViews || 0,
        interviews
      },
      assessment: assessment ? {
        done: true,
        skillScores: assessment.skillScores || [],
        totalScore: assessment.totalScore
      } : { done: false },
      recentActivity
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// Get internships
router.get('/internships', auth, async (req, res) => {
  try {
    const internships = await db.internships.find({ status: 'active' })
    res.json({ internships })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Jobs feed — uses Groq-recommended demo data
router.get('/jobs-feed', auth, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    const userSkills = (user.skills || []).join(' ') || 'software engineer'
    const keyword = req.query.q || userSkills || 'software developer'

    return res.json({
      jobs: getFallbackJobs(keyword),
      source: 'demo',
      message: 'Showing curated job listings.'
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

function getFallbackJobs(keyword) {
  const all = [
    { _id: 'f1', title: 'Software Engineer', company: 'Google', location: 'Bangalore', compensation: '₹28–45 LPA', duration: 'Permanent', skills: ['DSA', 'System Design', 'Python'], match: 94, logo: '🌐', type: 'Full-time', category: 'job' },
    { _id: 'f2', title: 'Frontend Developer', company: 'Flipkart', location: 'Bangalore', compensation: '₹18–28 LPA', duration: 'Permanent', skills: ['React', 'TypeScript', 'CSS'], match: 88, logo: '🛒', type: 'Remote', category: 'job' },
    { _id: 'f3', title: 'ML Engineer', company: 'Microsoft', location: 'Hyderabad', compensation: '₹24–36 LPA', duration: 'Permanent', skills: ['Python', 'PyTorch', 'MLOps'], match: 82, logo: '💻', type: 'Hybrid', category: 'job' },
    { _id: 'f4', title: 'Backend Engineer', company: 'Amazon', location: 'Chennai', compensation: '₹22–32 LPA', duration: 'Permanent', skills: ['Java', 'AWS', 'Microservices'], match: 78, logo: '📦', type: 'Full-time', category: 'job' },
    { _id: 'f5', title: 'Data Scientist', company: 'Walmart Labs', location: 'Bangalore', compensation: '₹20–30 LPA', duration: 'Permanent', skills: ['Python', 'ML', 'SQL'], match: 75, logo: '🏪', type: 'Hybrid', category: 'job' },
    { _id: 'f6', title: 'DevOps Engineer', company: 'PhonePe', location: 'Bangalore', compensation: '₹18–25 LPA', duration: 'Permanent', skills: ['AWS', 'Docker', 'CI/CD'], match: 72, logo: '💳', type: 'Full-time', category: 'job' },
    { _id: 'f7', title: 'Software Engineer Intern', company: 'Google', location: 'Bangalore', compensation: 'Stipend: ₹80,000/mo', duration: '3 months', skills: ['Python', 'Algorithms'], match: 91, logo: '🌐', type: 'Remote', category: 'internship' },
    { _id: 'f8', title: 'ML Research Intern', company: 'Microsoft', location: 'Hyderabad', compensation: 'Stipend: ₹70,000/mo', duration: '3 months', skills: ['Python', 'NLP', 'PyTorch'], match: 85, logo: '💻', type: 'Hybrid', category: 'internship' },
    { _id: 'f9', title: 'Frontend Intern', company: 'Swiggy', location: 'Bangalore', compensation: 'Stipend: ₹45,000/mo', duration: '3 months', skills: ['React', 'JavaScript'], match: 80, logo: '🍔', type: 'Remote', category: 'internship' },
    { _id: 'f10', title: 'Backend Intern', company: 'Razorpay', location: 'Bangalore', compensation: 'Stipend: ₹50,000/mo', duration: '4 months', skills: ['Node.js', 'AWS', 'SQL'], match: 76, logo: '💳', type: 'Full-time', category: 'internship' },
    { _id: 'f11', title: 'Cybersecurity Analyst', company: 'TCS', location: 'Pune', compensation: '₹12–18 LPA', duration: 'Permanent', skills: ['Security', 'Networking', 'Linux'], match: 68, logo: '🔐', type: 'Full-time', category: 'job' },
    { _id: 'f12', title: 'Full Stack Developer', company: 'Freshworks', location: 'Chennai', compensation: '₹15–22 LPA', duration: 'Permanent', skills: ['React', 'Node.js', 'PostgreSQL'], match: 85, logo: '🌿', type: 'Hybrid', category: 'job' },
    { _id: 'f13', title: 'AI/ML Intern', company: 'ISRO', location: 'Ahmedabad', compensation: 'Unpaid', duration: '2 months', skills: ['Python', 'TensorFlow'], match: 60, logo: '🚀', type: 'Full-time', category: 'internship' },
    { _id: 'f14', title: 'Android Developer', company: 'CRED', location: 'Bangalore', compensation: '₹16–24 LPA', duration: 'Permanent', skills: ['Kotlin', 'Android', 'Firebase'], match: 74, logo: '📱', type: 'Full-time', category: 'job' },
    { _id: 'f15', title: 'UI/UX Designer', company: 'Zomato', location: 'Gurugram', compensation: '₹12–18 LPA', duration: 'Permanent', skills: ['Figma', 'Adobe XD', 'Prototyping'], match: 70, logo: '🎨', type: 'Hybrid', category: 'job' },
  ]
  return all
}

// Apply for internship
router.post('/apply/:id', auth, async (req, res) => {
  try {
    const internship = await db.internships.findOne({ _id: req.params.id })
    if (!internship) return res.status(404).json({ error: 'Internship not found' })
    const existing = await db.applications.findOne({ studentId: req.user.id, internshipId: req.params.id })
    if (existing) return res.status(409).json({ error: 'Already applied' })
    const app = await db.applications.insert({
      studentId: req.user.id,
      internshipId: req.params.id,
      internshipTitle: internship.title,
      company: internship.company,
      status: 'pending',
      appliedAt: new Date()
    })
    res.json(app)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Save skill assessment results
router.post('/assessment', auth, async (req, res) => {
  try {
    const { score, skills } = req.body

    await db.users.update({ _id: req.user.id }, { $set: { skillScore: score } })
    await db.assessments.remove({ studentId: req.user.id }, { multi: true })
    const result = await db.assessments.insert({
      studentId: req.user.id,
      skillScores: skills,
      totalScore: score,
      completedAt: new Date()
    })

    let notifMessage = ''
    let notifType = 'info'
    let videos = []

    if (score < 40) {
      notifType = 'error'

      const weakSkills = (skills || [])
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)
        .map(s => s.skill)

      videos = await getGroqVideoRecs(weakSkills)

      notifMessage = `yt — Score: ${score}%. Weak areas: ${weakSkills.join(', ')}. Watch the recommended tutorials below to improve.`

    } else if (score < 70) {
      notifType = 'warning'
      notifMessage = `📊 Moderate score (${score}%). Keep practising — you're getting there!`
    } else {
      notifType = 'success'
      notifMessage = `🏆 Awesome score (${score}%)! You're among the top candidates. Internship matches unlocked!`
    }

    await db.notifications.insert({
      userId: req.user.id,
      type: notifType,
      message: notifMessage,
      videos,
      read: false,
      createdAt: new Date()
    })

    res.json(result)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Groq generates YouTube tutorial recommendations for weak skills
async function getGroqVideoRecs(weakSkills) {
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey || !weakSkills.length) return []

  const prompt = `A student scored poorly in these skills: ${weakSkills.join(', ')}.
Recommend 1 YouTube tutorial per skill to help them improve. Return ONLY a JSON array, no explanation:
[{ "skill": "skill name", "title": "exact video title", "url": "https://www.youtube.com/results?search_query=..." }]
Make the search_query specific and useful.`

  try {
    const body = JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 400
    })

    const raw = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
          'Content-Length': Buffer.byteLength(body)
        }
      }, (r) => {
        let d = ''
        r.on('data', c => d += c)
        r.on('end', () => resolve(d))
      })
      req.on('error', reject)
      req.write(body)
      req.end()
    })

    const parsed = JSON.parse(raw)
    const content = parsed.choices?.[0]?.message?.content || ''
    const match = content.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    return weakSkills.map(skill => ({
      skill,
      title: `${skill} Tutorial for Beginners`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial for beginners')}`
    }))
  }
}

// Get mentors
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await db.mentors.find({})
    res.json({ mentors })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── PORTFOLIO ──────────────────────────────────────────────────────────────
router.get('/portfolio', auth, async (req, res) => {
  try {
    const items = await db.portfolio.find({ studentId: req.user.id })
    res.json({ items })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/portfolio', auth, async (req, res) => {
  try {
    const { type, title, description, tech, link, issuer, date, badge, company, period } = req.body
    if (!type || !title) return res.status(400).json({ error: 'type and title required' })
    const item = await db.portfolio.insert({
      studentId: req.user.id, type, title,
      description: description || '', tech: tech || [],
      link: link || '', issuer: issuer || '', date: date || '',
      badge: badge || '🏅', company: company || '', period: period || '',
      createdAt: new Date()
    })
    res.json(item)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/portfolio/:id', auth, async (req, res) => {
  try {
    await db.portfolio.remove({ _id: req.params.id, studentId: req.user.id }, {})
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── MY APPLICATIONS ───────────────────────────────────────────────────────
router.get('/my-applications', auth, async (req, res) => {
  try {
    const apps = await db.applications.find({ studentId: req.user.id })
    const sorted = apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    const enriched = await Promise.all(sorted.map(async a => {
      let internshipDetails = null
      if (a.internshipId) {
        internshipDetails = await db.internships.findOne({ _id: a.internshipId })
      }
      return {
        _id: a._id,
        internshipId: a.internshipId,
        title: internshipDetails?.title || a.internshipTitle || 'Position',
        company: internshipDetails?.company || a.company || 'Company',
        location: internshipDetails?.location || '',
        stipend: internshipDetails?.stipend || '',
        logo: internshipDetails?.logo || '💼',
        type: internshipDetails?.type || '',
        status: a.status || 'pending',
        appliedAt: a.appliedAt,
      }
    }))
    res.json({ applications: enriched })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── NOTIFICATIONS ──────────────────────────────────────────────────────────
router.get('/notifications', auth, async (req, res) => {
  try {
    const all = await db.notifications.find({ userId: req.user.id })
    const notifications = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ notifications })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/notifications/mark-read', auth, async (req, res) => {
  try {
    await db.notifications.update({ userId: req.user.id }, { $set: { read: true } }, { multi: true })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router