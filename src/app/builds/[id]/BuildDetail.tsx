'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'
import { buildsDetail } from '@/data/buildsDetail'

type Build = typeof siteData.builds[number]

/* 架構圖節點上色：用戶端 / 部署平台 = 深藍；後端 / 資料 / 模型服務 = 深綠 */
const ARCH_BLUE = '#3b6fd4'
const ARCH_GREEN = '#2f9e63'
const ARCH_COLORS: [string, string][] = [
  ['手機 / 電腦瀏覽器（PWA）', ARCH_BLUE],
  ['Vercel', ARCH_BLUE],
  ['前端', ARCH_BLUE],
  ['單一鏡頭 frame', ARCH_BLUE],
  ['Firebase', ARCH_GREEN],
  ['Firestore', ARCH_GREEN],
  ['Cloudinary', ARCH_GREEN],
  ['後端 / 資料', ARCH_GREEN],
  ['Supabase', ARCH_GREEN],
  ['外部資料源', ARCH_GREEN],
  ['Yahoo Finance', ARCH_GREEN],
  ['TWSE', ARCH_GREEN],
  ['MediaPipe', ARCH_GREEN],
  ['YOLOv11', ARCH_GREEN],
  ['ViT', ARCH_GREEN],
]

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

const GhIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
)
const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
)

function CtaButtons({ links }: { links: { github?: string; demo?: string; download?: string } }) {
  const items: { label: string; href: string; icon: React.ReactNode }[] = []
  if (links.github) items.push({ label: 'GitHub', href: links.github, icon: <GhIcon /> })
  if (links.demo) items.push({ label: 'Live Demo', href: links.demo, icon: <LinkIcon /> })
  if (links.download) items.push({ label: '下載', href: links.download, icon: <LinkIcon /> })

  if (items.length === 0) {
    return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', padding: '0.5em 0' }}>連結即將提供</span>
  }
  return (
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
      {items.map((it) => {
        const solid = it.label === 'GitHub'  // GitHub = 實心主按鈕（藍稍淡）；其他 = 淡藍次按鈕
        return (
        <a key={it.label} href={it.href} target="_blank" rel="noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 500,
          padding: '0.55em 1.2em', borderRadius: '7px', textDecoration: 'none',
          color: solid ? '#fff' : 'var(--accent)',
          background: solid ? '#5470e0' : 'var(--accent-light)',
          border: solid ? '1px solid #5470e0' : '1px solid rgba(59,91,219,0.25)',
          transition: 'all 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = solid ? 'var(--accent)' : 'rgba(59,91,219,0.16)' }}
          onMouseLeave={e => { e.currentTarget.style.background = solid ? '#5470e0' : 'var(--accent-light)' }}
        >{it.icon}{it.label}</a>
        )
      })}
    </div>
  )
}

/* 重點卡片：hover 顯色、點擊展開第二層（怎麼做到的） */
function HighlightCard({ h, mobile }: { h: { title: string; desc: string; detail: string; color: string }; mobile: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpen(o => !o)}
      style={{
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: mobile ? '1.15rem' : '1.35rem',
        background: 'var(--bg)', cursor: 'pointer', position: 'relative',
        minHeight: mobile ? undefined : '150px',
        borderTop: `3px solid ${h.color}`,
        transition: 'transform 0.22s, box-shadow 0.22s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered || open ? 'var(--shadow-hover)' : 'var(--shadow)',
      }}
    >
      <span style={{
        position: 'absolute', top: mobile ? '0.8rem' : '0.95rem', right: mobile ? '0.85rem' : '1.05rem',
        fontFamily: 'var(--font-mono)', fontSize: '1.05rem', lineHeight: 1,
        color: h.color, transition: 'color 0.2s',
      }}>{open ? '×' : '+'}</span>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 600, color: h.color, marginBottom: '0.4rem', paddingRight: '1.4rem' }}>{h.title}</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.65 }}>{h.desc}</p>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0, transition: 'grid-template-rows 0.32s ease, opacity 0.32s ease' }}>
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.78, marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border)' }}>{h.detail}</p>
        </div>
      </div>
    </div>
  )
}

/* 功能總覽：受控展開，內容向下滑出 */
function FeatureCard({ f }: { f: { title: string; summary: string; detail: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer', padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--text)' }}>{f.title}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: open ? 'var(--accent)' : 'var(--muted)', flexShrink: 0, transition: 'color 0.2s' }}>{open ? '×' : '+'}</span>
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{f.summary}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0, transition: 'grid-template-rows 0.32s ease, opacity 0.32s ease' }}>
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '0 1.2rem 1.1rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.85, paddingTop: '0.85rem' }}>{f.detail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 可互動迷你圍棋 demo：提子 + 復盤還原 */
const demoBtn = (disabled: boolean, outline = false): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600,
  padding: '0.5em 1.35em', borderRadius: '7px', cursor: disabled ? 'default' : 'pointer',
  border: '1px solid ' + (outline ? 'var(--border-2)' : 'var(--accent)'),
  background: outline ? 'var(--bg)' : 'var(--accent)',
  color: outline ? 'var(--text-2)' : '#fff',
  opacity: disabled ? 0.4 : 1, transition: 'opacity 0.18s',
})

