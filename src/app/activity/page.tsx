'use client'
import { useState, useEffect } from 'react'
import { siteData } from '@/data/portfolio'

type Activity = { title: string; date: string; location: string; desc: string; image?: string }

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
  letterSpacing: '0.18em', color: 'var(--accent)',
  textTransform: 'uppercase' as const,
}
const PAD = 'clamp(1.5rem,5vw,4rem)'

export default function ActivityPage() {
  const [mobile, setMobile]     = useState(false)
  const [modalImg, setModalImg] = useState<string | null>(null)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const activities = siteData.activities as unknown as Activity[]

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `clamp(2.5rem,5vw,4rem) ${PAD} 2rem` }}>
          <p style={{ ...MONO, marginBottom: '0.6rem' }}>Life</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300 }}>
            Activity &amp; <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Events</em>
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `2.5rem ${PAD} clamp(3rem,5vw,5rem)` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(2,1fr)',
          gap: '1.5rem',
        }}>
          {activities.map((a, i) => (
            <div
              key={i}
              onClick={() => a.image ? setModalImg(a.image) : undefined}
              style={{
                border: '1px solid var(--border)', borderRadius: '6px',
                background: 'var(--bg)', overflow: 'hidden',
                cursor: a.image ? 'pointer' : 'default',
                transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
              }}
              onMouseEnter={e => {
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
              {/* 圖片區 */}
              {a.image ? (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: 'var(--bg-2)' }}>
                  <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  width: '100%', height: '200px', background: 'var(--bg-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--border-2)' }}>✦</span>
                </div>
              )}

              {/* 內容 */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.5rem' }}>{a.title}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>{a.date}</span>
                  {a.location && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>📍 {a.location}</span>}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{a.desc}</p>
                {a.image && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', marginTop: '0.75rem' }}>查看照片 →</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalImg && (
        <div
          onClick={() => setModalImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '700px', maxHeight: '85vh', width: '100%' }}>
            <img src={modalImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
            <button onClick={() => setModalImg(null)} style={{
              position: 'absolute', top: '-2.5rem', right: 0,
              background: 'none', border: 'none', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              cursor: 'pointer', letterSpacing: '0.1em',
            }}>ESC 關閉</button>
          </div>
        </div>
      )}

    </div>
  )
}