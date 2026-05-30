'use client'
import { useState, useEffect, useRef } from 'react'
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

type NscData = {
  status: string
  researchBackground: string
  researchSummary: string
  researchProblems: { title: string; desc: string; color: string }[]
  metrics: { label: string; sub: string; before: string; after: string; badge: string; barVal: number; color: string }[]
  metricsNote: string
  pipeline: { step: string; title: string; desc: string; techs: readonly string[]; color: string }[]
  contributions: readonly string[]
  documents: readonly { title: string; path: string; filename: string }[]
}

export default function NSCDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const nsc = project as unknown as Project & NscData
  const [bars, setBars] = useState(nsc.metrics.map(() => 0))
  useEffect(() => {
    const t = setTimeout(() => setBars(nsc.metrics.map(m => m.barVal)), 500)
    return () => clearTimeout(t)
  }, [])

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
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >← 所有專案</Link>
        </R>
        <R delay={60}>
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0 1.1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>研究</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--bg-2)', color: 'var(--text-3)', border: '1px solid var(--border-2)' }}>{(project as any).status ?? '進行中'}</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '1rem' }}>
            {project.title}
          </h1>
        </R>
        <R delay={150}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.5rem' }}>
            {[
              ['計畫編號', '114-2813-C-030-031-E'],
              ['計畫期間', project.period],
              ['指導教授', '廖建翔'],
            ].map(([k, v]) => (
              <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--text-3)' }}>{k}：</span>{v}
              </span>
            ))}
          </div>
        </R>
        <R delay={190}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '1.1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {nsc.documents.map(doc => (
                <a key={doc.title} href={doc.path} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500,
                  padding: '0.5em 1.1em 0.5em 0.85em', borderRadius: '7px',
                  textDecoration: 'none', color: 'var(--text-2)', background: 'var(--bg)',
                  border: '1px solid var(--border-2)', transition: 'all 0.18s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  {doc.title}
                </a>
              ))}
            </div>
          </div>
        </R>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: pad }}>

        {/* 研究背景 */}
        <div style={sec}>
          <R><h2 style={secTitle}>研究背景</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2, marginBottom: '1.75rem' }}>{nsc.researchBackground}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>研究問題</p>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1px', background: 'var(--border)' }}>
              {nsc.researchProblems.map(({ title, desc, color }) => (
                <div key={title} style={{ background: 'var(--bg)', padding: '1.25rem 1.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: color + '99', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-3)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </R>
        </div>

        {/* 研究摘要 */}
        <div style={sec}>
          <R><h2 style={secTitle}>研究摘要</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{nsc.researchSummary}</p>
          </R>
        </div>

        {/* 核心成果 */}
        <div style={sec}>
          <R><h2 style={secTitle}>核心成果</h2></R>
          <R delay={40}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '1.75rem' }}>
              {nsc.metrics.map((m, i) => (
                <div key={m.label}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>{m.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-3)', lineHeight: 1 }}>{m.before}</span>
                    <span style={{ color: 'var(--border-2)' }}>→</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 600, color: m.color, lineHeight: 1 }}>{m.after}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#059669', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '0.2em 0.75em', borderRadius: '99px', fontWeight: 600 }}>{m.badge}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ height: '100%', width: `${bars[i]}%`, background: `linear-gradient(90deg,${m.color}88,${m.color})`, borderRadius: '99px', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>{m.sub}</p>
                </div>
              ))}
            </div>
          </R>
          <R delay={80}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{nsc.metricsNote}</p>
          </R>
        </div>

        {/* 研究方法 */}
        <div style={sec}>
          <R>
            <h2 style={secTitle}>研究方法</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.75rem' }}>
              影像輸入 → 預處理 → OCR → 語意篩選 → 分類輸出
            </p>
          </R>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {nsc.pipeline.map((step, i) => (
              <R key={step.step} delay={60 + i * 70}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: mobile ? '1fr' : '160px 1fr',
                  gap: mobile ? '0.5rem' : '2.5rem',
                  padding: '1.75rem 0',
                  borderBottom: i < nsc.pipeline.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'start',
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: step.color, display: 'block', marginBottom: '0.35rem', lineHeight: 1 }}>{step.step}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{step.title}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.95, marginBottom: '0.85rem' }}>{step.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {step.techs.map(t => (
                        <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.2em 0.75em', borderRadius: '3px', background: step.color + '12', color: step.color, border: `1px solid ${step.color}28` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 主要貢獻 */}
        <div style={sec}>
          <R><h2 style={secTitle}>主要貢獻</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0 3rem' }}>
            {nsc.contributions.map((h, i) => (
              <R key={i} delay={40 + i * 50}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--border-2)', lineHeight: 1, flexShrink: 0, minWidth: '2rem', userSelect: 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontSize: '0.93rem', color: 'var(--text-2)', lineHeight: 1.85, paddingTop: '0.15rem' }}>{h}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 計畫資訊 */}
        <div style={{ padding: '2.5rem 0' }}>
          <R>
            <h2 style={{ ...secTitle, marginBottom: '1.25rem' }}>計畫資訊</h2>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1.5rem 2rem' }}>
              {[
                { k: '指導教授', v: '廖建翔' },
                { k: '所屬單位', v: '輔仁大學 資管系' },
                { k: '計畫期間', v: project.period },
                { k: '計畫狀態', v: nsc.status },
              ].map(({ k, v }) => (
                <div key={k} style={{ borderTop: '2px solid var(--border-2)', paddingTop: '0.75rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{k}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
          </R>
        </div>

        <R delay={80}>
          <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link>
        </R>
      </div>
    </div>
  )
}
