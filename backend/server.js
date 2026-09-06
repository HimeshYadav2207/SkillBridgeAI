require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const seed = require('./seed')

// Ensure the data directory exists before NeDB tries to use it
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const app = express()

app.use(cors({
  origin: ['https://skill-bridge-ai-mu.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/students', require('./routes/students'))
app.use('/api/recruiters', require('./routes/recruiters'))
app.use('/api/faculty', require('./routes/faculty'))
app.use('/api/govt', require('./routes/govt'))
app.use('/api/institution', require('./routes/institution'))
app.use('/api/ai', require('./routes/ai'))

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '2.0.0', timestamp: new Date() }))

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`🚀 SkillBridge API running on http://localhost:${PORT}`)
  await seed()
})
