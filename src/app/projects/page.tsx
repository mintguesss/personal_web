'use client'
import { useState, useEffect, useRef } from 'react'
import { siteData } from '@/data/portfolio'

function R({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}ms`; el.classList.add('reveal')
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return <div ref={ref}>{children}</div>
}

type Filter = 'all' | 'project' | 'research'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const all = [...siteData.projects]
  const filtered = filter === 'all' ? all : all.filter(p => p.type === filter)

  return (
    <div style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <R>
          <p className="section-label">Projects & Research</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.1 }}>專案 & 研究</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.97rem' }}>涵蓋 AI 研究、全端開發與課程專題</p>
        </R>

        <R delay={80}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {([['all','全部'], ['project','專案'], ['research','研究']] as [Filter,string][]).map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500,
                padding: '0.45em 1.2em', borderRadius: '99px', cursor: 'pointer', transition: 'all 0.2s',
                background: filter === val ? 'var(--accent)' : 'var(--surface)',
                color: filter === val ? '#fff' : 'var(--text-2)',
                border: filter === val ? '1.5px solid var(--accent)' : '1.5px solid var(--border-2)',
              }}>{label}</button>
            ))}
          </div>
        </R>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
          {filtered.map((p, i) => (
            <R key={p.id} delay={100 + i * 60}>
              <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.2rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{p.subtitle} · {p.period}</p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '0.2em 0.8em', borderRadius: '99px', whiteSpace: 'nowrap', flexShrink: 0,
                    background: p.type === 'research' ? 'rgba(16,185,129,0.08)' : 'var(--accent-light)',
                    color: p.type === 'research' ? '#059669' : 'var(--accent)',
                    border: p.type === 'research' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(59,91,219,0.2)',
                  }}>{p.type === 'research' ? '研究' : '專案'}</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.8 }}>{p.description}</p>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {p.highlights.map(h => (
                    <li key={h} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>▸</span>{h}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>查看 →</a>}
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </div>
  )
}
