import { useState, useEffect } from 'react'
import axios from 'axios'

const DEMO = [
  { _id: '1', name: 'Priya Sharma', title: 'Senior SDE at Google', expertise: ['System Design', 'DSA', 'JavaScript'], rating: 4.9, sessions: 148, availability: 'Weekends', avatar: '👩‍💻', bio: '8 years at Google India. Mentored 200+ students into top tech companies. Specializes in cracking FAANG interviews.' },
  { _id: '2', name: 'Arjun Mehta', title: 'ML Engineer at Microsoft', expertise: ['Machine Learning', 'Python', 'NLP'], rating: 4.8, sessions: 92, availability: 'Evenings', avatar: '👨‍🔬', bio: 'Published 3 papers in NLP. Loves helping students break into AI/ML roles. IIT Bombay alumnus.' },
  { _id: '3', name: 'Kavitha Nair', title: 'Product Manager at Flipkart', expertise: ['Product Strategy', 'UX', 'Analytics'], rating: 4.7, sessions: 65, availability: 'Flexible', avatar: '👩‍💼', bio: 'Transitioned from engineering to PM. Helps techies understand product thinking and career switching.' },
  { _id: '4', name: 'Rahul Gupta', title: 'Co-founder at Startup', expertise: ['Entrepreneurship', 'React', 'Node.js'], rating: 4.9, sessions: 201, availability: 'Weekends', avatar: '🧑‍🚀', bio: 'Built and sold 2 startups. Coaches on full-stack development and product-market fit for student founders.' },
  { _id: '5', name: 'Sneha Patel', title: 'Data Scientist at Amazon', expertise: ['Data Science', 'SQL', 'Tableau'], rating: 4.6, sessions: 78, availability: 'Evenings', avatar: '👩‍📊', bio: 'Worked across India, UK, and Singapore. Expert at data storytelling and analytics career paths.' },
  { _id: '6', name: 'Vikram Singh', title: 'DevOps Lead at Infosys', expertise: ['Docker', 'Kubernetes', 'CI/CD'], rating: 4.7, sessions: 54, availability: 'Weekdays', avatar: '👨‍🔧', bio: 'Certified Kubernetes admin. Passionate about modern DevOps culture and helping freshers understand deployment pipelines.' },
]

const EXPERTISE_TAGS = ['All', 'DSA', 'System Design', 'Machine Learning', 'React', 'Python', 'Product', 'Data Science', 'DevOps']

export default function Mentors() {
  const [mentors, setMentors] = useState(DEMO)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [booked, setBooked] = useState(new Set())
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    axios.get('/api/students/mentors').then(r => {
      if (r.data?.mentors?.length) setMentors(r.data.mentors)
    }).catch(() => {})
  }, [])

  async function bookSession(id) {
    setBooking(id)
    await new Promise(r => setTimeout(r, 800))
    setBooked(prev => new Set([...prev, id]))
    setBooking(null)
  }

  const filtered = mentors.filter(m => {
    const tags = m.expertise || m.skills || []
    const titleStr = m.title || m.role || ''
    const matchTag = filter === 'All' || tags.some(e => e.includes(filter))
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || titleStr.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-gray-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or title..." className="bg-transparent flex-1 text-sm outline-none" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {EXPERTISE_TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filter === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} mentors available</p>

      {/* MENTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m._id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl shrink-0">
                {m.avatar?.length > 1 ? m.avatar : <span className="text-xl font-bold text-indigo-700">{m.avatar || m.name?.[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{m.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{m.title || m.role}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">⭐ <span className="font-bold text-gray-800">{m.rating}</span></span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">{m.sessions} sessions</span>
                  {m.availability && <><span className="text-gray-300">|</span><span className="text-gray-500">🕐 {m.availability}</span></>}
                </div>
              </div>
            </div>

            {m.bio && <p className="text-xs text-gray-500 mt-3 leading-relaxed">{m.bio}</p>}

            <div className="flex flex-wrap gap-1 mt-3 mb-4">
              {(m.expertise || m.skills || []).map(e => <span key={e} className="badge bg-indigo-50 text-indigo-700 text-[10px]">{e}</span>)}
            </div>

            {booked.has(m._id)
              ? <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-bold text-center">✓ Session Booked!</div>
              : <button onClick={() => bookSession(m._id)} disabled={booking === m._id}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                  {booking === m._id ? 'Booking...' : 'Book a Session'}
                </button>
            }
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🧑‍🏫</div>
          <p className="text-gray-500">No mentors match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('All') }} className="mt-3 text-primary text-sm font-semibold">Clear filters</button>
        </div>
      )}
    </div>
  )
}
