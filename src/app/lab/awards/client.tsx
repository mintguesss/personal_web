'use client'
/* AWARDS — 聚光燈頒獎夜：黑暗展館中，一束聚光燈沿著獎座逐一點亮 */
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { siteData } from '@/data/portfolio'
import { mountThree, radialTexture, NavDock } from '../rig'

const awards = siteData.awards
const N = awards.length
const ACCENT = '#ffd43b'
const RGB = '255,212,59'
const catColor = (a: typeof awards[number]) => a.category === 'competition' ? '#ffd43b' : a.title.includes('班級代表') ? '#b197fc' : '#ffa94d'
const pedX = (i: number) => (i - (N - 1) / 2) * 4.8
const pedZ = (i: number) => -Math.abs(i - (N - 1) / 2) * 1.1

export default function LabAwardsClient() {
  const mountRef = useRef<HTMLDivElement>(null)
  const scrollEl = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const orbit = useRef({ yaw: 0, active: false })
  const hoverSeg = useRef(-1)
  const [pct, setPct] = useState(0)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setZoom(false) }, [active])

  const lastWheel = useRef(0)
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 } }
    const onWheel = () => { lastWheel.current = Date.now() }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('wheel', onWheel) }
  }, [])

  // 每 10 秒自動把聚光燈移到下一座（手動滾動後暫停）
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastWheel.current < 11000) return
      const el = scrollEl.current; if (!el) return
      const step = (el.scrollHeight - el.clientHeight) / N
      let next = Math.round(el.scrollTop / step) + 1
      if (next > N) next = 0
      el.scrollTo({ top: next * step, behavior: 'smooth' })
    }, 10000)
    return () => clearInterval(id)
  }, [])

  // 拖曳＝繞著目前獎座微幅環視
  useEffect(() => {
    const isUI = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest('a,button')
    let px = 0
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0 || isUI(e.target)) return; orbit.current.active = true; px = e.clientX }
    const move = (e: PointerEvent) => { if (!orbit.current.active) return; orbit.current.yaw = Math.max(-0.7, Math.min(0.7, orbit.current.yaw + (e.clientX - px) * 0.004)); px = e.clientX }
    const up = () => { orbit.current.active = false }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mount = mountRef.current!
    const { scene, camera, composer, track, dotTex, dispose } = mountThree(mount, { bg: '#050403', fov: 52, bloom: [0.8, 0.55, 0.2] })
    camera.position.set(0, 4.5, 19)

    scene.add(new THREE.AmbientLight(0x3a3026, 0.22))

    // ── 地板 ──
    const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(120, 60)), track(new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.35, metalness: 0.4 })))
    floor.rotation.x = -Math.PI / 2; scene.add(floor)
    // 遠處微弱輪廓燈條
    for (let i = 0; i < 6; i++) {
      const bar = new THREE.Mesh(track(new THREE.BoxGeometry(7, 0.06, 0.06)), track(new THREE.MeshBasicMaterial({ color: 0x40342a })))
      bar.position.set(-25 + i * 10, 6.5, -14); scene.add(bar)
    }

    // ── 獎座 + 獎盃 ──
    const pedGroups: THREE.Group[] = []
    const crystalMats: THREE.MeshStandardMaterial[] = []
    const crystals: THREE.Mesh[] = []
    const pedMat = track(new THREE.MeshStandardMaterial({ color: 0x18130e, roughness: 0.55, metalness: 0.35 }))
    awards.forEach((a, i) => {
      const col = new THREE.Color(catColor(a))
      const g = new THREE.Group(); g.position.set(pedX(i), 0, pedZ(i))
      const base = new THREE.Mesh(track(new THREE.CylinderGeometry(1.0, 1.15, 2.3, 24)), pedMat)
      base.position.y = 1.15; g.add(base)
      const cap = new THREE.Mesh(track(new THREE.CylinderGeometry(1.12, 1.0, 0.16, 24)), pedMat)
      cap.position.y = 2.38; g.add(cap)
      const mat = track(new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.08, roughness: 0.22, metalness: 0.6, flatShading: true }))
      const crystal = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.62, 0)), mat)
      crystal.scale.set(0.75, 1.35, 0.75)
      crystal.position.y = 3.35
      g.add(crystal); crystals.push(crystal); crystalMats.push(mat)
      scene.add(g); pedGroups.push(g)
    })

    // ── 聚光燈 ──
    const spot = new THREE.SpotLight(0xfff0d0, 260, 40, 0.42, 0.45, 1.6)
    spot.position.set(0, 13, 3)
    const spotTarget = new THREE.Object3D(); scene.add(spotTarget)
    spot.target = spotTarget; scene.add(spot)
    // 可見光錐
    const cone = new THREE.Mesh(track(new THREE.ConeGeometry(3.6, 11.5, 40, 1, true)), track(new THREE.MeshBasicMaterial({ color: 0xffe8c0, transparent: true, opacity: 0.055, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })))
    scene.add(cone)
    // 地面光池
    const poolTex = track(radialTexture([[0, 'rgba(255,235,190,0.5)'], [0.55, 'rgba(255,210,140,0.16)'], [1, 'rgba(255,190,110,0)']]))
    const pool = new THREE.Mesh(track(new THREE.CircleGeometry(3.4, 48)), track(new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false })))
    pool.rotation.x = -Math.PI / 2; pool.position.y = 0.02; scene.add(pool)
    // 光束中的灰塵
    const DN = 300, dPos = new Float32Array(DN * 3), dSeed = new Float32Array(DN)
    for (let i = 0; i < DN; i++) { const r = Math.random() * 2.6, a = Math.random() * Math.PI * 2; dPos[i * 3] = Math.cos(a) * r; dPos[i * 3 + 1] = Math.random() * 11; dPos[i * 3 + 2] = Math.sin(a) * r; dSeed[i] = Math.random() * Math.PI * 2 }
    const dGeo = track(new THREE.BufferGeometry()); const dAttr = new THREE.BufferAttribute(dPos, 3); dGeo.setAttribute('position', dAttr)
    const dust = new THREE.Points(dGeo, track(new THREE.PointsMaterial({ color: 0xffe0b0, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.55, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending })))
    scene.add(dust)

    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const clock = new THREE.Clock()
    const tmpV = new THREE.Vector3()
    const spotT = new THREE.Vector3(0, 0, 0)
    const camT = new THREE.Vector3(0, 4.5, 19), lookT = new THREE.Vector3(0, 2.6, 0), lookCur = new THREE.Vector3(0, 2.6, 0)
    let raf = 0, activeCur = -1
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, p = progress.current
      const seg = N + 1, fp = p * (seg - 1), near = Math.round(fp)
      const idx = Math.max(0, near - 1)
      if (near > 0 && idx !== activeCur) { activeCur = idx; setActive(idx) }

      // 聚光燈位置：hero 時緩慢掃過全場；聚焦時鎖定獎座
      if (near === 0) spotT.set(Math.sin(t * 0.32) * 12, 0, -1)
      else spotT.set(pedX(idx), 0, pedZ(idx))
      spotTarget.position.lerp(spotT, 0.05)
      spot.position.set(spotTarget.position.x, 13, spotTarget.position.z + 3.2)
      cone.position.set(spotTarget.position.x, 13 - 5.75, spotTarget.position.z + 1.6)
      cone.lookAt(spotTarget.position.x, 0, spotTarget.position.z)
      cone.rotateX(-Math.PI / 2)
      pool.position.set(spotTarget.position.x, 0.02, spotTarget.position.z)
      dust.position.set(spotTarget.position.x, 0, spotTarget.position.z)

      // 獎盃：被照亮者發光旋轉，其餘沉入黑暗
      crystals.forEach((c, i) => {
        const lit = near > 0 ? (i === idx ? 1 : 0) : Math.max(0, 1 - Math.abs(pedX(i) - spotTarget.position.x) / 4)
        crystalMats[i].emissiveIntensity += (0.06 + lit * 0.85 - crystalMats[i].emissiveIntensity) * 0.08
        c.rotation.y += dt * (0.25 + lit * 0.8)
        c.position.y = 3.35 + Math.sin(t * 1.1 + i) * 0.08 * (0.4 + lit)
      })
      // 灰塵飄
      for (let i = 0; i < DN; i++) { dPos[i * 3 + 1] += Math.sin(t * 0.5 + dSeed[i]) * 0.002 + 0.004; if (dPos[i * 3 + 1] > 11) dPos[i * 3 + 1] = 0.2 }
      dAttr.needsUpdate = true

      // 相機：hero 全景 → 每座正面微距；拖曳繞看
      if (near === 0) { camT.set(0, 4.8, 19); lookT.set(0, 2.6, -1) }
      else {
        const x = pedX(idx), z = pedZ(idx)
        const yaw = orbit.current.yaw
        camT.set(x + Math.sin(yaw) * 8.5, 3.1, z + Math.cos(yaw) * 8.5)
        lookT.set(x, 2.9, z)
      }
      camera.position.lerp(camT, 0.05)
      lookCur.lerp(lookT, 0.05)
      camera.lookAt(lookCur)
      camera.updateMatrixWorld()

      // hover
      ndc.set(mouse.current.x, -mouse.current.y)
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(pedGroups, true)
      let hIdx = -1
      if (hits.length > 0) { hIdx = pedGroups.findIndex(gg => { let o: THREE.Object3D | null = hits[0].object; while (o) { if (o === gg) return true; o = o.parent } return false }) }
      hoverSeg.current = hIdx
      if (tooltipRef.current) {
        if (hIdx >= 0) {
          crystals[hIdx].getWorldPosition(tmpV); tmpV.project(camera)
          tooltipRef.current.style.opacity = '1'
          tooltipRef.current.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * window.innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * window.innerHeight - 26}px) translate(-50%,-100%)`
          tooltipRef.current.textContent = `${awards[hIdx].year} · ${awards[hIdx].title}`
        } else tooltipRef.current.style.opacity = '0'
      }
      if (scrollEl.current) scrollEl.current.style.cursor = orbit.current.active ? 'grabbing' : hIdx >= 0 ? 'pointer' : 'grab'

      composer.render()
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(raf); dispose() }
  }, [mounted])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('a,button')) return
      const i = hoverSeg.current
      if (i < 0) return
      const el = scrollEl.current; if (!el) return
      lastWheel.current = Date.now()
      el.scrollTop = ((i + 1) / N) * (el.scrollHeight - el.clientHeight)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const onScroll = () => {
    const el = scrollEl.current; if (!el) return
    const p = el.scrollTop / ((el.scrollHeight - el.clientHeight) || 1)
    progress.current = p; setPct(p)
  }

  const heroOp = Math.max(0, 1 - pct / 0.08)
  const plaqueOn = pct > 0.1
  const a = awards[active]
  const col = catColor(a)

  return (
    <div ref={scrollEl} onScroll={onScroll} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#050403', color: '#f4ead8', fontFamily: 'var(--font-body)' }}>
      <div style={{ height: `${(N + 1) * 100}vh` }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {mounted && <div ref={mountRef} style={{ width: '100%', height: '100%' }} />}
      </div>

      {/* 上下遮幅（劇院感） */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3.2rem', zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(3,2,2,0.9), transparent)' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '5rem', zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(0deg, rgba(3,2,2,0.9), transparent)' }} />

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 6, background: `rgba(${RGB},0.1)` }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: ACCENT, boxShadow: `0 0 18px rgba(${RGB},0.5)` }} />
      </div>
      <NavDock current="/lab/awards" accent={ACCENT} />
      <Link href="/" style={{ position: 'fixed', top: '1.4rem', right: '1.4rem', zIndex: 7, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.18em', color: 'rgba(244,234,216,0.5)', textDecoration: 'none' }}>EXIT ↗</Link>

      {/* Hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', opacity: heroOp }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.5em', color: ACCENT, marginBottom: '1.4rem', textShadow: `0 0 20px rgba(${RGB},0.5)` }}>GALLERY OF HONORS · {String(N).padStart(2, '0')} PIECES</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,10vw,7rem)', fontWeight: 700, margin: 0, letterSpacing: '0.04em', background: `linear-gradient(180deg,#fff,${ACCENT})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AWARDS</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c9a87a', marginTop: '1.2rem', letterSpacing: '0.14em' }}>捲動移燈 · 一次只照亮一座</p>
        <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#8a6f4d', animation: 'awPulse 1.8s ease-in-out infinite' }}>▼ 點燈</div>
      </div>

      {/* 銘牌 + 展品照片（金色雙色調處理，不搶戲） */}
      <div key={plaqueOn ? active : -1} className={plaqueOn ? 'aw-plaque' : undefined} style={{
        position: 'fixed', left: '50%', bottom: '2.4rem', zIndex: 4, transform: 'translateX(-50%)',
        width: 'min(560px, 92vw)', textAlign: 'center',
        opacity: plaqueOn ? 1 : 0, pointerEvents: 'none',
        transition: 'opacity 0.35s',
      }}>
        {a.image && (
          <button onClick={() => setZoom(true)} title="點擊放大" style={{
            width: '164px', height: '110px', margin: '0 auto -1px', display: 'block',
            borderRadius: '4px 4px 0 0', overflow: 'hidden', position: 'relative',
            border: `1px solid rgba(${RGB},0.45)`, borderBottom: 'none', padding: 0,
            background: 'linear-gradient(160deg, #a8813a, #4a3316 70%, #2a1c0c)',
            boxShadow: `0 -6px 30px rgba(${RGB},0.12)`,
            cursor: 'zoom-in', pointerEvents: 'auto',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} alt={a.title} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              mixBlendMode: 'luminosity', opacity: 0.92,
              filter: 'grayscale(1) contrast(1.06) brightness(1.02)',
            }} />
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 26px rgba(10,6,2,0.75)' }} />
            <span style={{ position: 'absolute', right: '6px', bottom: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,236,200,0.75)' }}>⊕ 放大</span>
          </button>
        )}
        <div style={{
          padding: '1.1rem 1.6rem',
          background: 'rgba(8,6,4,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          borderTop: `1px solid rgba(${RGB},0.55)`, borderBottom: `1px solid rgba(${RGB},0.2)`,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.4em', color: col, marginBottom: '0.45rem' }}>№ {String(active + 1).padStart(2, '0')} — {a.year}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem,3vw,1.45rem)', fontWeight: 700, color: '#fff8ec', letterSpacing: '0.02em' }}>{a.title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#b99a6e', marginTop: '0.4rem', letterSpacing: '0.16em' }}>{a.org}</div>
        </div>
      </div>

      {/* 照片放大 lightbox */}
      {zoom && a.image && (
        <button onClick={() => setZoom(false)} style={{
          position: 'fixed', inset: 0, zIndex: 30, border: 'none', padding: 0, cursor: 'zoom-out',
          background: 'rgba(4,3,2,0.94)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.1rem',
          animation: 'awZoom 0.25s ease both',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image} alt={a.title} style={{
            maxWidth: '86vw', maxHeight: '76vh', objectFit: 'contain', display: 'block',
            border: `1px solid rgba(${RGB},0.5)`, borderRadius: '4px',
            filter: 'sepia(0.12) saturate(0.95)',
            boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 46px rgba(${RGB},0.14)`,
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#fff4e0' }}>{a.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: '#b99a6e', marginTop: '0.35rem', letterSpacing: '0.2em' }}>{a.year} · {a.org} — 點擊任意處關閉</div>
          </div>
        </button>
      )}

      <div ref={tooltipRef} style={{ position: 'fixed', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#fff', padding: '0.35em 0.9em', borderRadius: '99px', background: 'rgba(8,6,4,0.85)', border: `1px solid rgba(${RGB},0.5)`, whiteSpace: 'nowrap' }} />

      {/* 導航鈕（右下並排） */}
      <div style={{ position: 'fixed', bottom: '1.6rem', right: '1.6rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => {
          const el = scrollEl.current; if (!el) return
          lastWheel.current = Date.now()
          const step = (el.scrollHeight - el.clientHeight) / N
          let next = Math.round(el.scrollTop / step) + 1
          if (next > N) next = 1
          el.scrollTo({ top: next * step, behavior: 'smooth' })
        }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#e0c9a0', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(8,6,4,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.04 ? 1 : 0, pointerEvents: pct > 0.04 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>下一座 ▸</button>
        <button onClick={() => { orbit.current.yaw = 0; if (scrollEl.current) scrollEl.current.scrollTop = 0 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#e0c9a0', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(8,6,4,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.04 ? 1 : 0, pointerEvents: pct > 0.04 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>↺ 回到序幕</button>
      </div>

      <style>{`
        @keyframes awPulse { 0%,100%{ opacity:0.5 } 50%{ opacity:1 } }
        @keyframes awIn { from{ opacity:0; transform:translateX(-50%) translateY(14px) } to{ opacity:1; transform:translateX(-50%) translateY(0) } }
        .aw-plaque { animation: awIn 0.5s ease both; }
        @keyframes awZoom { from{ opacity:0 } to{ opacity:1 } }
      `}</style>
    </div>
  )
}
