import { useState } from 'react'
import axios from 'axios'

const questions = [
  // Quantitative Aptitude
  { id: 1,  skill: 'Quantitative', q: 'A shirt costs ₹400 and is sold at 25% profit. What is the selling price?', opts: ['₹450', '₹480', '₹500', '₹520'], ans: 2 },
  { id: 2,  skill: 'Quantitative', q: 'What is 15% of 240?', opts: ['30', '36', '40', '45'], ans: 1 },
  { id: 3,  skill: 'Quantitative', q: 'A train travels 360km in 4 hours. What is its speed?', opts: ['80 km/h', '100 km/h', '120 km/h', '90 km/h'], ans: 3 },
  { id: 4,  skill: 'Quantitative', q: 'The average of 5 numbers is 20. One is removed and average becomes 18. What was removed?', opts: ['24', '26', '28', '30'], ans: 2 },
  { id: 5,  skill: 'Quantitative', q: 'If 8 workers finish a job in 12 days, how many days will 6 workers take?', opts: ['14', '16', '18', '20'], ans: 1 },

  // Verbal Ability
  { id: 6,  skill: 'Verbal', q: 'Choose the correctly spelled word:', opts: ['Accomodate', 'Acommodate', 'Accommadate', 'Accommodate'], ans: 3 },
  { id: 7,  skill: 'Verbal', q: 'Choose the word most similar to ELOQUENT:', opts: ['Silent', 'Articulate', 'Confused', 'Hesitant'], ans: 1 },
  { id: 8,  skill: 'Verbal', q: 'Choose the antonym of BENEVOLENT:', opts: ['Kind', 'Generous', 'Malevolent', 'Charitable'], ans: 2 },
  { id: 9,  skill: 'Verbal', q: 'Find the error: "He don\'t know the answer to the question."', opts: ['He', 'don\'t', 'answer', 'question'], ans: 1 },
  { id: 10, skill: 'Verbal', q: 'Fill in the blank: "The team worked ___ to finish on time."', opts: ['Diligently', 'Lazily', 'Carelessly', 'Slowly'], ans: 0 },

  // Logical Reasoning
  { id: 11, skill: 'Logical', q: 'Find the next number: 2, 6, 12, 20, 30, ?', opts: ['40', '42', '44', '46'], ans: 1 },
  { id: 12, skill: 'Logical', q: 'If MANGO is coded as NBNHP, how is GRAPE coded?', opts: ['HSBQF', 'HSBOF', 'ITBQF', 'ISBQF'], ans: 0 },
  { id: 13, skill: 'Logical', q: 'In a row, Ravi is 7th from left and 13th from right. How many students are in the row?', opts: ['18', '19', '20', '21'], ans: 1 },
  { id: 14, skill: 'Logical', q: 'If all Roses are Flowers and all Flowers are Plants, then all Roses are:', opts: ['Only Flowers', 'Only Plants', 'Neither', 'Plants'], ans: 3 },
  { id: 15, skill: 'Logical', q: 'A man walks 5km North, 3km East, then 5km South. How far is he from start?', opts: ['2km', '5km', '8km', '3km'], ans: 3 },
]

const SECTIONS = ['Quantitative', 'Verbal', 'Logical']
const SECTION_ICONS = { Quantitative: '🧮', Verbal: '🔤', Logical: '🔷' }
const SECTION_DESC = {
  Quantitative: 'Arithmetic, percentages, averages, ratios',
  Verbal: 'Grammar, vocabulary, comprehension',
  Logical: 'Patterns, sequences, reasoning',
}

