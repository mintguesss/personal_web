'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

type Project = typeof siteData.projects[number]

function R({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}ms`; el.classList.add('reveal')
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.06 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return <div ref={ref}>{children}</div>
}

function FeatureImg({ src, label, onClick }: { src: string; label: string; onClick: () => void }) {
  const [failed, setFailed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const wrapStyle: React.CSSProperties = {
    borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)',
    aspectRatio: '16/9', background: 'var(--bg-2)', position: 'relative',
    cursor: 'pointer', transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
  }
  if (failed) return (
    <div style={{ ...wrapStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'default', transform: 'none', boxShadow: 'none' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>{label}</span>
    </div>
  )
  return (
    <div style={wrapStyle} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={src} alt={label} onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.03)' : 'scale(1)' }}
      />
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.22s ease', pointerEvents: 'none',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
    </div>
  )
}

type GiftData = {
  overview: string
  myRole: string
  features: readonly { title: string; desc: string; image: string }[]
}

export default function GiftRouletteDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const gr = project as unknown as Project & GiftData
  const [modalImg, setModalImg] = useState<string | null>(null)
  const pad = mobile ? '0 1.5rem' : '0 clamp(2rem,5vw,4.5rem)'
  const sec: React.CSSProperties = { padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }
  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontSize: mobile ? '1.1rem' : '1.2rem',
    fontWeight: 600, color: 'var(--text)', marginBottom: '1.1rem',
  }

  return (
    <div style={{ paddingTop: mobile ? '4.5rem' : '5rem', paddingBottom: '5rem' }}>

      {/* ── Header ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: mobile ? '2.5rem 1.5rem 2rem' : '3rem clamp(2rem,5vw,4.5rem) 2rem' }}>
        <R>
          <Link href="/projects" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >← 所有專案</Link>
        </R>
        <R delay={60}>
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0 1.1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>課程專題</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>已完成</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.1rem' }}>{project.subtitle} · {project.period}</p>
        </R>
        <R delay={150}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </R>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: pad }}>

        {/* 系統概述 */}
        <div style={sec}>
          <R><h2 style={secTitle}>系統概述</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{gr.overview}</p>
          </R>
        </div>

        {/* 功能介紹 */}
        <div style={sec}>
          <R><h2 style={secTitle}>功能介紹</h2></R>
          {(() => {
            let imgCount = 0
            return (
              <>
                {gr.features.map((f, i) => {
                  const isLeft = imgCount++ % 2 === 1
                  const cols = mobile ? '1fr' : '1fr 1fr'
                  const imgEl = <FeatureImg src={f.image} label={f.title} onClick={() => setModalImg(f.image)} />
                  const textEl = (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>{f.title}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 2 }}>{f.desc}</p>
                    </div>
                  )
                  return (
                    <R key={i} delay={50 + i * 40}>
                      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: mobile ? '1.25rem' : '3rem', padding: '2.5rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                        {mobile ? <>{textEl}{imgEl}</> : isLeft ? <>{imgEl}{textEl}</> : <>{textEl}{imgEl}</>}
                      </div>
                    </R>
                  )
                })}
              </>
            )
          })()}
        </div>

        <R delay={80}>
          <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link>
        </R>
      </div>

      {modalImg && (
        <div onClick={() => setModalImg(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxHeight: '88vh', maxWidth: '92vw' }}>
            <img src={modalImg} alt="" style={{ maxHeight: '88vh', maxWidth: '92vw', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
            <button onClick={() => setModalImg(null)} style={{
              position: 'absolute', top: '-2.5rem', right: 0,
              background: 'none', border: 'none', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.1em',
            }}>ESC 關閉</button>
          </div>
        </div>
      )}
    </div>
  )
}
