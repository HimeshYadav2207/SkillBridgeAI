import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const QUICK_PROMPTS = [
  'How do I improve my resume?',
  'Tips for technical interviews',
  'What skills should I learn for SWE?',
  'How to negotiate salary?',
]

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Hi! I\'m SkillBridge AI — your personal career assistant. Ask me about resumes, interviews, skills, internships, or anything career-related!', ts: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [groqActive, setGroqActive] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(p => [...p, { role: 'user', text: msg, ts: new Date() }])
    setLoading(true)
    try {
      const r = await axios.post('/api/ai/chat', { message: msg })
      setGroqActive(r.data.source === 'groq')
      setMessages(p => [...p, { role: 'assistant', text: r.data.reply, ts: new Date() }])
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: '⚠️ Something went wrong. Please try again!', ts: new Date() }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        title="AI Career Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-t-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
              <div>
                <div className="font-bold text-sm">SkillBridge AI</div>
                <div className={`text-xs ${groqActive ? 'text-emerald-300' : 'text-blue-200'}`}>
                  {groqActive ? '🟢 Groq AI active' : '🔵 Smart assistant'}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  className="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 hover:bg-blue-100 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <button onClick={() => send()}
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors">
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
