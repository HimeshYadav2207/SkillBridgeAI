// Run this to clear all data and re-seed fresh demo data
// Usage: node reset-seed.js
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, 'data')
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.db'))
for (const f of files) {
  fs.unlinkSync(path.join(dataDir, f))
  console.log('Deleted', f)
}
console.log('All DB files cleared.')
console.log('Restart backend (npm run dev) to re-seed fresh demo data automatically.')
