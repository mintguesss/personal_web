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
        opacity: hovered ? 1 : 0, transition: 'opacity 0.22s ease',
        pointerEvents: 'none',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
    </div>
  )
}

export default function FraudRadarDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const fr = projectsDetail['fraud-radar']
  const [modalImg, setModalImg] = useState<string | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)
  const [posterHovered, setPosterHovered] = useState(false)
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>畢業專題</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>已完成</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '1rem' }}>
            {project.title}
          </h1>
        </R>
        <R delay={150}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.5rem', marginBottom: '0.5rem' }}>
            {[
              ['專題期間', project.period],
              ['指導教授', fr.advisor],
              ['所屬單位', '輔仁大學 資訊管理學系'],
              ['團隊人數', `${fr.teamSize} 人`],
            ].map(([k, v]) => (
              <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--text-3)' }}>{k}：</span>{v}
              </span>
            ))}
          </div>
        </R>
        <R delay={180}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {fr.awards.map(a => (
              <span key={a} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.2em 0.8em', borderRadius: '99px', background: 'rgba(234,179,8,0.1)', color: '#a16207', border: '1px solid rgba(234,179,8,0.3)' }}>🏆 {a}</span>
            ))}
          </div>
        </R>
        <R delay={210}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500,
                padding: '0.5em 1.1em 0.5em 0.85em', borderRadius: '7px',
                textDecoration: 'none', color: 'var(--text-2)', background: 'var(--bg)',
                border: '1px solid var(--border-2)', transition: 'all 0.18s', flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Google Drive ↗
              </a>
            )}
          </div>
        </R>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: pad }}>

        {/* 系統概覽 */}
        <div style={sec}>
          <R><h2 style={secTitle}>系統概覽</h2></R>
          <R delay={60}>
            <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{fr.overview}</p>
          </R>
        </div>

        {/* 核心功能 */}
        <div style={sec}>
          <R><h2 style={secTitle}>核心功能</h2></R>
          {(() => {
            const noImg = fr.features.filter(f => !f.image)
            let imgCount = 0
            return (
              <>
                {fr.features.map((f, i) => {
                  if (!f.image) return null
                  const isLeft = imgCount++ % 2 === 1
                  const cols = mobile ? '1fr' : '1fr 1fr'
                  const imgEl = <FeatureImg src={f.image} label={f.title} onClick={() => setModalImg(f.image)} />
                  const textEl = (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{f.title}</h3>
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
                {noImg.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0 3rem' }}>
                    {fr.features.map((f, i) => {
                      if (f.image) return null
                      return (
                        <R key={i} delay={60 + i * 40}>
                          <div style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.45rem' }}>{f.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                              {f.desc.split('\n\n').map((p, pi) => (
                                <p key={pi} style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.8 }}>{p}</p>
                              ))}
                            </div>
                          </div>
                        </R>
                      )
                    })}
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* 辨識流程 */}
        <div style={sec}>
          <R>
            <h2 style={secTitle}>辨識流程</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.75rem' }}>
              輸入判斷 → 爬蟲 / OCR → 165 黑名單 → BERT 相似度 → 情緒分析 → 關鍵字萃取
            </p>
          </R>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {fr.detectionPipeline.map((step, i) => (
              <R key={step.step} delay={60 + i * 70}>
                <div style={{
                  display: 'grid', gridTemplateColumns: mobile ? '1fr' : '160px 1fr',
                  gap: mobile ? '0.5rem' : '2.5rem', padding: '1.75rem 0',
                  borderBottom: i < fr.detectionPipeline.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'start',
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

        {/* 個人貢獻 */}
        <div style={sec}>
          <R>
            <button
              onClick={() => setRoleOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginBottom: roleOpen ? '1.5rem' : 0,
              }}
            >
              <h2 style={{ ...secTitle, marginBottom: 0 }}>個人貢獻</h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transition: 'transform 0.25s', transform: roleOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {roleOpen && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {fr.myRole.split('\n\n').map((para, i) => (
                    <p key={i} style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }}>{para}</p>
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>{fr.mobileNote}</p>
              </>
            )}
          </R>
        </div>


        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' ,marginTop: '1.5rem'}}>
          <R><Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>← 回到專案列表</Link></R>
          {project.link && (
            <R delay={60}>
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>查看專案 ↗</a>
            </R>
          )}
        </div>
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