export default function AptitudeTest() {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)

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
      submitTest()
    }
  }

  async function submitTest() {
    setSubmitting(true)
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.ans ? 1 : 0), 0)
    const pct = Math.round((score / questions.length) * 100)
    const sectionScores = SECTIONS.map(s => {
      const qs = questions.filter(q => q.skill === s)
      const correct = qs.filter(q => answers[q.id] === q.ans).length
      return { section: s, score: Math.round((correct / qs.length) * 100), correct, total: qs.length }
    })
    try {
      await axios.post('/api/students/assessment', {
        score: pct,
        skills: sectionScores.map(s => ({ skill: `Aptitude - ${s.section}`, score: s.score })),
        type: 'aptitude'
      })
    } catch {}
    setResults({ score: pct, sectionScores, correct: score, total: questions.length })
    setPhase('results')
    setSubmitting(false)
  }

  if (phase === 'intro') return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Aptitude Test</h2>
        <p className="text-gray-500 mb-6">Test your quantitative, verbal, and logical reasoning skills — the core aptitude areas assessed by top recruiters and companies.</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['⏱', '~10 min', 'Duration'], ['❓', '15 Qs', 'Questions'], ['🏆', '3 Sections', 'Areas']].map(([icon, val, label]) => (
            <div key={label} className="bg-blue-50 rounded-xl p-3">
              <div className="text-xl">{icon}</div>
              <div className="font-black text-gray-900">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {SECTIONS.map(s => (
            <div key={s} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl text-left">
              <div className="text-2xl">{SECTION_ICONS[s]}</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{s} Aptitude</div>
                <div className="text-xs text-gray-500">{SECTION_DESC[s]} · 5 questions</div>
              </div>
              <div className="ml-auto text-xs font-bold text-gray-400">5 Qs</div>
            </div>
          ))}
        </div>

        <div className="text-left mb-6 space-y-2">
          {['No negative marking', 'Results saved to your profile', 'Retake anytime to improve'].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-emerald-500">✓</span>{t}
            </div>
          ))}
        </div>

        <button onClick={() => setPhase('quiz')} className="btn-primary px-8 py-3">
          Start Aptitude Test →
        </button>
      </div>
    </div>
  )

  if (phase === 'quiz') {
    const q = questions[current]
    const progress = (current / questions.length) * 100
    const section = q.skill

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span className="badge bg-blue-50 text-blue-700">
              {SECTION_ICONS[section]} {section} Aptitude
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-teal h-2 rounded-full transition-all duration-500"
              style={{ width: progress + '%' }} />
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
          {submitting ? 'Calculating...' : current + 1 === questions.length ? 'Submit & See Results →' : 'Next Question →'}
        </button>
      </div>
    )
  }

  if (phase === 'results') return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-8 text-center">
        <div className="text-5xl mb-3">{results.score >= 70 ? '🏆' : results.score >= 50 ? '📈' : '💪'}</div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Aptitude Test Complete!</h2>
        <p className="text-gray-500 mb-4">{results.correct} of {results.total} correct answers</p>
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary to-teal text-white mb-4">
          <div>
            <div className="text-4xl font-black">{results.score}</div>
            <div className="text-xs opacity-80">/ 100</div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {results.score >= 70 ? '🌟 Strong aptitude! You\'re ready for campus placements.' : results.score >= 50 ? '📚 Good effort! Practice more to improve your score.' : '💡 Keep practicing — aptitude improves with regular practice.'}
        </p>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Section-wise Breakdown</h3>
        <div className="space-y-5">
          {results.sectionScores.map(({ section, score, correct, total }) => (
            <div key={section}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{SECTION_ICONS[section]}</span>
                  <span className="font-semibold text-gray-800">{section} Aptitude</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{correct}/{total} correct</span>
                  <span className={`font-bold text-sm ${score >= 70 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {score}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: score + '%' }} />
              </div>
              {score < 60 && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠ Needs improvement —
                  {section === 'Quantitative' ? ' practice arithmetic and percentage problems daily' :
                   section === 'Verbal' ? ' read newspapers and practice grammar exercises' :
                   ' solve puzzle books and pattern recognition exercises'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 bg-blue-50 border-blue-100">
        <h3 className="font-bold text-gray-900 mb-2">📚 Recommended Practice</h3>
        <div className="space-y-2">
          {[
            { label: 'RS Aggarwal Quantitative Aptitude', url: 'https://www.amazon.in/s?k=rs+aggarwal+quantitative+aptitude', icon: '🧮' },
            { label: 'IndiaBIX Aptitude Practice', url: 'https://www.indiabix.com/aptitude/questions-and-answers/', icon: '💻' },
            { label: 'Verbal Ability — IndiaBIX', url: 'https://www.indiabix.com/verbal-ability/questions-and-answers/', icon: '🔤' },
          ].map(r => (
            <a key={r.label} href={r.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue-700 hover:underline font-medium">
              <span>{r.icon}</span>{r.label} →
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => { setPhase('intro'); setCurrent(0); setAnswers({}); setSelected(null) }}
          className="btn-outline py-3">Retake Test</button>
        <button onClick={() => window.location.href = '/internships'}
          className="btn-primary py-3">Find Internships →</button>
      </div>
    </div>
  )
}