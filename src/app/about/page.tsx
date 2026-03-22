'use client'
import { useState, useEffect, useRef } from 'react'
import { siteData } from '@/data/portfolio'

const EXP_ICONS: Record<string, string> = {
  '文城教育學院':   '📚',
  '金格食品':       '🏢',
  '圓圓堂純米麻糬': '🍡',
  '達美樂披薩':     '🍕',
}

type EduHighlight = { label: string; items: readonly string[] }
type Edu = { school: string; dept: string; degree: string; period: string; badge: string; highlights: readonly EduHighlight[] }
type Exp = { role: string; company: string; period: string; desc: string; tags: readonly string[] }

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.2em',
  color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '2rem',
}

export default function AboutPage() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const education = siteData.education as unknown as Edu[]
  const experience = siteData.experience as unknown as Exp[]

  const PAD = mobile
    ? '2rem 1.5rem'
    : 'clamp(3rem,5vw,4.5rem) clamp(2rem,5vw,4rem) clamp(3rem,5vw,4.5rem) clamp(3rem,7vw,6rem)'

  return (
    <div style={{ paddingTop: '30px', minHeight: '50vh' }}>

      <div style={{ borderBottom: '1px solid var(--border)', padding: mobile ? '4rem 1.5rem 2rem' : '5rem clamp(2rem,5vw,5rem) 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>About</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, lineHeight: 1.05 }}>
          關於我 <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>/ Ken</em>
        </h1>
      </div>

      {/* Bio + Profile */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: '0rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: PAD }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '2rem' : '4rem', alignItems: 'start' }}>
            <div>
              <p style={SECTION_LABEL}>Profile</p>
              {([
                ['學校', siteData.institution],
                ['科系', siteData.title],
                ['Email', siteData.email],
                ['電話', siteData.phone],
                ['位置', siteData.location],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ borderTop: '1px solid var(--border)', padding: '0.9rem 0' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
                  {label === 'Email'
                    ? <a href={`mailto:${value}`} style={{ fontSize: '0.95rem', color: 'var(--accent)', textDecoration: 'none' }}>{value}</a>
                    : <p style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{value}</p>}
                </div>
              ))}
            </div>
            <div>
              <p style={SECTION_LABEL}>Biography</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {siteData.bio.map((p, i) => (
                  <p key={i} style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 2 }}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: PAD }}>
          <p style={SECTION_LABEL}>Education</p>
          <div style={{ position: 'relative', paddingLeft: mobile ? '1.25rem' : '2rem' }}>
            <div style={{ position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '1px', background: 'var(--border-2)' }} />
            {education.map((e, i) => (
              <div key={e.school} style={{
                position: 'relative',
                paddingBottom: i < education.length - 1 ? '5rem' : 0,
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
                gap: mobile ? '1rem' : '3rem',
                alignItems: 'start',
              }}>
                <div style={{
                  position: 'absolute', left: mobile ? '-1.25rem' : '-2rem', top: '7px',
                  width: '10px', height: '10px', borderRadius: '50%', zIndex: 1,
                  background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                  border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border-2)'}`,
                }} />
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{e.period}</span>
                    {e.badge && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.15em 0.7em', borderRadius: '2px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>{e.badge}</span>}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.3rem' }}>{e.school}</h3>
                  {e.dept && <p style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>{e.dept} — {e.degree}</p>}
                </div>
                {e.highlights.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2,1fr)', gap: '2.5rem 1.5rem', paddingTop: '0.1rem' }}>
                    {e.highlights.map(h => (
                      <div key={h.label}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 440, color: 'var(--text)', marginBottom: '0.45rem' }}>{h.label}</p>                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {h.items.map(item => (
                            <li key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                              <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.65rem', marginTop: '0.3rem' }}>▸</span>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-3)', lineHeight: 1.65 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: PAD }}>
          <p style={SECTION_LABEL}>Work Experience</p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2,1fr)', gap: '0 3rem' }}>
            {experience.map((e) => (
              <div key={e.company} style={{
                display: 'grid', gridTemplateColumns: '56px 1fr',
                gap: '1.25rem', padding: '1.75rem 0',
                borderTop: '1px solid var(--border)',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  background: 'var(--accent-light)', border: '1px solid rgba(59,91,219,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}>
                  {EXP_ICONS[e.company] ?? '💼'}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--text)' }}>{e.role}</h4>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>{e.company}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{e.period}</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
