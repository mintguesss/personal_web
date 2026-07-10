'use client'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'
import { THEME, type Focus, type Hover, type Drag } from './themes'
import type { SunFx } from './Scene3D'
import { NavDock } from './rig'

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '0.3em', textTransform: 'uppercase', color, marginBottom: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
      <span className="lab-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 14px ${color}` }} />
      {children}
    </p>
  )
}

export default function LabClient() {
  const [mounted, setMounted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [pct, setPct] = useState(0)
  const [sunEgg, setSunEgg] = useState(false)
  const progress = useRef(0)
  const focus = useRef<Focus>({ x: 0, y: 0, idx: 0, settle: 0 })
  const scrollEl = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const lastWheel = useRef(0)
  const hover = useRef<Hover>({ idx: -1, x: 0, y: 0, name: '' })
  const drag = useRef<Drag>({ yaw: 0, pitch: 0, active: false })
  const dragMoved = useRef(0)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const sunFx = useRef<SunFx>({ on: false, arrive: 0, x: 0, y: 0, r: 0 })
  const eggRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // 滑鼠視差 + 記錄手動捲動時間
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 } }
    const onWheel = () => { lastWheel.current = Date.now(); if (sunFx.current.on) { sunFx.current.on = false; setSunEgg(false) } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('wheel', onWheel) }
  }, [])

  // 按住左鍵拖曳 → 轉視角（上下左右環顧，放開後維持）
  useEffect(() => {
    const isUI = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest('a,button')
    let px = 0, py = 0
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || isUI(e.target)) return
      drag.current.active = true
      dragMoved.current = 0
      px = e.clientX; py = e.clientY
    }
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - px, dy = e.clientY - py
      px = e.clientX; py = e.clientY
      dragMoved.current += Math.abs(dx) + Math.abs(dy)
      drag.current.yaw += dx * 0.005
      drag.current.pitch = Math.max(-1.35, Math.min(1.35, drag.current.pitch + dy * 0.004))
    }
    const up = () => { drag.current.active = false }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  // 點擊行星 → 飛到那段（拖曳過不觸發）
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dragMoved.current > 6) return
      if (e.target instanceof HTMLElement && e.target.closest('a,button')) return
      if (sunFx.current.on) { sunFx.current.on = false; setSunEgg(false); return } // 看太陽時點任意處離開
      const hIdx = hover.current.idx
      if (hIdx < 0) return
      if (hIdx === 99) { lastWheel.current = Date.now(); sunFx.current.on = true; setSunEgg(true); return } // 點太陽 → 漸進飛向太陽
      if (hIdx > 4) return // 保險：未知目標不捲動
      const el = scrollEl.current; if (!el) return
      lastWheel.current = Date.now()
      const step = (el.scrollHeight - el.clientHeight) / 4
      // 捲動直接跳到目標段，相機自己走弧線直飛（不沿路遍歷）
      el.scrollTop = hIdx * step
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  // 每 10 秒自動前往下一顆（剛手動捲動過或看太陽時暫停）
  useEffect(() => {
    const id = setInterval(() => {
      if (sunFx.current.on) return
      if (Date.now() - lastWheel.current < 11000) return
      const el = scrollEl.current; if (!el) return
      const step = (el.scrollHeight - el.clientHeight) / 4
      let next = Math.round(el.scrollTop / step) + 1
      if (next > 4) next = 0
      el.scrollTop = next * step // 瞬跳，相機自己走弧線直飛
    }, 10000)
    return () => clearInterval(id)
  }, [])

  // 每幀讓浮出內容跟著行星的螢幕座標 + tooltip / 游標
  useEffect(() => {
    let raf = 0, cur = -1
    const loop = () => {
      const f = focus.current
      if (anchorRef.current) anchorRef.current.style.transform = `translate(${f.x}px, ${f.y}px)`
      if (overlayRef.current) overlayRef.current.style.opacity = String(f.idx > 0 ? f.settle : 0)
      if (f.idx !== cur) { cur = f.idx; setIdx(f.idx) }
      const hv = hover.current
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = hv.idx >= 0 ? '1' : '0'
        tooltipRef.current.style.transform = `translate(${hv.x}px, ${hv.y - 28}px) translate(-50%, -100%)`
        if (hv.name) tooltipRef.current.textContent = hv.name
      }
      if (scrollEl.current) scrollEl.current.style.cursor = drag.current.active ? 'grabbing' : hv.idx >= 0 ? 'pointer' : 'grab'
      // ☀ 彩蛋錨定在太陽上
      if (eggRef.current) {
        const s = sunFx.current
        const size = Math.max(200, Math.min(460, s.r * 2.7))
        eggRef.current.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%)`
        eggRef.current.style.width = `${size}px`
        eggRef.current.style.height = `${size}px`
        eggRef.current.style.opacity = s.on && s.arrive > 0.82 ? '1' : '0'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onScroll = () => {
    const el = scrollEl.current; if (!el) return
    const p = el.scrollTop / ((el.scrollHeight - el.clientHeight) || 1)
    progress.current = p
    setPct(p)
  }

  const theme = THEME
  const A = theme.accent
  const rgb = theme.accentRgb
  const glow = (a = 0.55) => `0 0 24px rgba(${rgb},${a})`
  const secColors = theme.sectionColors
  const glass: React.CSSProperties = { background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.25)`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }

  const projects = ['nsc', 'fraud-radar', 'task-crusher'].map(id => siteData.projects.find(p => p.id === id)).filter(Boolean) as typeof siteData.projects[number][]
  const heroOpacity = sunEgg ? 0 : Math.max(0, 1 - pct / 0.08)

  const cardStyle: React.CSSProperties = { width: 'min(440px, 54vw)', padding: '2rem 2.2rem', textAlign: 'left', background: 'rgba(6,9,18,0.85)', border: `1px solid rgba(${rgb},0.45)`, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: '16px', boxShadow: `0 12px 50px rgba(0,0,0,0.65), 0 0 30px rgba(${rgb},0.18)` }

  const renderContent = (i: number) => {
    const color = secColors[i - 1]
    if (i === 1) return (
      <div style={cardStyle}>
        <SectionLabel color={color}>01 — About</SectionLabel>
        {siteData.bio.map((b, k) => (
          <p key={k} style={{ fontSize: k === 0 ? '1.18rem' : '1rem', color: k === 0 ? '#fff' : '#d5dcff', lineHeight: 1.85, marginBottom: k < siteData.bio.length - 1 ? '0.8rem' : 0, fontWeight: k === 0 ? 600 : 400 }}>{b}</p>
        ))}
      </div>
    )
    if (i === 2) return (
      <div style={cardStyle}>
        <SectionLabel color={color}>02 — Selected Work</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {projects.map((p, k) => (
            <a key={p.id} href={p.link || undefined} target={p.link ? '_blank' : undefined} rel="noreferrer" style={{ textDecoration: 'none', display: 'block', paddingBottom: k < projects.length - 1 ? '0.7rem' : 0, borderBottom: k < projects.length - 1 ? `1px solid rgba(${rgb},0.14)` : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.88rem', color: '#b8c0ee', lineHeight: 1.55 }}>{p.subtitle}</div>
            </a>
          ))}
        </div>
      </div>
    )
    if (i === 3) return (
      <div style={cardStyle}>
        <SectionLabel color={color}>03 — Stack</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {siteData.homeSkills.map(s => (
            <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.94rem', padding: '0.5em 1.2em', borderRadius: '99px', color: '#e6e9ff', border: `1px solid rgba(${rgb},0.4)`, background: `rgba(${rgb},0.1)` }}>{s}</span>
          ))}
        </div>
      </div>
    )
    return (
      <div style={cardStyle}>
        <SectionLabel color={color}>04 — Contact</SectionLabel>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 700, color: '#fff', marginBottom: '1.3rem' }}>一起做點<em style={{ color, fontStyle: 'italic' }}>酷</em>的</h2>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[{ label: 'Email', href: `mailto:${siteData.email}` }, { label: 'Instagram', href: siteData.links.instagram }, { label: 'Line', href: siteData.links.line }].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#e6e9ff', textDecoration: 'none', padding: '0.65em 1.4em', border: `1px solid rgba(${rgb},0.45)`, borderRadius: '99px', background: `rgba(${rgb},0.1)` }}>{l.label} ↗</a>
          ))}
        </div>
      </div>
    )
  }

  const calloutColor = idx > 0 ? secColors[idx - 1] : A

  return (
    <div ref={scrollEl} onScroll={onScroll} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: theme.bg, color: '#e6e9ff', fontFamily: 'var(--font-body)' }}>
      {/* 捲動高度 */}
      <div style={{ height: '560vh' }} />

      {/* 3D 背景 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {mounted && <Scene3D progress={progress} focus={focus} mouse={mouse} hover={hover} drag={drag} sunFx={sunFx} />}
      </div>

      {/* 導航鈕（右下並排） */}
      <div style={{ position: 'fixed', bottom: '1.6rem', right: '1.6rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => {
          const el = scrollEl.current; if (!el) return
          lastWheel.current = Date.now()
          const step = (el.scrollHeight - el.clientHeight) / 4
          let next = Math.round(el.scrollTop / step) + 1
          if (next > 4) next = 0
          el.scrollTop = next * step // 瞬跳 → 弧線直飛，最後一顆回起點也不倒車
        }} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em',
          color: '#e6e9ff', cursor: 'pointer', padding: '0.55em 1.2em',
          border: `1px solid rgba(${rgb},0.45)`, borderRadius: '99px',
          background: 'rgba(8,10,18,0.6)', backdropFilter: 'blur(8px)',
          opacity: pct > 0.06 ? 1 : 0, pointerEvents: pct > 0.06 ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}>下一顆 ▸</button>
        <button
          onClick={() => { lastWheel.current = Date.now(); drag.current.yaw = 0; drag.current.pitch = 0; if (scrollEl.current) scrollEl.current.scrollTop = 0 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em',
            color: '#e6e9ff', cursor: 'pointer', padding: '0.55em 1.2em',
            border: `1px solid rgba(${rgb},0.45)`, borderRadius: '99px',
            background: 'rgba(8,10,18,0.6)', backdropFilter: 'blur(8px)',
            opacity: pct > 0.06 ? 1 : 0, pointerEvents: pct > 0.06 ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        >☀ 回到起點</button>
      </div>

      {/* ☀ 太陽彩蛋：疊在真的太陽上（背景照舊），飛抵後才浮現 */}
      {sunEgg && (
        <div ref={eggRef} style={{
          position: 'fixed', left: 0, top: 0, zIndex: 20, pointerEvents: 'none',
          opacity: 0, transition: 'opacity 0.5s ease', willChange: 'transform',
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* 加碼旋轉光芒（疊在原本日冕上） */}
            <div style={{
              position: 'absolute', inset: '-34%', borderRadius: '50%',
              background: 'repeating-conic-gradient(rgba(255,190,80,0.32) 0deg 8deg, transparent 8deg 20deg)',
              animation: 'sunSpin 16s linear infinite',
              WebkitMaskImage: 'radial-gradient(circle, black 32%, transparent 68%)',
              maskImage: 'radial-gradient(circle, black 32%, transparent 68%)',
            }} />
            {/* 虛線裝飾環 */}
            <div style={{ position: 'absolute', inset: '-9%', borderRadius: '50%', border: '2px dashed rgba(255,210,130,0.65)', animation: 'sunSpin 22s linear infinite reverse' }} />
            {/* 本體照片：長在太陽上 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteData.photo} alt="the sun" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '50% 72%', borderRadius: '50%',
              border: '4px solid #ffb347', boxShadow: '0 0 70px rgba(255,180,70,0.85), inset 0 0 34px rgba(255,140,40,0.3)',
              animation: 'sunPop 0.55s cubic-bezier(0.2,1.6,0.4,1) both, sunWobble 3.2s ease-in-out 0.55s infinite',
            }} />
            {/* 墨鏡登場 */}
            <div style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 'clamp(2.4rem,7vw,3.8rem)', animation: 'sunShades 0.9s cubic-bezier(0.3,1.4,0.5,1) 0.6s both', transform: 'translateX(-50%)' }}>😎</div>
            {/* 行星圍觀 */}
            {['🪐', '🌍', '🚀', '☄️'].map((e, i) => (
              <div key={e} style={{ position: 'absolute', inset: 0, animation: `sunSpin ${7 + i * 3}s linear infinite`, animationDelay: `${-i * 2}s` }}>
                <span style={{ position: 'absolute', top: '-16%', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>{e}</span>
              </div>
            ))}
            {/* 汗滴（太熱了） */}
            <div style={{ position: 'absolute', right: '0%', top: '28%', fontSize: '1.7rem', animation: 'sunSweat 1.6s ease-in infinite' }}>💧</div>
            {/* 銘牌 */}
            <div style={{ position: 'absolute', top: '106%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', animation: 'sunPop 0.5s ease 0.9s both' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem,3vw,1.6rem)', fontWeight: 700, color: '#ffe9c4', textShadow: '0 0 26px rgba(255,180,70,0.7), 0 2px 14px rgba(0,0,0,0.8)' }}>☀ 太陽的真面目</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#ffd9a0', marginTop: '0.4rem', letterSpacing: '0.12em', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>本星系唯一恆星｜亮度 MAX｜謙虛 0%</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#c8a06a', marginTop: '0.55rem', letterSpacing: '0.2em', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>直視太陽有害眼睛 · 點任意處降溫</div>
            </div>
          </div>
        </div>
      )}

      {/* hover 名稱提示 */}
      <div ref={tooltipRef} style={{ position: 'fixed', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.12em', color: '#fff', padding: '0.4em 0.95em', borderRadius: '99px', background: 'rgba(8,10,18,0.75)', border: `1px solid rgba(${rgb},0.5)`, boxShadow: glow(0.3), whiteSpace: 'nowrap' }} />

      {/* 進度條 */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 6, background: `rgba(${rgb},0.12)` }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: A, boxShadow: glow() }} />
      </div>

      <NavDock current="/lab" accent={A} />

      {/* 切換 */}
      <div style={{ position: 'fixed', top: '1.4rem', right: '1.4rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', color: '#e6e9ff', textDecoration: 'none', padding: '0.5em 1.1em', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '99px', background: 'rgba(8,10,18,0.55)', backdropFilter: 'blur(8px)' }}>← 正式版</Link>
      </div>

      {/* Hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', opacity: heroOpacity, transition: 'opacity 0.3s ease' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.4em', color: A, marginBottom: '1.5rem', textShadow: glow() }}>PORTFOLIO · EXPERIMENTAL</div>
        <h1 className="lab-title lab-float" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem,16vw,11rem)', fontWeight: 700, lineHeight: 0.95, margin: 0, letterSpacing: '-0.02em', background: `linear-gradient(180deg,#ffffff,${A})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{siteData.nameEn}</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.8rem,2.5vw,1.05rem)', color: '#aab4e8', marginTop: '1.5rem', letterSpacing: '0.05em' }}>{siteData.taglines.join('　·　')}</p>
        <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#6b74a8', animation: 'labBounce 1.8s ease-in-out infinite' }}>SCROLL ↓　探索星系</div>
      </div>

      {/* 錨定行星的浮出內容 */}
      <div ref={overlayRef} style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease' }}>
        <div ref={anchorRef} style={{ position: 'absolute', left: 0, top: 0, willChange: 'transform' }}>
          <div key={idx} className="lab-callout" style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-6px,-50%)', display: 'flex', alignItems: 'center' }}>
            <span className="lab-cdot" style={{ width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, background: calloutColor, boxShadow: `0 0 14px ${calloutColor}` }} />
            <span className="lab-cline" style={{ height: '2px', flexShrink: 0, background: `linear-gradient(90deg, ${calloutColor}, rgba(${rgb},0.2))`, boxShadow: `0 0 10px ${calloutColor}` }} />
            <div className="lab-ccard" style={{ pointerEvents: 'auto' }}>{idx > 0 && renderContent(idx)}</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes labBounce { 0%,100%{ transform: translateY(0); opacity:0.6 } 50%{ transform: translateY(8px); opacity:1 } }
        @keyframes labGlow { 0%,100%{ text-shadow: 0 0 38px rgba(${rgb},0.3) } 50%{ text-shadow: 0 0 72px rgba(${rgb},0.6) } }
        @keyframes labFloat { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-10px) } }
        @keyframes labPulse { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(1.4); opacity:0.55 } }
        @keyframes cline { from{ width:0; opacity:0 } to{ width:56px; opacity:1 } }
        @keyframes ccard { from{ opacity:0; transform: scale(0.35) translateX(-40px) } to{ opacity:1; transform:none } }
        @keyframes cdot { from{ opacity:0; transform: scale(0) } to{ opacity:1; transform: scale(1) } }
        .lab-title { animation: labGlow 4.5s ease-in-out infinite; }
        .lab-float { animation: labFloat 7s ease-in-out infinite; }
        .lab-dot { animation: labPulse 2.4s ease-in-out infinite; }
        .lab-cdot { animation: cdot 0.4s ease both, labPulse 2.4s ease-in-out infinite 0.5s; }
        .lab-cline { animation: cline 0.5s ease 0.15s both; }
        .lab-ccard { transform-origin: left center; animation: ccard 0.7s cubic-bezier(0.2,0.9,0.2,1) 0.2s both; }
        @keyframes sunFade { from{ opacity:0 } to{ opacity:1 } }
        @keyframes sunSpin { from{ transform: rotate(0deg) } to{ transform: rotate(360deg) } }
        @keyframes sunBreath { 0%,100%{ opacity:0.7; transform:scale(1) } 50%{ opacity:1; transform:scale(1.06) } }
        @keyframes sunPop { from{ opacity:0; transform:scale(0.2) } to{ opacity:1; transform:scale(1) } }
        @keyframes sunWobble { 0%,100%{ transform:rotate(-3deg) } 50%{ transform:rotate(3deg) } }
        @keyframes sunShades { from{ opacity:0; transform:translateX(-50%) translateY(-220px) } 60%{ opacity:1; transform:translateX(-50%) translateY(12px) } 80%{ transform:translateX(-50%) translateY(-6px) } to{ opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes sunSweat { 0%{ opacity:0; transform:translateY(-4px) } 30%{ opacity:1 } 100%{ opacity:0; transform:translateY(26px) } }
      `}</style>
    </div>
  )
}
