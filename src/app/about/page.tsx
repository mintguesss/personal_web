import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="page-header" style={{ borderBottom: '1px solid var(--border)', padding: '3rem clamp(2rem,5vw,5rem) 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>About</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, lineHeight: 1.05 }}>
          關於我 <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>/ Ken</em>
        </h1>
      </div>

      <div className="page-body" style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2.5rem,5vw,4rem) clamp(2rem,5vw,5rem)' }}>

        {/* Bio + Info */}
        <div className="about-bio-grid">
          <div>
            {[['學校', siteData.institution], ['科系', siteData.title], ['Email', siteData.email], ['電話', siteData.phone], ['位置', siteData.location]].map(([label, value]) => (
              <div key={String(label)} style={{ borderTop: '1px solid var(--border)', padding: '0.85rem 0' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
                {label === 'Email'
                  ? <a href={'mailto:' + value} style={{ fontSize: '0.88rem', color: 'var(--accent)', textDecoration: 'none' }}>{value}</a>
                  : <p style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{value}</p>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {siteData.bio.map((p, i) => <p key={i} style={{ fontSize: '0.93rem', color: 'var(--text-2)', lineHeight: 1.9 }}>{p}</p>)}
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '4rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.75rem' }}>Education</p>
          {siteData.education.map((e, i) => (
            <div key={e.school} className="edu-row" style={{ borderTop: '1px solid var(--border)', borderBottom: i === siteData.education.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', paddingTop: '3px' }}>{e.period}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.15rem' }}>{e.school}</h3>
                {e.dept && <p style={{ fontSize: '0.84rem', color: 'var(--text-2)' }}>{e.dept} — {e.degree}</p>}
              </div>
              {e.badge && <span className="edu-badge" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.25em 0.8em', borderRadius: '2px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)', whiteSpace: 'nowrap', alignSelf: 'start' }}>{e.badge}</span>}
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.75rem' }}>Work Experience</p>
          <div className="work-grid">
            {(siteData.experience as unknown as typeof siteData.experience[number][]).map(e => (
              <div key={e.company} style={{ background: 'var(--bg)', padding: '1.75rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{e.period}</p>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, marginBottom: '0.15rem' }}>{e.role}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>{e.company}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
