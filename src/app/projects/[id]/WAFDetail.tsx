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

export default function WAFDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const waf = projectsDetail['waf']
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>研究</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(234,179,8,0.08)', color: '#a16207', border: '1px solid rgba(234,179,8,0.3)' }}>研究計畫</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--bg-2)', color: 'var(--text-3)', border: '1px solid var(--border-2)' }}>{waf.status}</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3.2vw,2.4rem)', fontWeight: 700, lineHeight: 1.25, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {project.subtitle}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>{project.title} · {project.period}</p>
        </R>
        <R delay={160}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {waf.documents.map(doc => (
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
          <R><h2 style={secTitle}>研究背景與動機</h2></R>
          <R delay={60}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {waf.background.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{p}</p>
              ))}
            </div>
          </R>
        </div>

        {/* 研究問題 */}
        <div style={sec}>
          <R><h2 style={secTitle}>研究問題</h2></R>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {waf.researchQuestions.map((q, i) => (
              <R key={i} delay={50 + i * 60}>
                <div style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: '1rem', padding: '1.1rem 0', borderBottom: '1px solid var(--border)', alignItems: 'start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', paddingTop: '0.2rem' }}>Q{i + 1}</span>
                  <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 1.9 }}>{q}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 研究方法 */}
        <div style={sec}>
          <R><h2 style={secTitle}>研究方法</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{waf.methodology}</p>
          </R>
        </div>

        {/* 研究步驟 */}
        <div style={sec}>
          <R>
            <h2 style={secTitle}>研究步驟</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.75rem' }}>
              資料蒐集 → 特徵工程 → 增量學習 → XAI 規則建議 → 系統驗證
            </p>
          </R>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {waf.researchSteps.map((step, i) => (
              <R key={step.step} delay={60 + i * 70}>
                <div style={{
                  display: 'grid', gridTemplateColumns: mobile ? '1fr' : '160px 1fr',
                  gap: mobile ? '0.5rem' : '2.5rem', padding: '1.75rem 0',
                  borderBottom: i < waf.researchSteps.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'start',
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: step.color, display: 'block', marginBottom: '0.35rem', lineHeight: 1 }}>{step.step}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{step.title}</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.95, paddingTop: mobile ? '0' : '0.1rem' }}>{step.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 預期成果 */}
        <div style={sec}>
          <R><h2 style={secTitle}>預期成果</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{waf.expectedResults}</p>
          </R>
        </div>

        {/* 參考文獻 */}
        <div style={{ padding: '2.5rem 0' }}>
          <R><h2 style={{ ...secTitle, marginBottom: '1.25rem' }}>參考文獻</h2></R>
          <R delay={50}>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {waf.references.map((ref, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', flexShrink: 0, marginTop: '0.15rem' }}>[{i + 1}]</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', lineHeight: 1.75 }}>{ref}</p>
                </li>
              ))}
            </ol>
          </R>
        </div>

        <R delay={80}>
          <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link>
        </R>
      </div>
    </div>
  )
}
