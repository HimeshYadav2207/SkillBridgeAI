import { useNavigate } from 'react-router-dom';

const roles = [
  {
    id: 'student',
    icon: '🎓',
    label: 'Student',
    desc: 'Find internships, get assessed, build your portfolio',
    accent: '#14b8a6',
    accentBg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.25)',
  },
  {
    id: 'recruiter',
    icon: '🏢',
    label: 'Recruiter',
    desc: 'Hire top verified talent from 1000+ institutions',
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
  },
  {
    id: 'faculty',
    icon: '👨‍🏫',
    label: 'Faculty',
    desc: 'Guide students, run FDPs, lead research',
    accent: '#22c55e',
    accentBg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
  },
  {
    id: 'govt',
    icon: '🏛️',
    label: 'Government',
    desc: 'Monitor skill gaps, drive national policy',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    id: 'institution',
    icon: '🏫',
    label: 'Institution',
    desc: 'Track placements, manage MoUs, ensure compliance',
    accent: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
  },
];

const stats = [
  { value: '4.8L+', label: 'Students' },
  { value: '1,247', label: 'Institutions' },
  { value: '3,618', label: 'Companies' },
  { value: '1.09L', label: 'Placed' },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #14b8a6, #3b82f6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>SkillBridge</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
          One Platform.&nbsp; Five Portals.&nbsp; Infinite Opportunities.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: 900, width: '100%', marginBottom: '3rem' }}>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => navigate('/login')}
            style={{
              background: role.accentBg,
              border: `1px solid ${role.border}`,
              borderRadius: 16,
              padding: '1.75rem 1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${role.accent}22`;
              e.currentTarget.style.borderColor = role.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = role.border;
            }}
          >
            <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{role.icon}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem' }}>{role.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{role.desc}</div>
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: role.accent, fontSize: '1rem' }}>→</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#14b8a6', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sign in link */}
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ color: '#14b8a6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          Sign in
        </button>
      </p>
    </div>
  );
}
