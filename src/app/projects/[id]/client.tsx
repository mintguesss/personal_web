'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'
import NSCDetail from './NSCDetail'
import FraudRadarDetail from './FraudRadarDetail'
import WAFDetail from './WAFDetail'
import GiftRouletteDetail from './GiftRouletteDetail'
import LeaveSystemDetail from './LeaveSystemDetail'

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

/* ─── Generic fallback ────────────────────────────────────────── */
function GenericDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const pad = mobile ? '0 1.5rem' : '0 clamp(2rem,5vw,4.5rem)'
  const isResearch = project.type === 'research'

  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg,var(--bg-2) 0%,var(--bg) 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: mobile ? '4rem 1.5rem 3rem' : '5.5rem clamp(2rem,5vw,4.5rem) 3.5rem' }}>
          <R>
            <Link href="/projects" className="breadcrumb-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>← 所有專案</Link>
          </R>
          <R delay={60}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '0.25em 0.9em', borderRadius: '99px', fontWeight: 500,
                background: isResearch ? 'rgba(16,185,129,0.1)' : 'var(--accent-light)',
                color: isResearch ? '#059669' : 'var(--accent)',
                border: isResearch ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(59,91,219,0.2)',
              }}>{isResearch ? '研究' : '專案'}</span>
            </div>
          </R>
          <R delay={120}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,5vw,4.2rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '0.75rem', color: 'var(--text)' }}>
              {project.title}
            </h1>
          </R>
          <R delay={180}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              {project.subtitle} · {project.period}
            </p>
          </R>
          <R delay={240}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </R>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: pad }}>
        <div style={{ padding: mobile ? '2.5rem 0' : '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <R><p className="section-label">專案說明</p></R>
          <R delay={80}>
            <div className="card card-accent-bg" style={{ padding: mobile ? '1.5rem' : '2rem 2.5rem' }}>
              <p className="prose">{project.description}</p>
            </div>
          </R>
        </div>
        <div style={{ padding: mobile ? '2.5rem 0' : '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <R><p className="section-label">功能亮點</p></R>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
            {(project.highlights as readonly string[]).map((h, i) => (
              <R key={h} delay={50 + i * 60}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.9rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.75rem', marginTop: '0.2rem' }}>▸</span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{h}</span>
                </div>
              </R>
            ))}
          </div>
        </div>
        <div style={{ padding: mobile ? '2.5rem 0' : '3.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <R>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem 1.5rem', background: 'var(--accent-light)', border: '1px solid rgba(59,91,219,0.18)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '1.1rem' }}>📝</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>詳細技術說明與成果展示即將更新</p>
            </div>
          </R>
        </div>
        <div style={{ padding: mobile ? '2rem 0 0' : '3rem 0 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <R><Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link></R>
          {project.link && (
            <R delay={80}>
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>查看專案 ↗</a>
            </R>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Router ──────────────────────────────────────────────────── */
export default function ProjectDetailClient({ id }: { id: string }) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const project = (siteData.projects as readonly Project[]).find(p => p.id === id)
  if (!project) return (
    <div style={{ paddingTop: '8rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
      找不到此專案
    </div>
  )

  if (id === 'nsc') return <NSCDetail project={project} mobile={mobile} />
  if (id === 'fraud-radar') return <FraudRadarDetail project={project} mobile={mobile} />
  if (id === 'waf') return <WAFDetail project={project} mobile={mobile} />
  if (id === 'gift-roulette') return <GiftRouletteDetail project={project} mobile={mobile} />
  if (id === 'leave-system') return <LeaveSystemDetail project={project} mobile={mobile} />
  return <GenericDetail project={project} mobile={mobile} />
}
