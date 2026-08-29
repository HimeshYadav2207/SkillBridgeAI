import { Link } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'

const features = [
  { icon: '🧠', title: 'AI Skill Gap Analysis', desc: 'NLP-powered engine compares your skills against live industry job descriptions and quantifies exact gaps.' },
  { icon: '🎯', title: 'Smart Opportunity Matching', desc: 'ML recommendation engine maps verified student profiles to relevant internships using collaborative filtering.' },
  { icon: '📊', title: 'Live Skill Mapping', desc: 'Real-time industry skill demands scraped and reflected in student and faculty dashboards continuously.' },
  { icon: '✅', title: 'Verified Opportunities', desc: 'Recruiter-posted roles validated against institution partnerships before surfacing to students.' },
  { icon: '🔄', title: 'Continuous Feedback Loop', desc: 'Post-internship ratings and placement outcomes retrain the AI model, making it self-evolving.' },
  { icon: '🏛️', title: 'Government Analytics', desc: 'District-level skill gap dashboards and policy management for government stakeholders.' },
]

const stats = [
  { value: '0', label: 'Students Registered' },
  { value: '0', label: 'Institutions' },
  { value: '0', label: 'Industry Partners' },
  { value: '0', label: 'Successfully Placed' },
]

const portals = [
  { role: 'Student', icon: '🎓', desc: 'Assess skills, find internships, connect with mentors, build your portfolio', color: 'from-blue-500 to-blue-700', link: '/login' },
  { role: 'Recruiter', icon: '🏢', desc: 'Post jobs, discover verified talent, manage applications and hiring pipeline', color: 'from-emerald-500 to-emerald-700', link: '/login' },
  { role: 'Faculty', icon: '👨‍🏫', desc: 'Monitor student progress, analyze skill trends, align curriculum to industry', color: 'from-purple-500 to-purple-700', link: '/login' },
  { role: 'Government', icon: '🏛️', desc: 'Track national skill gaps, monitor district performance, manage policies — public dashboard, no login required', color: 'from-amber-500 to-amber-700', link: '/govt' },
  { role: 'Institution', icon: '🎪', desc: 'View placement analytics, NAAC/NBA reports, industry collaboration stats', color: 'from-rose-500 to-rose-700', link: '/login' },
]

const steps = [
  { n: '01', title: 'Register & Verify', desc: 'Create your profile with academic/professional information' },
  { n: '02', title: 'AI Assessment', desc: 'Take aptitude, technical & soft skill tests' },
  { n: '03', title: 'Skill Profiling', desc: 'Get a multimodal skill profile with gap analysis' },
  { n: '04', title: 'Smart Matching', desc: 'AI matches you to relevant internships & opportunities' },
  { n: '05', title: 'Apply & Collaborate', desc: 'Apply, get mentored, execute your placement' },
  { n: '06', title: 'Verify & Grow', desc: 'Verified experience added to your portfolio, feedback loop trains AI' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Inter']">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">SB</div>
            <span className="font-bold text-gray-900 text-lg">SkillBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#portals" className="hover:text-gray-900 transition-colors">Portals</a>
            <a href="#stats" className="hover:text-gray-900 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-5 py-2">Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 -z-10" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute inset-0 -z-10"><ParticleBackground count={55} /></div>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
            Bridge the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal">
              Academia‑Industry
            </span><br />
            Gap with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillBridge maps student skills to career requirements, identifies gaps using NLP, recommends personalized learning paths, and connects students with verified internships through a continuous AI feedback cycle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
              Start for Free <span>→</span>
            </Link>
            <Link to="/login" className="btn-outline text-base px-8 py-3.5 inline-flex items-center gap-2">
              Demo Login <span>↗</span>
            </Link>
          </div>
        </div>

        {/* HERO DASHBOARD MOCKUP */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-blue-100/50 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 border border-gray-200 max-w-xs">skillbridge.in/dashboard</div>
            </div>
            <div className="p-6 grid grid-cols-4 gap-4">
              {[['72', 'Skill Score', '↑ +8', 'text-blue-600 bg-blue-50'], ['5', 'Applications', '↑ +2', 'text-emerald-600 bg-emerald-50'], ['143', 'Profile Views', '↑ +31', 'text-purple-600 bg-purple-50'], ['3', 'Interviews', '↑ +1', 'text-amber-600 bg-amber-50']].map(([v, l, c, cls]) => (
                <div key={l} className="card p-4">
                  <div className={`text-2xl font-black mb-1 ${cls.split(' ')[0]}`}>{v}</div>
                  <div className="text-xs text-gray-500">{l}</div>
                  <div className={`text-xs font-semibold mt-1 ${cls.split(' ')[0]}`}>{c} this week</div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-3 gap-4">
              <div className="col-span-2 card p-4">
                <div className="text-xs font-semibold text-gray-500 mb-3">SKILL GAP ANALYSIS</div>
                {[['Python', 88], ['React', 72], ['SQL', 65], ['ML', 40]].map(([s, p]) => (
                  <div key={s} className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-gray-600 w-16">{s}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-teal h-2 rounded-full transition-all" style={{ width: p + '%' }} />
                    </div>
                    <div className="text-xs font-semibold text-gray-700 w-8">{p}%</div>
                  </div>
                ))}
              </div>
              <div className="card p-4">
                <div className="text-xs font-semibold text-gray-500 mb-3">TOP MATCH</div>
                <div className="text-2xl mb-1">🌐</div>
                <div className="text-sm font-bold text-gray-900">Google SWE Intern</div>
                <div className="text-xs text-gray-500 mt-1">94% skill match</div>
                <div className="mt-3 bg-primary text-white text-xs text-center py-1.5 rounded-lg font-medium">Apply Now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="py-16 bg-primary">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-blue-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-primary tracking-widest uppercase mb-3">AI-POWERED FEATURES</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Everything you need to<br />bridge the gap</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-primary tracking-widest uppercase mb-3">12-STEP PROCESS</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">How SkillBridge works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map(s => (
              <div key={s.n} className="flex gap-4 card p-5">
                <div className="text-2xl font-black text-blue-100 leading-none w-12 shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section id="portals" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-primary tracking-widest uppercase mb-3">5 ROLE-BASED PORTALS</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">One platform, every stakeholder</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portals.map(p => (
              <Link key={p.role} to={p.link} className="card p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl mb-4`}>{p.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors">{p.role} Portal</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                <div className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Enter portal <span>→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">TECHNICAL STACK</div>
          <div className="flex flex-wrap justify-center gap-3">
            {['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'Python', 'FastAPI', 'scikit-learn', 'NLP', 'JWT', 'OAuth 2.0', 'RBAC', 'NeDB', 'Docker', 'GitHub Actions'].map(t => (
              <span key={t} className="tag text-sm px-3 py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to bridge the gap?</h2>
          <p className="text-blue-200 text-lg mb-10">Join thousands of students, recruiters, and institutions already using SkillBridge to transform career outcomes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all inline-flex items-center gap-2">
              Create Free Account →
            </Link>
            <Link to="/login" className="border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Try Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">SB</div>
          <span className="text-white font-semibold">SkillBridge</span>
        </div>
        <p>© 2024 SkillBridge — Academia Industry Collaboration Portal · SIH 2024</p>
        <p className="mt-1 text-gray-600 text-xs">Built with React, Node.js, Python FastAPI · AI-Powered Skill Intelligence</p>
      </footer>
    </div>
  )
}
