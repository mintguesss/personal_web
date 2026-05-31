'use client'
import { useState, useEffect, useRef } from 'react'
import { siteData } from '@/data/portfolio'

function R({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const t = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(t)
    } else {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect() } }, { threshold: 0.06 })
      obs.observe(el)
      return () => obs.disconnect()
    }
  }, [delay])
  return <div ref={ref} style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>{children}</div>
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
  letterSpacing: '0.18em', color: 'var(--accent)',
  textTransform: 'uppercase' as const,
}
const PAD = 'clamp(1.5rem,5vw,4rem)'

type Cert = { name: string; issuer: string; date: string; image?: string; objectPosition?: string }
type Lang     = { name: string; level: string; scoreImage?: string }
type Interest = { emoji: string; name: string }

const ZoomIcon = ({ size = 13, stroke = 'var(--accent)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
)

export default function SkillsPage() {
  const [hovered, setHovered]   = useState<string | null>(null)
  const [modalImg, setModalImg] = useState<string | null>(null)
  const [mobile, setMobile]     = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const skillEntries   = Object.entries(siteData.skills)
  const certifications = siteData.certifications as unknown as Cert[]
  const languages      = siteData.languages      as unknown as Lang[]
  const interests      = siteData.interests      as unknown as Interest[]

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <R>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `clamp(2rem,4vw,3rem) ${PAD} 1.75rem` }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300 }}>
              Skills &amp; <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Profile</em>
            </h2>
          </div>
        </div>
      </R>

      {/* ── Skills grid ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `2rem ${PAD} 0` }}>
        <R><p style={{ ...MONO, marginBottom: '1.25rem' }}>Technologies</p></R>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0 3rem' }}>
          {skillEntries.map(([group, items], gi) => (
            <R key={group} delay={50 + gi * 60}>
              <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.85rem' }}>{group}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(items as readonly string[]).map(skill => {
                    const id = `${group}-${skill}`
                    const on = hovered === id
                    return (
                      <span key={skill}
                        onMouseEnter={() => setHovered(id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                          padding: '0.3em 0.85em', borderRadius: '3px', cursor: 'default',
                          transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                          background: on ? 'var(--accent)' : 'var(--bg-2)',
                          color: on ? '#fff' : 'var(--text-2)',
                          border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                        }}>{skill}</span>
                    )
                  })}
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>

      {/* ── Certifications ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `4rem ${PAD} 0` }}>
        <R><p style={{ ...MONO, marginBottom: '1.25rem' }}>Certifications</p></R>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: '1.25rem' }}>
          {certifications.map((c, ci) => (
            <R key={c.name} delay={60 + ci * 80}>
              <div
                onClick={() => c.image ? setModalImg(c.image) : undefined}
                style={{
                  border: '1px solid var(--border)', borderRadius: '8px',
                  background: 'var(--bg)', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  cursor: c.image ? 'pointer' : 'default',
                  transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => {
                  if (!c.image) return
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--accent)'
                  el.style.boxShadow = '0 8px 22px rgba(0,0,0,0.08)'
                  el.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--border)'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ width: '100%', height: mobile ? '120px' : '160px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                  {c.image
                    ? <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.objectPosition ?? 'center' }} />
                    : <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: '#ccc' }}>✦</span>
                  }
                </div>
                <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, position: 'relative' }}>
                  {c.image && <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.3 }}><ZoomIcon /></div>}
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase' }}>{c.issuer}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--text)', lineHeight: 1.35, flex: 1, paddingRight: '1.25rem' }}>{c.name}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{c.date}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>

      {/* ── Languages ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `4rem ${PAD} 0` }}>
        <R><p style={{ ...MONO, marginBottom: '1.25rem' }}>Languages</p></R>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {languages.map((l, i) => (
            <R key={l.name} delay={60 + i * 80}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderTop: i === 0 ? '1px solid var(--border)' : 'none', borderBottom: '1px solid var(--border)', gap: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--text)', minWidth: '100px' }}>{l.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-3)', flex: 1 }}>{l.level}</span>
                {l.scoreImage && (
                  <button onClick={() => setModalImg(l.scoreImage!)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid var(--border)', borderRadius: '3px', padding: '0.3em 0.7em', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', transition: 'color 0.15s, border-color 0.15s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'var(--accent)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'var(--muted)'; el.style.borderColor = 'var(--border)' }}
                  >
                    <ZoomIcon size={11} stroke="currentColor" />證書
                  </button>
                )}
              </div>
            </R>
          ))}
        </div>
      </div>

      {/* ── Interests ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `4rem ${PAD} clamp(4rem,6vw,6rem)` }}>
        <R><p style={{ ...MONO, marginBottom: '1.5rem' }}>Interests</p></R>
        <R delay={60}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap: '1px', background: 'var(--bg)' }}>
            {interests.map(item => (
              <div key={item.name} style={{ background: 'var(--bg)', padding: '1.75rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{item.emoji}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-2)', letterSpacing: '0.05em' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </R>
      </div>

      {modalImg && (
        <div onClick={() => setModalImg(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxHeight: '85vh', maxWidth: '90vw' }}>
            <img src={modalImg} alt="" style={{ maxHeight: '85vh', maxWidth: '90vw', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '4px', display: 'block' }} />
            <button onClick={() => setModalImg(null)} style={{ position: 'absolute', top: '-2.5rem', right: 0, background: 'none', border: 'none', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.1em' }}>ESC 關閉</button>
          </div>
        </div>
      )}
    </div>
  )
}
