'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'
import { projectsDetail } from '@/data/projectsDetail'

type Project = typeof siteData.projects[number]

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

/* ── 輪播相簿 ── */
function ImageGallery({
  images,
  onZoom,
}: {
  images: readonly { path: string; caption: string }[]
  onZoom: (src: string) => void
}) {
  const [idx, setIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const slideDir = useRef<'right' | 'left'>('right')
  const newImgRef = useRef<HTMLImageElement>(null)

  const cur = images[idx]

  const goTo = (next: number, dir: 'right' | 'left') => {
    slideDir.current = dir
    setPrevIdx(idx)
    setIdx(next)
  }
  const prev = () => goTo((idx - 1 + images.length) % images.length, 'left')
  const next = () => goTo((idx + 1) % images.length, 'right')

  // 新圖掛載後以 JS 執行滑入動畫
  useEffect(() => {
    const el = newImgRef.current
    if (!el || prevIdx === null) return
    const startX = slideDir.current === 'right' ? '100%' : '-100%'
    el.style.transition = 'none'
    el.style.transform = `translateX(${startX})`
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = 'transform 0.38s ease'
      el.style.transform = 'translateX(0)'
    }))
  }, [idx])

  // 5 秒自動下一張，hover 暫停
  useEffect(() => {
    if (hovered) return
    const t = setInterval(() => goTo((idx + 1) % images.length, 'right'), 5000)
    return () => clearInterval(t)
  }, [hovered, idx, images.length])

  const NavBtn = ({ dir, onClick }: { dir: 'left' | 'right'; onClick: (e: React.MouseEvent) => void }) => (
    <button onClick={onClick} style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [dir === 'left' ? 'left' : 'right']: '0.75rem',
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2, transition: 'background 0.18s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'left' ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
      </svg>
    </button>
  )

  return (
    <div style={{ userSelect: 'none' }}>
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-2)', cursor: 'pointer', aspectRatio: '4/3' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onZoom(cur.path)}
      >
        {/* 舊圖：留在原位當底 */}
        {prevIdx !== null && (
          <img
            src={images[prevIdx].path}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        {/* 新圖：從側邊滑入蓋上去 */}
        <img
          key={idx}
          ref={newImgRef}
          src={cur.path}
          alt={cur.caption}
          onError={() => {}}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* 放大鏡 overlay */}
        <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.22s ease', pointerEvents: 'none',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>

        {images.length > 1 && (
          <>
            <NavBtn dir="left" onClick={e => { e.stopPropagation(); prev() }} />
            <NavBtn dir="right" onClick={e => { e.stopPropagation(); next() }} />
          </>
        )}
      </div>

      {/* caption + dots */}
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', flex: 1, lineHeight: 1.5 }}>{cur.caption}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i, i > idx ? 'right' : 'left')} style={{
              width: i === idx ? '20px' : '6px', height: '6px',
              borderRadius: '99px', border: 'none', cursor: 'pointer',
              background: i === idx ? 'var(--accent)' : 'var(--border-2)',
              transition: 'all 0.2s', padding: 0,
            }} />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>{idx + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  )
}

export default function LeaveSystemDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const ls = projectsDetail['leave-system']
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {ls.overview.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{p}</p>
              ))}
            </div>
          </R>
        </div>

        {/* 系統展示 */}
        <div style={sec}>
          <R><h2 style={secTitle}>系統展示</h2></R>
          <R delay={60}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <ImageGallery images={ls.galleryImages} onZoom={setModalImg} />
            </div>
          </R>
        </div>

        {/* 核心功能 */}
        <div style={sec}>
          <R><h2 style={secTitle}>核心功能</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0 3rem' }}>
            {ls.features.map((f, i) => (
              <R key={i} delay={40 + i * 50}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--border-2)', flexShrink: 0, lineHeight: 1, marginTop: '0.1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ fontSize: '0.93rem', color: 'var(--text-2)', lineHeight: 1.85 }}>{f}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 個人貢獻 */}
        <div style={sec}>
          <R><h2 style={secTitle}>個人貢獻</h2></R>
          <R delay={60}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {ls.myRole.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{p}</p>
              ))}
            </div>
          </R>
        </div>

        <R delay={80}>
          <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link>
        </R>
      </div>

      {/* ── Modal ── */}
      {modalImg && (
        <div onClick={() => setModalImg(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxHeight: '90vh', maxWidth: '94vw' }}>
            <img src={modalImg} alt="" style={{ maxHeight: '90vh', maxWidth: '94vw', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
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
