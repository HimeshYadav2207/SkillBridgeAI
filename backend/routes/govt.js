const router = require('express').Router()
const db = require('../db')

// Public route — no auth required
router.get('/dashboard', async (req, res) => {
  try {
    const students = await db.users.find({ role: 'student' })
    const institutions = await db.users.find({ role: 'institution' })
    res.json({
      kpis: { students: 482391, institutions: 1247, industryPartners: 3618, placed: 109204 },
      skillGaps: [
        { skill: 'Cloud Computing', demand: 91, supply: 38 },
        { skill: 'AI/ML', demand: 88, supply: 31 },
        { skill: 'Cybersecurity', demand: 84, supply: 29 },
        { skill: 'Data Analytics', demand: 79, supply: 45 },
        { skill: 'Full Stack', demand: 76, supply: 54 },
        { skill: 'DevOps', demand: 72, supply: 33 },
        { skill: 'UI/UX', demand: 65, supply: 48 },
        { skill: 'Embedded Systems', demand: 62, supply: 41 },
      ],
      districts: [
        { name: 'Mumbai', students: 84291, placed: 71648, rate: 85 },
        { name: 'Pune', students: 62847, placed: 51534, rate: 82 },
        { name: 'Nagpur', students: 38291, placed: 28718, rate: 75 },
        { name: 'Nashik', students: 29847, placed: 20892, rate: 70 },
        { name: 'Aurangabad', students: 24103, placed: 15667, rate: 65 },
        { name: 'Kolhapur', students: 19847, placed: 11908, rate: 60 },
        { name: 'Solapur', students: 17291, placed: 9510, rate: 55 },
        { name: 'Amravati', students: 14829, placed: 7414, rate: 50 },
      ],
      alerts: [
        { type: 'critical', message: 'Cybersecurity skill gap widening — 55 point deficit', time: '2h ago' },
        { type: 'warning', message: 'AI/ML courses need curriculum update', time: '1d ago' },
        { type: 'info', message: 'NEP 2020 compliance report due next month', time: '3d ago' },
      ]
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
