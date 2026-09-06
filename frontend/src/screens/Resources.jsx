import { useState, useEffect } from 'react'
import axios from 'axios'

const RESOURCES = {
  JavaScript: [
    { title: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', type: 'Free', duration: '300 hrs', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { title: 'The Complete JavaScript Course 2024', platform: 'Udemy', type: 'Paid', duration: '69 hrs', url: 'https://www.udemy.com/course/the-complete-javascript-course/', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'JavaScript Full Course', platform: 'YouTube', type: 'Free', duration: '8 hrs', url: 'https://www.youtube.com/results?search_query=javascript+full+course+beginners', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  React: [
    { title: 'React - The Complete Guide', platform: 'Udemy', type: 'Paid', duration: '48 hrs', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'Full Stack Open - React', platform: 'University of Helsinki', type: 'Free', duration: '40 hrs', url: 'https://fullstackopen.com/en/', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'React JS Full Course', platform: 'YouTube', type: 'Free', duration: '12 hrs', url: 'https://www.youtube.com/results?search_query=react+js+full+course+2024', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  Python: [
    { title: 'Python for Everybody', platform: 'Coursera', type: 'Free Audit', duration: '32 hrs', url: 'https://www.coursera.org/specializations/python', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Programming in Python', platform: 'NPTEL', type: 'Free', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106106145', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'Python Full Course for Beginners', platform: 'YouTube', type: 'Free', duration: '6 hrs', url: 'https://www.youtube.com/results?search_query=python+full+course+beginners+2024', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  SQL: [
    { title: 'SQL for Data Science', platform: 'Coursera', type: 'Free Audit', duration: '16 hrs', url: 'https://www.coursera.org/learn/sql-for-data-science', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Database Management System', platform: 'NPTEL', type: 'Free', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106105175', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'SQL Tutorial Full Course', platform: 'YouTube', type: 'Free', duration: '4 hrs', url: 'https://www.youtube.com/results?search_query=sql+full+course+beginners', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  DSA: [
    { title: 'Data Structures and Algorithms', platform: 'Coursera', type: 'Free Audit', duration: '48 hrs', url: 'https://www.coursera.org/specializations/data-structures-algorithms', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Data Structures and Algorithms using Java', platform: 'NPTEL', type: 'Free', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106102064', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'DSA Full Course', platform: 'YouTube', type: 'Free', duration: '10 hrs', url: 'https://www.youtube.com/results?search_query=dsa+full+course+for+beginners', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  'System Design': [
    { title: 'Software Design and Architecture', platform: 'Coursera', type: 'Free Audit', duration: '24 hrs', url: 'https://www.coursera.org/specializations/software-design-architecture', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'System Design for Beginners', platform: 'YouTube', type: 'Free', duration: '5 hrs', url: 'https://www.youtube.com/results?search_query=system+design+for+beginners+2024', color: 'bg-red-50 text-red-700 border-red-200' },
    { title: 'Grokking System Design', platform: 'Educative', type: 'Paid', duration: 'Self-paced', url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers', color: 'bg-green-50 text-green-700 border-green-200' },
  ],
  Communication: [
    { title: 'Improving Communication Skills', platform: 'Coursera', type: 'Free Audit', duration: '10 hrs', url: 'https://www.coursera.org/learn/wharton-communication-skills', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'English Communication Skills', platform: 'NPTEL', type: 'Free', duration: '12 weeks', url: 'https://nptel.ac.in/courses/109104093', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'Public Speaking & Communication', platform: 'YouTube', type: 'Free', duration: '2 hrs', url: 'https://www.youtube.com/results?search_query=communication+skills+for+professionals', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  Teamwork: [
    { title: 'Inspiring and Motivating Individuals', platform: 'Coursera', type: 'Free Audit', duration: '12 hrs', url: 'https://www.coursera.org/learn/motivate-people-teams', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Team Building & Collaboration', platform: 'YouTube', type: 'Free', duration: '1 hr', url: 'https://www.youtube.com/results?search_query=teamwork+and+collaboration+skills', color: 'bg-red-50 text-red-700 border-red-200' },
    { title: 'Work Smarter Not Harder', platform: 'Coursera', type: 'Free Audit', duration: '8 hrs', url: 'https://www.coursera.org/learn/work-smarter-not-harder', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ],
  Leadership: [
    { title: 'Leadership and Management', platform: 'Coursera', type: 'Free Audit', duration: '20 hrs', url: 'https://www.coursera.org/learn/leadership-management-india', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Leadership Skills', platform: 'NPTEL', type: 'Free', duration: '8 weeks', url: 'https://nptel.ac.in/courses/110104040', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'Leadership Skills for Engineers', platform: 'YouTube', type: 'Free', duration: '3 hrs', url: 'https://www.youtube.com/results?search_query=leadership+skills+for+engineering+students', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  'Problem Solving': [
    { title: 'Critical Thinking & Problem Solving', platform: 'Coursera', type: 'Free Audit', duration: '16 hrs', url: 'https://www.coursera.org/learn/critical-thinking-problem-solving', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Problem Solving Through Programming', platform: 'NPTEL', type: 'Free', duration: '12 weeks', url: 'https://nptel.ac.in/courses/106105085', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { title: 'Problem Solving Skills', platform: 'YouTube', type: 'Free', duration: '2 hrs', url: 'https://www.youtube.com/results?search_query=problem+solving+skills+for+engineers', color: 'bg-red-50 text-red-700 border-red-200' },
  ],
  'Time Management': [
    { title: 'Work Smarter Not Harder: Time Management', platform: 'Coursera', type: 'Free Audit', duration: '8 hrs', url: 'https://www.coursera.org/learn/work-smarter-not-harder', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Time Management Fundamentals', platform: 'YouTube', type: 'Free', duration: '1 hr', url: 'https://www.youtube.com/results?search_query=time+management+skills+students', color: 'bg-red-50 text-red-700 border-red-200' },
    { title: 'Productivity & Time Management', platform: 'Udemy', type: 'Paid', duration: '3 hrs', url: 'https://www.udemy.com/course/productivity-and-time-management-for-the-overwhelmed/', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ],
  Adaptability: [
    { title: 'Adaptability and Resiliency', platform: 'Coursera', type: 'Free Audit', duration: '8 hrs', url: 'https://www.coursera.org/learn/adaptability-and-resiliency', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Developing Adaptability as a Manager', platform: 'YouTube', type: 'Free', duration: '1 hr', url: 'https://www.youtube.com/results?search_query=adaptability+skills+workplace', color: 'bg-red-50 text-red-700 border-red-200' },
    { title: 'Growth Mindset', platform: 'Coursera', type: 'Free Audit', duration: '5 hrs', url: 'https://www.coursera.org/learn/mindshift-tackle-obstacles-make-transitions', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ],
}

const TECH_SKILLS = ['JavaScript', 'React', 'Python', 'SQL', 'DSA', 'System Design']
const SOFT_SKILLS = ['Communication', 'Teamwork', 'Leadership', 'Problem Solving', 'Time Management', 'Adaptability']

export default function Resources() {
  const [assessment, setAssessment] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/students/dashboard')
      .then(r => {
        setAssessment(r.data.assessment)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getScore = (skill) => {
    if (!assessment?.skillScores) return null
    const s = assessment.skillScores.find(s => s.skill === skill)
    return s?.score ?? null
  }

  const getScoreColor = (score) => {
    if (score === null) return 'text-gray-400'
    if (score >= 70) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score === null) return 'bg-gray-100'
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const skills = activeTab === 'technical' ? TECH_SKILLS : activeTab === 'soft' ? SOFT_SKILLS : [...TECH_SKILLS, ...SOFT_SKILLS]

  if (loading) return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-3 animate-spin">⚙️</div>
      <p className="text-gray-500">Loading your learning resources...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">📚</div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Learning Resources</h2>
            <p className="text-sm text-gray-500">Personalized courses based on your skill profile — Coursera, NPTEL, YouTube & more</p>
          </div>
        </div>
        {!assessment?.done && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            ⚠️ Complete the <a href="/assessment" className="font-bold underline">Skill Assessment</a> first to get personalized recommendations based on your gaps!
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: '🎯 All Skills' },
          { key: 'technical', label: '💻 Technical' },
          { key: 'soft', label: '🤝 Soft Skills' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-primary text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* SKILL SECTIONS */}
      {skills.map(skill => {
        const score = getScore(skill)
        const courses = RESOURCES[skill] || []
        return (
          <div key={skill} className="card p-6">
            {/* Skill Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-lg">{TECH_SKILLS.includes(skill) ? '💻' : '🤝'}</span>
                <h3 className="font-bold text-gray-900">{skill}</h3>
                {score !== null && score < 60 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Gap Detected</span>
                )}
                {score !== null && score >= 70 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Strong</span>
                )}
              </div>
              {score !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${getScoreBg(score)}`} style={{ width: score + '%' }} />
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                </div>
              )}
              {score === null && <span className="text-xs text-gray-400">Take assessment to see your score</span>}
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {courses.map((course, i) => (
                <a key={i} href={course.url} target="_blank" rel="noreferrer"
                  className={`block p-4 rounded-xl border ${course.color} hover:shadow-md transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60">{course.platform}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.type === 'Free' || course.type === 'Free Audit' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {course.type}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</p>
                  <p className="text-[10px] text-gray-500">⏱ {course.duration}</p>
                  <div className="mt-3 text-[10px] font-bold text-current opacity-70">Open Course →</div>
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}