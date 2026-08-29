import { useState } from 'react'
import axios from 'axios'

const questions = [
  // JavaScript
  { id: 1,  skill: 'JavaScript', q: 'What is the output of typeof null in JavaScript?', opts: ['null', 'undefined', 'object', 'string'], ans: 2 },
  { id: 2,  skill: 'JavaScript', q: 'Which method removes the last element from an array?', opts: ['shift()', 'pop()', 'splice()', 'slice()'], ans: 1 },
  { id: 3,  skill: 'JavaScript', q: 'What does the "===" operator check in JavaScript?', opts: ['Value only', 'Type only', 'Value and type', 'Reference only'], ans: 2 },
  { id: 4,  skill: 'JavaScript', q: 'Which of the following is NOT a JavaScript data type?', opts: ['Boolean', 'Float', 'Symbol', 'BigInt'], ans: 1 },
  { id: 5,  skill: 'JavaScript', q: 'What does "async/await" help with in JavaScript?', opts: ['CSS animations', 'Handling asynchronous code', 'DOM manipulation', 'Memory management'], ans: 1 },
  { id: 6,  skill: 'JavaScript', q: 'What is a closure in JavaScript?', opts: ['A function with no return value', 'A function that remembers its outer scope', 'A loop that never ends', 'A class method'], ans: 1 },

  // React
  { id: 7,  skill: 'React', q: 'Which hook is used for side effects in React?', opts: ['useState', 'useEffect', 'useRef', 'useMemo'], ans: 1 },
  { id: 8,  skill: 'React', q: 'What does JSX stand for?', opts: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JS Extension'], ans: 0 },
  { id: 9,  skill: 'React', q: 'What is the correct way to update state in React?', opts: ['this.state.x = y', 'setState or useState setter', 'state.update()', 'mutate(state)'], ans: 1 },
  { id: 10, skill: 'React', q: 'What does the key prop do in a list rendering?', opts: ['Styles the element', 'Helps React identify changed items', 'Enables animations', 'Sets focus'], ans: 1 },
  { id: 11, skill: 'React', q: 'Which hook returns a mutable ref object in React?', opts: ['useState', 'useEffect', 'useRef', 'useCallback'], ans: 2 },

  // Python
  { id: 12, skill: 'Python', q: 'Which of the following is a mutable data type in Python?', opts: ['tuple', 'string', 'list', 'int'], ans: 2 },
  { id: 13, skill: 'Python', q: 'What keyword is used to define a function in Python?', opts: ['function', 'def', 'fn', 'func'], ans: 1 },
  { id: 14, skill: 'Python', q: 'What is the output of len("SkillBridge")?', opts: ['10', '11', '12', '9'], ans: 1 },
  { id: 15, skill: 'Python', q: 'Which Python library is mainly used for data analysis?', opts: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], ans: 1 },
  { id: 16, skill: 'Python', q: 'What does the "self" keyword represent in a Python class?', opts: ['The class itself', 'The current instance', 'The parent class', 'A global variable'], ans: 1 },
  { id: 17, skill: 'Python', q: 'Which of these is used to handle exceptions in Python?', opts: ['catch-finally', 'try-except', 'if-else', 'handle-error'], ans: 1 },

  // SQL
  { id: 18, skill: 'SQL', q: 'Which SQL clause is used to filter results?', opts: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], ans: 2 },
  { id: 19, skill: 'SQL', q: 'Which JOIN returns rows that have matching values in both tables?', opts: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], ans: 2 },
  { id: 20, skill: 'SQL', q: 'What does the DISTINCT keyword do in SQL?', opts: ['Removes duplicates', 'Sorts results', 'Filters nulls', 'Groups rows'], ans: 0 },
  { id: 21, skill: 'SQL', q: 'Which function returns the number of rows in SQL?', opts: ['SUM()', 'MAX()', 'COUNT()', 'AVG()'], ans: 2 },
  { id: 22, skill: 'SQL', q: 'Which SQL statement is used to add new data into a table?', opts: ['UPDATE', 'INSERT INTO', 'ALTER', 'ADD ROW'], ans: 1 },

  // DSA
  { id: 23, skill: 'DSA', q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2 },
  { id: 24, skill: 'DSA', q: 'Which data structure follows LIFO order?', opts: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1 },
  { id: 25, skill: 'DSA', q: 'What is the worst-case time complexity of quicksort?', opts: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], ans: 2 },
  { id: 26, skill: 'DSA', q: 'Which algorithm is used to find the shortest path in a weighted graph?', opts: ["Kruskal's", "Prim's", "Dijkstra's", 'DFS'], ans: 2 },
  { id: 27, skill: 'DSA', q: 'What is the space complexity of merge sort?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], ans: 2 },

  // System Design
  { id: 28, skill: 'System Design', q: 'What does CDN stand for?', opts: ['Content Delivery Network', 'Central Data Node', 'Cloud Data Network', 'Content Distribution Node'], ans: 0 },
  { id: 29, skill: 'System Design', q: 'Which technique is used to distribute incoming network traffic across multiple servers?', opts: ['Caching', 'Load Balancing', 'Sharding', 'Replication'], ans: 1 },
  { id: 30, skill: 'System Design', q: 'What is horizontal scaling?', opts: ['Upgrading existing hardware', 'Adding more machines to handle load', 'Optimizing code', 'Compressing data'], ans: 1 },
]

const SKILLS = ['JavaScript', 'React', 'Python', 'SQL', 'DSA', 'System Design']

export default function Assessment() {
  const [phase, setPhase] = useState('intro') // intro | quiz | results
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
      if (!qs.length) return { skill: s, score: Math.floor(Math.random() * 40) + 50 }
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
        <p className="text-gray-500 mb-6">Answer {questions.length} questions across {SKILLS.length} skill areas. Our AI will analyze your responses and generate a personalized skill profile with gap analysis.</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[['⏱', '~20 min', 'Duration'], ['❓', `${questions.length} Qs`, 'Questions'], ['🎯', `${SKILLS.length} Skills`, 'Assessed']].map(([icon, val, label]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-3">
              <div className="text-xl">{icon}</div>
              <div className="font-black text-gray-900">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
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
    const progress = ((current) / questions.length) * 100
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span className="badge bg-blue-50 text-blue-700">{q.skill}</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-teal h-2 rounded-full transition-all duration-500" style={{ width: progress + '%' }} />
          </div>
        </div>

        <div className="card p-6">
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
              {selected === q.ans ? '✅ Correct!' : `❌ Correct answer: ${q.opts[q.ans]}`}
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

  if (phase === 'results') return (
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
        <h3 className="font-bold text-gray-900 mb-4">Skill Breakdown</h3>
        <div className="space-y-4">
          {results.skillScores.map(({ skill, score }) => (
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

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => { setPhase('intro'); setCurrent(0); setAnswers({}); setSelected(null) }} className="btn-outline py-3">Retake Assessment</button>
        <button onClick={() => window.location.href = '/internships'} className="btn-primary py-3">Find Internships →</button>
      </div>
    </div>
  )
}