function GoDemo({ mobile }: { mobile: boolean }) {
  const [captured, setCaptured] = useState(false)
  const [count, setCount] = useState(0)
  const size = 168
  const pts = [28, 84, 140]
  const stone = (cx: number, cy: number, color: 'b' | 'w', extra?: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute', width: 44, height: 44, borderRadius: '50%',
    left: cx - 22, top: cy - 22,
    background: color === 'b'
      ? 'radial-gradient(circle at 35% 30%, #5a5a5a, #111)'
      : 'radial-gradient(circle at 35% 30%, #fff, #d2d2d2)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
    transition: 'opacity 0.45s ease, transform 0.45s ease',
    ...extra,
  })
  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '1.1rem' : '1.6rem', alignItems: mobile ? 'flex-start' : 'center', marginTop: '1.3rem', padding: mobile ? '1.2rem' : '1.4rem 1.6rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, background: '#d9b878', borderRadius: '6px', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}>
        {pts.map(p => <div key={'h' + p} style={{ position: 'absolute', left: pts[0], right: size - pts[2], top: p, height: 1, background: 'rgba(0,0,0,0.5)' }} />)}
        {pts.map(p => <div key={'v' + p} style={{ position: 'absolute', top: pts[0], bottom: size - pts[2], left: p, width: 1, background: 'rgba(0,0,0,0.5)' }} />)}
        <div style={stone(84, 28, 'b')} />
        <div style={stone(28, 84, 'b')} />
        <div style={stone(140, 84, 'b')} />
        <div style={stone(84, 140, 'b', { opacity: captured ? 1 : 0, transform: captured ? 'scale(1)' : 'scale(0.35)' })} />
        <div style={stone(84, 84, 'w', { opacity: captured ? 0 : 1, transform: captured ? 'scale(0.35)' : 'scale(1)' })} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--muted)' }}>被提 <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{count}</span> 子</p>
        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button onClick={() => { if (!captured) { setCaptured(true); setCount(c => c + 1) } }} disabled={captured} style={demoBtn(captured)}>提子</button>
          <button onClick={() => setCaptured(false)} disabled={!captured} style={demoBtn(!captured, true)}>復盤</button>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.7, maxWidth: '270px' }}>中央白子四口氣只剩最後一口——放下第四顆黑子就被提走，「復盤」再把它原樣放回。</p>
      </div>
    </div>
  )
}

