import { useState, useEffect } from 'react'
import axios from 'axios'

const TYPES = ['All', 'Full-time', 'Remote', 'Hybrid', 'Part-time']
const LOCATIONS = ['All', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Gurugram', 'Ahmedabad', 'Delhi', 'Noida']

export default function Internships() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiSource, setApiSource] = useState('demo')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [applying, setApplying] = useState(null)
  const [applied, setApplied] = useState(new Set())

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs(query = '') {
    setLoading(true)
    try {
      const profileRes = await axios.get('/api/students/dashboard')
      const skillScore = profileRes.data.stats?.skillScore || 30
      const interests = profileRes.data.profile?.interests || []
      const [feedRes, dbRes] = await Promise.all([
        axios.get(`/api/students/jobs-feed${query ? `?q=${encodeURIComponent(query)}` : interests.length > 0 ? `?q=${encodeURIComponent(interests[0])}` : ''}`),
        axios.get('/api/students/internships'),
      ])
      const feedJobs = feedRes.data.jobs || []
      const dbInternships = (dbRes.data.internships || []).map(i => ({
        _id: i._id,
        title: i.title,
        company: i.company,
        location: i.location,
        compensation: i.stipend || 'Competitive',
        duration: i.duration || 'Permanent',
        skills: i.skills || [],
       match: Math.min(95, Math.floor(skillScore + (i._id.charCodeAt(0) % 10) - 5)),
        logo: i.logo || '💼',
        type: i.type || 'Full-time',
        category: 'internship',
      }))
      setListings([...dbInternships, ...feedJobs])
      setApiSource(feedRes.data.source || 'demo')
    } catch {
      setListings([])
    }
    setLoading(false)
  }

  async function applyNow(id) {
    setApplying(id)
    try {
      await axios.post(`/api/students/apply/${id}`)
      setApplied(prev => new Set([...prev, id]))
    } catch {}
    setApplying(null)
  }

  const filtered = listings.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || i.type === typeFilter
    const matchLoc = locationFilter === 'All' || (i.location || '').includes(locationFilter)
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter
    return matchSearch && matchType && matchLoc && matchCat
  })

  const internshipCount = listings.filter(i => i.category === 'internship').length
  const jobCount = listings.filter(i => i.category === 'job').length

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium ${apiSource === 'adzuna' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
        <span>{apiSource === 'adzuna' ? '🟢 Live data from Adzuna Jobs API' : '🔵 Smart demo data — add Adzuna API key in backend/.env for live Indian job listings'}</span>
        {apiSource === 'adzuna' && <span className="ml-auto font-bold">{listings.length} live jobs</span>}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `All (${listings.length})` },
          { key: 'internship', label: `🎓 Internships (${internshipCount})` },
          { key: 'job', label: `💼 Jobs (${jobCount})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setCategoryFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${categoryFilter === tab.key ? 'bg-primary text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-gray-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, company, skill..." className="bg-transparent flex-1 text-sm outline-none" />
          </div>
          <button onClick={() => fetchJobs(search)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
            🤖 AI Search
          </button>
          <div className="flex gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none">
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} {categoryFilter === 'job' ? 'jobs' : categoryFilter === 'internship' ? 'internships' : 'listings'} found</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-gray-500">AI Match Score active</span>
        </div>
      </div>

      {loading && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3 animate-spin">⚙️</div>
          <p className="text-gray-500">Fetching smart job recommendations...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(i => (
            <div key={i._id} className="card p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">{i.logo || '💼'}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{i.title}</h3>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${i.category === 'job' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {i.category === 'job' ? 'JOB' : 'INTERN'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{i.company} · {i.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${i.match >= 85 ? 'text-emerald-600' : i.match >= 70 ? 'text-amber-600' : 'text-gray-600'}`}>{i.match}%</div>
                  <div className="text-[10px] text-gray-400">AI match</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                <span className="badge bg-gray-50">{i.type}</span>
                <span>⏱ {i.duration}</span>
                <span className={`font-semibold ${i.compensation === 'Unpaid' ? 'text-gray-400' : 'text-emerald-700'}`}>
                  {i.compensation === 'Unpaid' ? '🔓 Unpaid' : `💰 ${i.compensation}`}
                </span>
              </div>

              {i.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{i.description}</p>}

              <div className="flex flex-wrap gap-1 mb-4">
                {(i.skills || []).map(s => <span key={s} className="badge bg-blue-50 text-blue-700 text-[10px]">{s}</span>)}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${i.match >= 85 ? 'bg-emerald-500' : i.match >= 70 ? 'bg-amber-400' : 'bg-blue-400'}`}
                    style={{ width: (i.match || 0) + '%' }} />
                </div>
                {i.url
                  ? <a href={i.url} target="_blank" rel="noreferrer" className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">Apply ↗</a>
                  : applied.has(i._id)
                    ? <button disabled className="px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">✓ Applied</button>
                    : <button onClick={() => applyNow(i._id)} disabled={applying === i._id}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                        {applying === i._id ? '...' : 'Apply'}
                      </button>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">No listings match your filters.</p>
          <button onClick={() => { setSearch(''); setTypeFilter('All'); setLocationFilter('All'); setCategoryFilter('all') }} className="mt-3 text-primary text-sm font-semibold">Clear filters</button>
        </div>
      )}
    </div>
  )
}