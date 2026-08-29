const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.get('/dashboard', auth, async (req, res) => {
  try {
    const students = await db.users.find({ role: 'student' })
    const assessments = await db.assessments.find({})
    const avgScore = assessments.length
      ? Math.round(assessments.reduce((a, b) => a + (b.totalScore || 0), 0) / assessments.length)
      : 0
    res.json({
      stats: {
        students: students.length,
        avgScore,
        assessments: assessments.length,
        placements: Math.floor(students.length * 0.68)
      },
      skillTrends: [
        { skill: 'JavaScript', demand: 89, students: 72 },
        { skill: 'Python', demand: 92, students: 55 },
        { skill: 'React', demand: 78, students: 68 },
        { skill: 'ML/AI', demand: 95, students: 40 },
        { skill: 'System Design', demand: 87, students: 50 },
      ],
      students: students.slice(0, 10).map(({ password: _, ...s }) => s)
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
