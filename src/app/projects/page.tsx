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

type Filter = 'all' | 'project' | 'research'

function ProjectCard({ p }: { p: typeof siteData.projects[number] }) {
  const [hovered, setHovered] = useState(false)
  const isResearch = p.type === 'research'

  return (
    <Link href={`/projects/${p.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', height: '100%',
          background: 'var(--bg)',
          transition: 'border-color 0.22s, transform 0.22s',
          borderColor: hovered ? 'var(--border-2)' : 'var(--border)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* 圖片區 */}
        <div style={{
          width: '100%', aspectRatio: '16/9', overflow: 'hidden',
          background: 'var(--bg-2)', flexShrink: 0, position: 'relative',
        }}>
          {(p as any).image ? (
            <img
              src={(p as any).image}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          ) : null}
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.2em 0.75em', borderRadius: '99px',
            background: 'rgba(20,20,20,0.7)',
            color: '#fff', backdropFilter: 'blur(4px)',
          }}>{isResearch ? '研究' : '專案'}</div>
        </div>

        {/* 內容區 */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600,
              lineHeight: 1.3, marginBottom: '0.2rem', color: 'var(--text)',
            }}>{p.title}</h3>
            <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
              {p.subtitle} · {p.period}
            </p>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.8, flex: 1 }}>{p.description}</p>

          <div style={{ paddingTop: '0.6rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {(p.tags as readonly string[]).slice(0, 3).map(t => <span key={t} className="tag" style={{ fontSize: '0.65rem' }}>{t}</span>)}
            </div>
            <span style={{
              fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
              color: hovered ? 'var(--accent)' : 'var(--muted)', transition: 'color 0.2s',
            }}>查看 →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const all = [...siteData.projects]
  const filtered = filter === 'all' ? all : all.filter(p => p.type === filter)

  return (
    <div style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <R>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Projects & Research</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '0.5rem' }}>
            專案 <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>& 研究</em>
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>涵蓋 AI 研究、全端開發與課程專題</p>
        </R>

        <R delay={80}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {([['all','全部'], ['project','專案'], ['research','研究']] as [Filter,string][]).map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500,
                padding: '0.45em 1.2em', borderRadius: '99px', cursor: 'pointer', transition: 'all 0.2s',
                background: filter === val ? 'var(--accent)' : 'transparent',
                color: filter === val ? '#fff' : 'var(--text-3)',
                border: filter === val ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
              }}>{label}</button>
            ))}
          </div>
        </R>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '2rem' }}>
          {filtered.map((p, i) => (
            <R key={p.id} delay={100 + i * 55}>
              <ProjectCard p={p} />
            </R>
          ))}
        </div>
      </div>
    </div>
  )
}
