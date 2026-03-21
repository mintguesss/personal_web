'use client'
import { useState, useEffect } from 'react'
import { siteData } from '@/data/portfolio'

type Award = { year: string; title: string; org: string; category: string; image?: string; link?: string }

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
  letterSpacing: '0.18em', color: 'var(--accent)',
  textTransform: 'uppercase' as const,
}
const PAD = 'clamp(1.5rem,5vw,4rem)'

export default function SkillsAwardsPage() {
  const [hovered, setHovered]   = useState<string | null>(null)
  const [modalImg, setModalImg] = useState<string | null>(null)
  const [mobile, setMobile]     = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const skillEntries = Object.entries(siteData.skills)
  const awards       = siteData.awards as unknown as Award[]
  const research     = awards.filter(a => a.category === 'research')
  const competition  = awards.filter(a => a.category === 'competition')
  const school       = awards.filter(a => a.category === 'school')

  const ExternalIcon = ({ size = 13, stroke = 'var(--accent)' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
  const ZoomIcon = ({ size = 13, stroke = 'var(--accent)' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )

  const AwardCard = ({ a }: { a: Award }) => {
    const [imgHovered, setImgHovered] = useState(false)
    const clickable = !!(a.link || a.image)

    return (
      <div
        onClick={() => a.image && !a.link ? setModalImg(a.image) : undefined}
        style={{
          border: '1px solid var(--award1)', borderRadius: '15px',
          background: 'var(--bg)', overflow: 'hidden',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
        }}
        onMouseEnter={e => {
          if (!clickable) return
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border3)'
          el.style.boxShadow = '0 8px 22px rgba(0,0,0,0.08)'
          el.style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--award1)'
          el.style.boxShadow = 'none'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* 圖片區 */}
        <div
          style={{ position: 'relative', width: '100%', height: '300px', background: 'var(--bg-2)', overflow: 'hidden' }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          {a.image
            ? <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', transform: imgHovered ? 'scale(1.04)' : 'scale(1)' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--border-2)' }}>✦</span>
              </div>
          }
          {clickable && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: imgHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
            }}>
              {a.link ? <ExternalIcon size={22} stroke="#fff" /> : <ZoomIcon size={22} stroke="#fff" />}
            </div>
          )}
        </div>

        {/* 內容 */}
        <div style={{ padding: '1.1rem 1.25rem', position: 'relative' }}>
          {clickable && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.35 }}>
              {a.link ? <ExternalIcon /> : <ZoomIcon />}
            </div>
          )}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', fontWeight: 400, lineHeight: 1.4, color: 'var(--text)', marginBottom: '0.5rem', paddingRight: '1.5rem' }}>{a.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{a.org}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>{a.year}</span>
          </div>
          {a.link && (
            <a href={a.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ display: 'none' }} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* ══ Skills Header ══ */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `clamp(2.5rem,5vw,4rem) ${PAD} 2rem` }}>
          <p style={{ ...MONO, marginBottom: '0.6rem' }}>Expertise</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300 }}>
            Skills &amp; <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Technologies</em>
          </h1>
        </div>
      </div>

      {/* ══ Skills grid ══ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `2rem ${PAD} 0` }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0 3rem' }}>
          {skillEntries.map(([group, items]) => (
            <div key={group} style={{ padding: '1.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--text)', marginBottom: '1rem' }}>{group}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(items as readonly string[]).map((skill) => {
                  const id = `${group}-${skill}`
                  const on = hovered === id
                  return (
                    <span key={skill} onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} style={{
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
          ))}
        </div>
      </div>

      {/* ══ Awards Header ══ */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: '2.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `clamp(2rem,4vw,3rem) ${PAD} 1.75rem` }}>
          <p style={{ ...MONO, marginBottom: '0.6rem' }}>Recognition</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300 }}>
            Awards &amp; <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Honors</em>
          </h2>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `0 ${PAD} clamp(3rem,5vw,5rem)` }}>

          {/* Research */}
          <div style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
            <p style={{ ...MONO, fontSize: '0.78rem', marginBottom: '1.25rem' }}>Research</p>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2,1fr)', gap: '3rem' }}>
              {research.map(a => <AwardCard key={`${a.year}-${a.title}`} a={a} />)}
            </div>
          </div>

          {/* Competitions */}
          <div style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
            <p style={{ ...MONO, fontSize: '0.78rem', marginBottom: '1.25rem' }}>Competitions</p>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2,1fr)', gap: '3rem' }}>
              {competition.map(a => <AwardCard key={`${a.year}-${a.title}`} a={a} />)}
            </div>
          </div>

          {/* 在校榮譽 */}
          <div style={{ padding: '2.5rem 0' }}>
            <p style={{ ...MONO, fontSize: '0.78rem', marginBottom: '1.25rem' }}>在校榮譽</p>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '1rem 3rem' }}>
              {school.map((a) => {
                const clickable = !!(a.image || a.link)
                return (
                  <div
                    key={`${a.year}-${a.title}`}
                    onClick={() => a.image ? setModalImg(a.image) : undefined}
                    style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.9rem 0.75rem',
                      border: '1px solid var(--bg)',
                      borderRadius: '6px',
                      background: 'var(--bg)',
                      cursor: clickable ? 'pointer' : 'default',
                      transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!clickable) return
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'var(--accent)'
                      el.style.boxShadow = '0 8px 22px rgba(0,0,0,0.08)'
                      el.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'var(--bg)'
                      el.style.boxShadow = 'none'
                      el.style.transform = 'translateY(0)'
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '0.25rem', flexShrink: 0 }}>▸</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--text)' }}>{a.title}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{a.org}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>{a.year}</span>
                      </div>
                    </div>
                    {clickable && (
                      <div style={{ opacity: 0.35, flexShrink: 0, marginTop: '0.2rem' }}>
                        {a.link ? <ExternalIcon /> : <ZoomIcon />}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══ Modal ══ */}
      {modalImg && (
        <div
          onClick={() => setModalImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '600px', maxHeight: '80vh', width: '100%' }}>
            <img src={modalImg} alt="證書" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
            <button
              onClick={() => setModalImg(null)}
              style={{
                position: 'absolute', top: '-2.5rem', right: 0,
                background: 'none', border: 'none', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                cursor: 'pointer', letterSpacing: '0.1em',
              }}
            >ESC 關閉</button>
          </div>
        </div>
      )}

    </div>
  )
}