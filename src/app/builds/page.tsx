'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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

function BuildCard({ b, mobile, idx }: { b: typeof siteData.builds[number]; mobile: boolean; idx: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/builds/${b.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '415px 1fr',
          background: 'var(--bg)',
          transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
          borderColor: hovered ? 'var(--border-2)' : 'var(--border)',
          boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* 圖片區 */}
        <div style={{ width: '100%', height: mobile ? undefined : '100%', aspectRatio: mobile ? '16/9' : undefined, overflow: 'hidden', background: 'var(--bg-2)', position: 'relative' }}>
          {b.image ? (
            <img
              src={b.image}
              alt={b.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          ) : null}
          <div style={{
            position: 'absolute', top: '0.85rem', left: '0.85rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.2em 0.75em', borderRadius: '99px',
            background: 'rgba(20,20,20,0.7)', color: '#fff', backdropFilter: 'blur(4px)',
          }}>{b.group}</div>
        </div>

        {/* 內容區 */}
        <div style={{ padding: mobile ? '1.5rem' : '2.25rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--border-2)', lineHeight: 1, flexShrink: 0 }}>{String(idx + 1).padStart(2, '0')}</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.2rem' : '1.45rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '0.35rem', color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'color 0.2s' }}>{b.title}</h3>
              <p style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{b.subtitle} · {b.period}</p>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '640px' }}>{b.description}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.4rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(b.tags as readonly string[]).slice(0, mobile ? 3 : 5).map(t => <span key={t} className="tag" style={{ fontSize: '0.66rem' }}>{t}</span>)}
            </div>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 500, color: hovered ? 'var(--accent)' : 'var(--muted)', transition: 'color 0.2s, transform 0.2s', transform: hovered ? 'translateX(4px)' : 'none', flexShrink: 0 }}>查看 →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BuildsPage() {
  const builds = [...siteData.builds]
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <R>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Builds</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '0.5rem' }}>
            作品 <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>& 實作</em>
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>個人開發 — 從零打造的全端應用</p>
        </R>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {builds.map((b, i) => (
            <R key={b.id} delay={100 + i * 70}>
              <BuildCard b={b} mobile={mobile} idx={i} />
            </R>
          ))}
        </div>
      </div>
    </div>
  )
}
