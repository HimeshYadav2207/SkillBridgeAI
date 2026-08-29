const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.get('/dashboard', auth, async (req, res) => {
  try {
    const jobs = await db.internships.find({ recruiterId: req.user.id })
    const allApps = await db.applications.find({ internshipId: { $in: jobs.map(j => j._id) } })
    const recentApplicants = await db.users.find({ role: 'student' })
    res.json({
      stats: {
        activePosts: jobs.filter(j => j.status === 'active').length,
        applicants: allApps.length,
        shortlisted: allApps.filter(a => a.status === 'shortlisted').length,
        hired: allApps.filter(a => a.status === 'hired').length
      },
      recentApplicants: recentApplicants.slice(0, 3).map(s => ({
        name: s.name, role: 'SWE Intern', match: s.skillScore || 0, status: 'applied'
      })),
      jobs
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/candidates', auth, async (req, res) => {
  try {
    // Get all internships posted by this recruiter
    const myJobs = await db.internships.find({ recruiterId: req.user.id })
    const myJobIds = myJobs.map(j => j._id)

    // Get all applications for those internships
    const applications = await db.applications.find({ internshipId: { $in: myJobIds } })

    // Enrich each application with student profile + job title
    const enriched = await Promise.all(applications.map(async a => {
      const student = await db.users.findOne({ _id: a.studentId })
      const job = myJobs.find(j => j._id === a.internshipId)
      if (!student) return null
      const { password: _, ...safe } = student
      // Get assessment data for skill scores
      const assessment = await db.assessments.findOne({ studentId: a.studentId })
      return {
        applicationId: a._id,
        studentId: a.studentId,
        name: safe.name,
        email: safe.email,
        college: safe.college || 'Not specified',
        skills: safe.skills || [],
        skillScore: safe.skillScore || 0,
        skillScores: assessment?.skillScores || [],
        github: safe.github || '',
        linkedin: safe.linkedin || '',
        bio: safe.bio || '',
        appliedFor: job?.title || a.internshipTitle || 'Position',
        company: job?.company || 'Company',
        status: a.status || 'pending',
        appliedAt: a.appliedAt,
        avatar: safe.name?.[0]?.toUpperCase() || 'S',
      }
    }))

    const candidates = enriched.filter(Boolean).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    res.json({ candidates })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/jobs', auth, async (req, res) => {
  try {
    const job = await db.internships.insert({ ...req.body, recruiterId: req.user.id, company: req.user.company || 'Company', postedAt: new Date(), status: 'active' })
    res.json(job)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/jobs', auth, async (req, res) => {
  try {
    const jobs = await db.internships.find({ recruiterId: req.user.id })
    res.json({ jobs })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.patch('/applications/:id', auth, async (req, res) => {
  try {
    const { status } = req.body
    const app = await db.applications.findOne({ _id: req.params.id })
    await db.applications.update({ _id: req.params.id }, { $set: { status } })

    // Send notification to student when status changes
    const studentId = app && (app.userId || app.studentId)
    if (app && studentId) {
      const job = app.internshipId ? await db.internships.findOne({ _id: app.internshipId }) : null
      const jobTitle = job ? job.title : 'your application'
      const company = job ? (job.company || 'the company') : 'the company'

      const messages = {
        shortlisted: { type: 'success', message: `🎉 You've been shortlisted for "${jobTitle}" at ${company}! Prepare for the next round.` },
        hired:       { type: 'success', message: `🏆 Congratulations! You've been hired for "${jobTitle}" at ${company}. Welcome aboard!` },
        rejected:    { type: 'info',    message: `Your application for "${jobTitle}" at ${company} was not selected this time. Keep applying!` },
        interview:   { type: 'warning', message: `📅 Interview scheduled for "${jobTitle}" at ${company}. Check your email for details.` },
      }

      const notif = messages[status]
      if (notif) {
        await db.notifications.insert({
          userId: studentId,
          type: notif.type,
          message: notif.message,
          read: false,
          createdAt: new Date()
        })
      }
    }

    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
