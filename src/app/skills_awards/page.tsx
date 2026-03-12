'use client'
import { useState } from 'react'
import { siteData } from '@/data/portfolio'

type Award = { year: string; title: string; org: string; category: string; image?: string; link?: string }

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
  letterSpacing: '0.18em', color: 'var(--accent)',
  textTransform: 'uppercase' as const,
}
const PAD = 'clamp(1.5rem,5vw,4rem)'

export default function SkillsAwardsPage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [modalImg, setModalImg] = useState<string | null>(null)

  const skillEntries = Object.entries(siteData.skills)
  const awards       = siteData.awards as unknown as Award[]
  const research     = awards.filter(a => a.category === 'research')
  const competition  = awards.filter(a => a.category === 'competition')
  const school       = awards.filter(a => a.category === 'school')

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

      {/* ══ Skills 兩欄 ══ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `2rem ${PAD} 0` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 3rem' }}>
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

          {/* Research + Competition 卡片，點直接跳連結 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Research',     items: research },
              { label: 'Competitions', items: competition },
            ].map(({ label, items }) => (
              <div key={label}>
                <p style={{ ...MONO, marginBottom: '1.25rem' }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((a) => {
                    const Wrapper = a.link ? 'a' : 'div'
                    const wrapperProps = a.link
                      ? { href: a.link, target: '_blank', rel: 'noreferrer', style: { textDecoration: 'none' } }
                      : {}
                    return (
                      <Wrapper key={`${a.year}-${a.title}`} {...wrapperProps}>
                        <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: a.image ? '100px 1fr' : '1fr',
                              gap: '1rem',
                              padding: '1.1rem',
                              border: '1px solid #d4d4d4',
                              borderRadius: '6px',
                              background: 'var(--bg)',
                              cursor: a.link ? 'pointer' : 'default',
                              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                            }}
                            onMouseEnter={e => {
                              if (!a.link) return
                              const el = e.currentTarget as HTMLDivElement
                              el.style.borderColor = 'var(--accent)'
                              el.style.boxShadow = '0 8px 22px rgba(0,0,0,0.08)'
                              el.style.transform = 'translateY(-3px)'
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLDivElement
                              el.style.borderColor = '#9e9d9d'
                              el.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
                              el.style.transform = 'translateY(0)'
                            }}
                          >
                          {/* 左側圖片 */}
                          {a.image && (
                            <div style={{ width: '100px', height: '80px', borderRadius: '3px', overflow: 'hidden', background: 'var(--bg-2)', flexShrink: 0 }}>
                              <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                          {/* 右側文字 */}
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 400, lineHeight: 1.4, color: 'var(--text)', marginBottom: '0.4rem' }}>{a.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{a.org}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)' }}>{a.year}</span>
                                {a.link && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>↗</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Wrapper>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 在校榮譽 列點，有圖的點開 modal */}
          <div style={{ padding: '2.5rem 0' }}>
            <p style={{ ...MONO, marginBottom: '1.25rem' }}>在校榮譽</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 3rem' }}>
              {school.map((a) => (
                <div
                  key={`${a.year}-${a.title}`}
                  onClick={() => a.image ? setModalImg(a.image) : undefined}
                  style={{
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    padding: '0.9rem 0', borderBottom: '1px solid var(--border)',
                    cursor: a.image ? 'pointer' : 'default',
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: '0.65rem', marginTop: '0.3rem', flexShrink: 0 }}>▸</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--text)' }}>{a.title}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.15rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{a.org}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)' }}>{a.year}</span>
                    </div>
                  </div>
                  {a.image && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', flexShrink: 0, marginTop: '0.3rem' }}>證書 ↗</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══ Modal：只有圖片 ══ */}
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