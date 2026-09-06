import { useState } from 'react'
import axios from 'axios'

const questions = [
  // JavaScript (2)
  { id: 1,  skill: 'JavaScript', q: 'What is the output of typeof null in JavaScript?', opts: ['null', 'undefined', 'object', 'string'], ans: 2 },
  { id: 2,  skill: 'JavaScript', q: 'What is a closure in JavaScript?', opts: ['A function with no return value', 'A function that remembers its outer scope', 'A loop that never ends', 'A class method'], ans: 1 },

  // React (2)
  { id: 3,  skill: 'React', q: 'What does JSX stand for?', opts: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JS Extension'], ans: 0 },
  { id: 4,  skill: 'React', q: 'What does the key prop do in list rendering?', opts: ['Styles the element', 'Helps React identify changed items', 'Enables animations', 'Sets focus'], ans: 1 },

  // Python (2)
  { id: 5,  skill: 'Python', q: 'Which of the following is a mutable data type in Python?', opts: ['tuple', 'string', 'list', 'int'], ans: 2 },
  { id: 6,  skill: 'Python', q: 'What does the "self" keyword represent in a Python class?', opts: ['The class itself', 'The current instance', 'The parent class', 'A global variable'], ans: 1 },

  // SQL (2)
  { id: 7,  skill: 'SQL', q: 'Which SQL clause is used to filter results?', opts: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], ans: 2 },
  { id: 8,  skill: 'SQL', q: 'What does the DISTINCT keyword do in SQL?', opts: ['Removes duplicates', 'Sorts results', 'Filters nulls', 'Groups rows'], ans: 0 },

  // DSA (2)
  { id: 9,  skill: 'DSA', q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2 },
  { id: 10, skill: 'DSA', q: 'Which data structure follows LIFO order?', opts: ['Queue', 'Linked List', 'Tree', 'Stack'], ans: 3 },

  // System Design (2)
  { id: 11, skill: 'System Design', q: 'What does CDN stand for?', opts: ['Central Data Node', 'Cloud Data Network', 'Content Delivery Network', 'Content Distribution Node'], ans: 2 },
  { id: 12, skill: 'System Design', q: 'Which technique distributes incoming traffic across multiple servers?', opts: ['Load Balancing', 'Caching', 'Sharding', 'Replication'], ans: 0 },

  // Communication (2)
  { id: 13, skill: 'Communication', q: 'During a meeting your explanation is confusing teammates. What do you do?', opts: ['Continue the same way', 'Tell them to figure it out', 'Skip the topic entirely', 'Stop, ask what is unclear, and try a simpler explanation'], ans: 3 },
  { id: 14, skill: 'Communication', q: 'You receive critical feedback from your manager. How do you respond?', opts: ['Thank them, ask clarifying questions, and use feedback to improve', 'Defend your work and explain why you were right', 'Stay quiet and avoid the topic', 'Complain to teammates about unfair treatment'], ans: 0 },

  // Teamwork (2)
  { id: 15, skill: 'Teamwork', q: 'A teammate is struggling and might delay the deadline. What do you do?', opts: ['Let them handle it — it is their responsibility', 'Offer to help while ensuring your own tasks are done', 'Report them to the manager immediately', 'Complain to other team members'], ans: 1 },
  { id: 16, skill: 'Teamwork', q: 'Two teammates have a conflict about approach. As the third member, what do you do?', opts: ['Stay out of it completely', 'Take sides with whoever you like more', 'Facilitate a discussion to find a mutually agreed solution', 'Escalate immediately to the manager'], ans: 2 },

  // Leadership (2)
  { id: 17, skill: 'Leadership', q: 'You are leading a project and the team is heading in the wrong direction. What do you do?', opts: ['Let the team continue and hope it works out', 'Do all the work yourself', 'Blame the team for the mistake', 'Call a meeting, explain the issue, and redirect with a clear plan'], ans: 3 },
  { id: 18, skill: 'Leadership', q: 'A team member consistently misses deadlines. As leader, what is your first step?', opts: ['Have a private empathetic conversation to understand their challenges', 'Remove them from the project immediately', 'Ignore it and redistribute their work silently', 'Publicly call them out in the team meeting'], ans: 0 },

  // Problem Solving (2)
  { id: 19, skill: 'Problem Solving', q: 'You encounter a complex production bug you have never seen before. What is your approach?', opts: ['Panic and ask someone else to fix it', 'Randomly try different fixes', 'Restart the server and hope it goes away', 'Break it down, check logs, isolate variables, and research systematically'], ans: 3 },
  { id: 20, skill: 'Problem Solving', q: 'You have a tight deadline but keep running into unexpected problems. What do you do?', opts: ['Assess, prioritize critical tasks, and communicate status to stakeholders', 'Work through the night alone without telling anyone', 'Give up and submit incomplete work', 'Blame the unclear requirements'], ans: 0 },

  // Time Management (2)
  { id: 21, skill: 'Time Management', q: 'You have three equally important tasks due the same day. How do you approach them?', opts: ['Do them in random order as you feel like', 'Ask for extensions on all three', 'Focus on the easiest one first to feel productive', 'Prioritize by urgency, create a schedule and stick to it'], ans: 3 },
  { id: 22, skill: 'Time Management', q: 'Halfway through a project you realize you are behind schedule. What do you do?', opts: ['Rush through remaining tasks sacrificing quality', 'Inform stakeholders early, reassess, and identify ways to catch up', 'Pretend everything is on track', 'Abandon the project'], ans: 1 },

  // Adaptability (2)
  { id: 23, skill: 'Adaptability', q: 'Your manager changes project requirements significantly mid-way. How do you react?', opts: ['Refuse to accept changes and continue with the old plan', 'Acknowledge changes, adapt your plan, and communicate timeline impacts', 'Complain extensively about last-minute changes', 'Submit the original version anyway'], ans: 1 },
  { id: 24, skill: 'Adaptability', q: 'You are assigned a project using technology you have never used before. What do you do?', opts: ['Tell your manager you cannot do it', 'Pretend you know it and figure it out without telling anyone', 'Use old technology regardless', 'Research it, find learning resources, and set realistic expectations'], ans: 3 },
]

