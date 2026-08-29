import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── JWT Interceptor ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────
export const login    = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getMe    = ()     => api.get('/auth/me')

// ── Student ──────────────────────────────────────────────
export const getStudentProfile  = ()       => api.get('/student/profile')
export const updateSkills       = (data)   => api.put('/student/skills', data)
export const submitAssessment   = (data)   => api.post('/student/assessment', data)
export const getRecommendations = ()       => api.get('/student/recommendations')

// ── Internships ──────────────────────────────────────────
export const getInternships     = (params) => api.get('/internships', { params })
export const applyToInternship  = (id)     => api.post(`/internships/${id}/apply`)
export const createInternship   = (data)   => api.post('/internships', data)

// ── Recruiter ─────────────────────────────────────────────
export const getRecruiterCandidates   = (params) => api.get('/recruiter/candidates', { params })
export const updateCandidateStatus    = (id, data) => api.patch(`/recruiter/candidates/${id}`, data)
export const getRecruiterJobs         = ()       => api.get('/recruiter/jobs')
export const getRecruiterAnalytics    = ()       => api.get('/recruiter/analytics')

// ── Faculty ──────────────────────────────────────────────
export const getFacultyStudents    = ()     => api.get('/faculty/students')
export const getFacultyResearch    = ()     => api.get('/faculty/research')
export const getFacultyFDPs        = ()     => api.get('/faculty/fdps')
export const createResearchProject = (data) => api.post('/faculty/research', data)
export const getFacultyAssessments = ()     => api.get('/faculty/assessments')

// ── Government ───────────────────────────────────────────
export const getGovtStats     = ()       => api.get('/govt/stats')
export const getGovtSkillGaps = (params) => api.get('/govt/skill-gaps', { params })
export const getGovtDistricts = ()       => api.get('/govt/districts')
export const getGovtAlerts    = ()       => api.get('/govt/alerts')

// ── Institution ───────────────────────────────────────────
export const getInstitutionStats      = () => api.get('/institution/stats')
export const getInstitutionPlacements = () => api.get('/institution/placements')
export const getInstitutionMoUs       = () => api.get('/institution/mous')
export const getInstitutionNAAC       = () => api.get('/institution/naac')
export const createMoU                = (data) => api.post('/institution/mous', data)

// ── Shared ────────────────────────────────────────────────
export const getMentors    = (params) => api.get('/mentors', { params })
export const getAnalytics  = (role)   => api.get(`/analytics/${role}`)

// ── AI Features ───────────────────────────────────────────
export const aiMatch     = (data) => api.post('/ai/match', data)
export const aiRecommend = (data) => api.post('/ai/recommend', data)

export default api