export default function BuildDetail({ build, mobile }: { build: Build; mobile: boolean }) {
  const d = buildsDetail[build.id as keyof typeof buildsDetail]
  const [tab, setTab] = useState(0)

  const pad = mobile ? '0 1.5rem' : '0 clamp(2rem,5vw,4.5rem)'
  const sec: React.CSSProperties = { padding: '2.9rem 0', borderBottom: '1px solid var(--border)' }
  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontSize: mobile ? '1.1rem' : '1.2rem',
    fontWeight: 600, color: 'var(--text)', marginBottom: '1.6rem',
  }

  const links = d.links as { github?: string; demo?: string; download?: string }
  const roadmap = (d as { roadmap?: string }).roadmap
  const problem = d.problem as readonly string[]
  const decision = d.decisions[tab] as { tab: string; title: string; body: readonly string[]; tradeoff?: string; demo?: string }

  return (
    <div style={{ paddingTop: mobile ? '4.5rem' : '5rem', paddingBottom: '5rem' }}>

      {/* ── Hero ── */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: mobile ? '2.5rem 1.5rem 2rem' : '3rem clamp(2rem,5vw,4.5rem) 2.2rem' }}>
        <R>
          <Link href="/builds" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >← 所有作品</Link>
        </R>
        <R delay={60}>
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0 1.1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>{build.group}</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '0.9rem' }}>
            {build.title}
          </h1>
        </R>
        <R delay={150}>
          <p style={{ fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '760px', marginBottom: '1.4rem' }}>{d.oneLiner}</p>
        </R>
        <R delay={190}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.5rem', marginBottom: '1.4rem' }}>
            {d.metadata.map(m => (
              <span key={m.label} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--text-3)' }}>{m.label}：</span>{m.value}
              </span>
            ))}
          </div>
        </R>
        <R delay={220}>
          <CtaButtons links={links} />
          {roadmap && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.85rem' }}>{roadmap}</p>}
        </R>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: pad }}>

        {/* 1. 重點 */}
        <div style={sec}>
          <R><h2 style={secTitle}>重點</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1rem', alignItems: 'start' }}>
            {d.highlights.map((h, i) => (
              <R key={i} delay={40 + i * 50}><HighlightCard h={h} mobile={mobile} /></R>
            ))}
          </div>
          <R delay={260}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--muted)', marginTop: '1rem', textAlign: 'center' }}>↑ 點任一張卡片看它怎麼做到的</p>
          </R>
        </div>

        {/* 2. 為什麼做這個 */}
        <div style={sec}>
          <R><h2 style={secTitle}>為什麼做這個</h2></R>
          {problem.map((para, i) => (
            <R key={i} delay={60 + i * 60}>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-2)', lineHeight: 1.95, maxWidth: '820px', marginBottom: i < problem.length - 1 ? '1.1rem' : 0 }}>{para}</p>
            </R>
          ))}
        </div>

        {/* 3. 功能總覽 — accordion 兩欄 */}
        <div style={sec}>
          <R><h2 style={secTitle}>功能總覽</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.85rem 1.5rem', alignItems: 'start' }}>
            {d.features.map((f, i) => (
              <R key={i} delay={40 + i * 40}>
                <FeatureCard f={f} />
              </R>
            ))}
          </div>
        </div>

        {/* 4. 關鍵技術決策 — tab switcher */}
        <div style={sec}>
          <R><h2 style={secTitle}>關鍵技術決策</h2></R>
          <R delay={60}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '240px 1fr', gap: mobile ? '1rem' : '2.5rem', alignItems: 'start' }}>
              {/* 左側 tab 列 */}
              <div style={{ display: 'flex', flexDirection: mobile ? 'row' : 'column', gap: '0.4rem', flexWrap: 'wrap' }}>
                {d.decisions.map((dec, i) => (
                  <button key={i} onClick={() => setTab(i)} style={{
                    textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                    padding: '0.7em 1em', borderRadius: '7px',
                    border: tab === i ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: tab === i ? 'var(--accent-light)' : 'transparent',
                    color: tab === i ? 'var(--accent)' : 'var(--text-3)',
                    fontWeight: tab === i ? 600 : 400,
                    transition: 'all 0.18s', whiteSpace: 'nowrap',
                  }}>{dec.tab}</button>
                ))}
              </div>
              {/* 右側面板 */}
              <div key={tab} style={{ animation: 'fadeUp 0.35s ease' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.85rem', lineHeight: 1.35 }}>{decision.title}</h3>
                {decision.body.map((para, i) => (
                  <p key={i} style={{ fontSize: '0.93rem', color: 'var(--text-2)', lineHeight: 1.95, marginBottom: i < decision.body.length - 1 ? '0.9rem' : 0 }}>{para}</p>
                ))}
                {decision.demo === 'go' && <GoDemo mobile={mobile} />}
                {decision.tradeoff && (
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.85rem 1.1rem', background: 'var(--bg-2)', borderRadius: '7px', borderLeft: '3px solid var(--accent)', marginTop: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600, flexShrink: 0, marginTop: '0.15rem', letterSpacing: '0.05em' }}>取捨</span>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{decision.tradeoff}</p>
                  </div>
                )}
              </div>
            </div>
          </R>
        </div>

        {/* 5. 系統架構 */}
        <div style={sec}>
          <R><h2 style={secTitle}>系統架構</h2></R>
          <R delay={60}>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: mobile ? '1.1rem 1.2rem' : '1.4rem 1.6rem', overflowX: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: mobile ? '0.72rem' : '0.8rem', lineHeight: 1.95 }}>
                {d.architecture.map((line, i) => {
                  // 找出該行第一個要上色的節點名稱
                  let hl: { s: number; e: number; c: string } | null = null
                  for (const [kw, color] of ARCH_COLORS) {
                    const idx = line.indexOf(kw)
                    if (idx >= 0) { hl = { s: idx, e: idx + kw.length, c: color }; break }
                  }
                  return (
                    <div key={i} style={{ whiteSpace: 'pre' }}>
                      {line.split('').map((ch, j) => {
                        if (hl && j >= hl.s && j < hl.e) return <span key={j} style={{ color: hl.c, fontWeight: 700 }}>{ch}</span>
                        if ('↓↑├└│─┌┐→↳'.includes(ch)) return <span key={j} style={{ color: 'var(--muted)' }}>{ch}</span>
                        return <span key={j} style={{ color: 'var(--text-2)' }}>{ch}</span>
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </R>
        </div>

        {/* 6. 技術棧 */}
        <div style={sec}>
          <R><h2 style={secTitle}>技術棧</h2></R>
          <R delay={50}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {d.techStack.map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.35em 1em', borderRadius: '99px', background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{t}</span>
              ))}
            </div>
          </R>
        </div>

        {/* 回到列表 */}
        <div style={{ padding: '2.5rem 0 0', display: 'flex', justifyContent: 'center' }}>
          <R>
            <Link href="/builds" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 500,
              padding: '0.75em 1.9em', borderRadius: '8px', textDecoration: 'none',
              color: 'var(--accent)', background: 'var(--accent-light)',
              border: '1px solid rgba(59,91,219,0.25)', transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.16)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-light)' }}
            >← 回到作品列表</Link>
          </R>
        </div>

      </div>
    </div>
  )
}
