const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')
const https = require('https')

// AI Career Assistant powered by Groq
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return res.json({
        reply: getFallbackReply(message),
        source: 'demo'
      })
    }

    // Get user context for personalized responses
    const user = await db.users.findOne({ _id: req.user.id })
    const assessment = await db.assessments.findOne({ studentId: req.user.id })
    const applications = await db.applications.find({ studentId: req.user.id })

    const skillInfo = assessment?.skillScores
      ? `Student's skills: ${assessment.skillScores.map(s => `${s.skill}: ${s.score}%`).join(', ')}`
      : `No assessment done yet.`

    const appInfo = applications.length > 0
      ? `Applied to ${applications.length} positions. Statuses: ${[...new Set(applications.map(a => a.status))].join(', ')}.`
      : 'No applications yet.'

    const systemPrompt = `You are SkillBridge AI — a smart, friendly career assistant helping Indian engineering students land internships and jobs.
You give concise, practical, actionable career advice in a warm and encouraging tone.
Current student profile:
- Name: ${user?.name || 'Student'}
- College: ${user?.college || 'Engineering college'}
- ${skillInfo}
- ${appInfo}
Keep responses under 150 words. Be specific, practical, and motivating. Use simple language.`

    const body = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    }

    const apiReq = https.request(options, (apiRes) => {
      let data = ''
      apiRes.on('data', chunk => data += chunk)
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          const reply = parsed.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Try again!'
          res.json({ reply, source: 'groq' })
        } catch {
          res.json({ reply: getFallbackReply(message), source: 'demo' })
        }
      })
    })
    apiReq.on('error', () => res.json({ reply: getFallbackReply(message), source: 'demo' }))
    apiReq.write(body)
    apiReq.end()

  } catch (e) { res.status(500).json({ error: e.message }) }
})

function getFallbackReply(message) {
  const msg = message.toLowerCase()
  if (msg.includes('resume') || msg.includes('cv')) {
    return '📄 For a strong resume: Keep it to 1 page, lead with a summary of your top skills, list projects with GitHub links, and quantify achievements (e.g., "Improved performance by 30%"). Tailor it for each company you apply to!'
  }
  if (msg.includes('interview')) {
    return '🎯 Interview tips: Practice DSA on LeetCode daily (start with easy/medium), study system design basics, prepare STAR-format behavioral answers, and research the company thoroughly. Mock interviews on Pramp or with friends help a lot!'
  }
  if (msg.includes('skill') || msg.includes('learn')) {
    return '🚀 Top skills for 2024: React + Node.js for web dev, Python + PyTorch for ML/AI, and SQL + cloud (AWS/GCP) for data. Build 2-3 solid projects and put them on GitHub — that\'s what recruiters look at!'
  }
  if (msg.includes('apply') || msg.includes('job') || msg.includes('internship')) {
    return '💼 Applying smart: Target 5-10 quality applications over mass-applying. Customize your cover letter, highlight relevant projects, and follow up after 5-7 days. LinkedIn and AngelList are great for startups; campus placements for product companies!'
  }
  if (msg.includes('salary') || msg.includes('stipend')) {
    return '💰 Current stipend ranges in India: Top product companies (Google, Microsoft, Amazon) pay ₹70k-₹1L/month. Good startups: ₹30k-₹60k. Service companies: ₹15k-₹30k. Always negotiate — it\'s expected!'
  }
  return '🤖 I\'m your AI career assistant! Ask me about: resume tips, interview prep, skill roadmaps, how to find internships, salary expectations, or how to improve your application. Add your GROQ_API_KEY to backend/.env for full AI-powered responses!'
}

module.exports = router