const TECH_SKILLS = ['JavaScript', 'React', 'Python', 'SQL', 'DSA', 'System Design']
const SOFT_SKILLS = ['Communication', 'Teamwork', 'Leadership', 'Problem Solving', 'Time Management', 'Adaptability']
const SKILLS = [...TECH_SKILLS, ...SOFT_SKILLS]

export default function Assessment() {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)

  function startQuiz() { setPhase('quiz') }

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    setAnswers(prev => ({ ...prev, [questions[current].id]: idx }))
  }

  function next() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      submitQuiz()
    }
  }

  async function submitQuiz() {
    setSubmitting(true)
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.ans ? 1 : 0), 0)
    const pct = Math.round((score / questions.length) * 100)
    const skillScores = SKILLS.map(s => {
      const qs = questions.filter(q => q.skill === s)
      if (!qs.length) return { skill: s, score: 0 }
      const correct = qs.filter(q => answers[q.id] === q.ans).length
      return { skill: s, score: Math.round((correct / qs.length) * 100) }
    })
    try {
      await axios.post('/api/students/assessment', { score: pct, skills: skillScores })
    } catch {}
    setResults({ score: pct, skillScores, correct: score, total: questions.length })
    setPhase('results')
    setSubmitting(false)
  }

  if (phase === 'intro') return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🧠</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">AI Skill Assessment</h2>
        <p className="text-gray-500 mb-6">Answer {questions.length} questions across {SKILLS.length} skill areas — both technical and soft skills. Our AI will generate a personalized profile with gap analysis.</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['⏱', '~15 min', 'Duration'], ['❓', `${questions.length} Qs`, 'Questions'], ['🎯', `${SKILLS.length} Skills`, 'Assessed']].map(([icon, val, label]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-3">
              <div className="text-xl">{icon}</div>
              <div className="font-black text-gray-900">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-purple-50 rounded-xl p-3 text-left">
            <div className="text-xs font-bold text-purple-700 mb-1">💻 Technical Skills</div>
            {TECH_SKILLS.map(s => <div key={s} className="text-xs text-gray-600">• {s}</div>)}
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-left">
            <div className="text-xs font-bold text-emerald-700 mb-1">🤝 Soft Skills</div>
            {SOFT_SKILLS.map(s => <div key={s} className="text-xs text-gray-600">• {s}</div>)}
          </div>
        </div>
        <div className="text-left mb-6 space-y-2">
          {['No time limit per question', 'Results are added to your profile', 'Retake anytime to track progress'].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-emerald-500">✓</span>{t}
            </div>
          ))}
        </div>
        <button onClick={startQuiz} className="btn-primary px-8 py-3">Start Assessment →</button>
      </div>
    </div>
  )

  if (phase === 'quiz') {
    const q = questions[current]
    const progress = (current / questions.length) * 100
    const isSoft = SOFT_SKILLS.includes(q.skill)
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span className={`badge ${isSoft ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
              {isSoft ? '🤝' : '💻'} {q.skill}
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-teal h-2 rounded-full transition-all duration-500" style={{ width: progress + '%' }} />
          </div>
        </div>

        <div className="card p-6">
          {isSoft && <div className="text-xs text-emerald-600 font-semibold mb-3">🤝 Soft Skill — Choose the best response</div>}
          <h3 className="text-lg font-bold text-gray-900 mb-6">{q.q}</h3>
          <div className="space-y-3">
            {q.opts.map((opt, i) => {
              let cls = 'w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm '
              if (selected === null) cls += 'border-gray-100 hover:border-primary/40 hover:bg-blue-50'
              else if (i === q.ans) cls += 'border-emerald-400 bg-emerald-50 text-emerald-700'
              else if (i === selected && i !== q.ans) cls += 'border-red-300 bg-red-50 text-red-600'
              else cls += 'border-gray-100 text-gray-400'
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              )
            })}
          </div>
          {selected !== null && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${selected === q.ans ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {selected === q.ans ? '✅ Great choice!' : `❌ Best answer: ${q.opts[q.ans]}`}
            </div>
          )}
        </div>

        <button onClick={next} disabled={selected === null || submitting}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${selected === null || submitting ? 'bg-gray-100 text-gray-400' : 'btn-primary'}`}>
          {submitting ? 'Analyzing...' : current + 1 === questions.length ? 'Submit & Get Results →' : 'Next Question →'}
        </button>
      </div>
    )
  }

  if (phase === 'results') {
    const techScores = results.skillScores.filter(s => TECH_SKILLS.includes(s.skill))
    const softScores = results.skillScores.filter(s => SOFT_SKILLS.includes(s.skill))
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">{results.score >= 70 ? '🏆' : results.score >= 50 ? '📈' : '💪'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Assessment Complete!</h2>
          <p className="text-gray-500 mb-4">{results.correct} of {results.total} correct answers</p>
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary to-teal text-white mb-4">
            <div>
              <div className="text-4xl font-black">{results.score}</div>
              <div className="text-xs opacity-80">/ 100</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {results.score >= 70 ? 'Excellent! Your skill profile is strong.' : results.score >= 50 ? 'Good progress! Keep building.' : 'Focus on the gap areas below to improve.'}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">💻 Technical Skills</h3>
          <div className="space-y-4">
            {techScores.map(({ skill, score }) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{skill}</span>
                  <span className="font-bold text-gray-900">{score}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: score + '%' }} />
                </div>
                {score < 60 && <p className="text-xs text-red-500 mt-1">⚠ Skill gap detected — consider focused practice</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">🤝 Soft Skills</h3>
          <div className="space-y-4">
            {softScores.map(({ skill, score }) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{skill}</span>
                  <span className="font-bold text-gray-900">{score}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: score + '%' }} />
                </div>
                {score < 60 && <p className="text-xs text-red-500 mt-1">⚠ Area for improvement — practice in real team settings</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { setPhase('intro'); setCurrent(0); setAnswers({}); setSelected(null) }} className="btn-outline py-3">Retake Assessment</button>
          <button onClick={() => window.location.href = '/internships'} className="btn-primary py-3">Find Internships →</button>
        </div>
      </div>
    )
  }
}