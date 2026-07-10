'use client'
/* PROJECTS — 航行日誌：沿光路前飛，巨碑錯落兩側；情報以全螢幕雜誌式排版浮現（不綁定物件） */
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { siteData } from '@/data/portfolio'
import { mountThree, starSphere, radialTexture, NavDock } from '../rig'

const COLORS = ['#4dabf7', '#ff8787', '#ffc078', '#63e6be', '#b197fc', '#f783ac']
const ACCENT = '#4dabf7'
const RGB = '77,171,247'
const projects = siteData.projects
const MON_Z = projects.map((_, i) => -(35 + i * 40))
const MON_X = projects.map((_, i) => (i % 2 === 0 ? -9 : 9))
const CAM_START = 10, CAM_END = MON_Z[MON_Z.length - 1] - 28
const RANGE = CAM_START - CAM_END

export default function LabProjectsClient() {
  const mountRef = useRef<HTMLDivElement>(null)
  const scrollEl = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const hoverSeg = useRef(-1)
  const [pct, setPct] = useState(0)
  const [active, setActive] = useState(0)
  const spreadRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 } }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mount = mountRef.current!
    const { scene, camera, composer, track, dotTex, dispose } = mountThree(mount, { bg: '#03050c', fov: 60, fogDensity: 0.007, bloom: [0.9, 0.55, 0.18] })
    camera.position.set(0, 0.5, CAM_START)

    scene.add(new THREE.AmbientLight(0x5a6a9f, 0.65))
    const key = new THREE.DirectionalLight(0xdfe8ff, 1.5); key.position.set(12, 20, 10); scene.add(key)

    const starMats = [starSphere(scene, track, dotTex, 7000, [90, 260], 0.5, 0xcdd6ff, 0.85), starSphere(scene, track, dotTex, 900, [70, 180], 1.1, 0xffffff, 0.7)]
    { // 星雲
      const nebTex = track(radialTexture([[0, 'rgba(255,255,255,0.7)'], [0.4, 'rgba(150,180,255,0.28)'], [1, 'rgba(70,90,170,0)']]))
      const defs: [number, [number, number, number], number][] = [[0x2f5bb0, [-70, 25, -150], 130], [0x6d5bd0, [65, -20, -210], 150], [0xb0407a, [-55, 30, -90], 100], [0x2b7ba0, [60, 22, -260], 110]]
      defs.forEach(([col, pos, sc]) => { const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: nebTex, color: col, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.3, depthWrite: false }))); sp.position.set(...pos); sp.scale.setScalar(sc); scene.add(sp) })
    }

    // ── 光路 ──
    const stripGeo = track(new THREE.BoxGeometry(0.28, 0.08, 2.2))
    const stripMat = track(new THREE.MeshBasicMaterial({ color: 0x2b6cff }))
    for (let z = 14; z > CAM_END - 10; z -= 6) {
      const l = new THREE.Mesh(stripGeo, stripMat); l.position.set(-5.4, -2.6, z); scene.add(l)
      const r = new THREE.Mesh(stripGeo, stripMat); r.position.set(5.4, -2.6, z); scene.add(r)
    }
    {
      const n = Math.floor((14 - (CAM_END - 10)) / 3), pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) { pos[i * 3] = 0; pos[i * 3 + 1] = -2.5; pos[i * 3 + 2] = 14 - i * 3 }
      const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, track(new THREE.PointsMaterial({ color: 0x9db4ff, size: 0.2, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))))
    }
    { // 塵埃
      const n = 1500, pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 50; pos[i * 3 + 1] = (Math.random() - 0.5) * 32; pos[i * 3 + 2] = 20 - Math.random() * (RANGE + 60) }
      const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, track(new THREE.PointsMaterial({ color: 0x8fa8ff, size: 0.13, sizeAttenuation: true, transparent: true, opacity: 0.55, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))))
    }

    // ── 巨碑（錯落兩側的紀念碑）──
    const monuments: THREE.Group[] = []
    const frames: THREE.LineSegments[] = []
    const slabMat = track(new THREE.MeshStandardMaterial({ color: 0x2a3348, roughness: 0.4, metalness: 0.85 }))
    projects.forEach((p, i) => {
      const col = new THREE.Color(COLORS[i])
      const g = new THREE.Group()
      g.position.set(MON_X[i], 1.6, MON_Z[i])
      g.rotation.y = (MON_X[i] < 0 ? 1 : -1) * 0.5
      const slabGeo = track(new THREE.BoxGeometry(5.2, 9.5, 1.0))
      g.add(new THREE.Mesh(slabGeo, slabMat))
      const frame = new THREE.LineSegments(track(new THREE.EdgesGeometry(slabGeo)), track(new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 })))
      g.add(frame); frames.push(frame)
      // 中央發光紋
      const stripe = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 7.6, 0.1)), track(new THREE.MeshBasicMaterial({ color: col })))
      stripe.position.z = 0.56; g.add(stripe)
      // 光暈
      const halo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: track(radialTexture([[0, 'rgba(255,255,255,0.5)'], [0.4, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']])), color: col, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.5 })))
      halo.scale.set(10, 13, 1); halo.position.z = -0.5; g.add(halo)
      // 底座浮空碎石
      for (let k = 0; k < 5; k++) {
        const rock = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.22 + Math.random() * 0.25, 0)), slabMat)
        rock.position.set((Math.random() - 0.5) * 5, -5.4 + Math.random() * 1.6, (Math.random() - 0.5) * 2)
        g.add(rock)
      }
      scene.add(g); monuments.push(g)
    })

    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const clock = new THREE.Clock()
    const tmpV = new THREE.Vector3()
    let raf = 0, fovCur = 60, activeCur = 0, czCur = CAM_START, lastCz = CAM_START
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, p = progress.current
      // 車感：相機追趕捲動目標——起步加速、逼近時減速煞停
      const camZ = CAM_START - p * RANGE
      czCur += (camZ - czCur) * Math.min(1, 2.6 * dt)
      const vel = Math.abs(czCur - lastCz) / Math.max(dt, 0.001); lastCz = czCur
      fovCur += (60 + Math.min(15, vel * 0.5) - fovCur) * 0.08
      camera.fov = fovCur; camera.updateProjectionMatrix()
      camera.position.set(Math.sin(t * 0.4) * 0.3, 0.5 + Math.sin(t * 0.62) * 0.22, czCur)
      camera.lookAt(Math.sin(t * 0.4) * 0.15, 0.4, czCur - 40)
      camera.updateMatrixWorld()

      monuments.forEach((m, i) => { m.rotation.y += dt * 0.02 * (i % 2 === 0 ? 1 : -1); m.position.y = 1.6 + Math.sin(t * 0.5 + i * 1.9) * 0.3 })
      frames.forEach((f, i) => { (f.material as THREE.LineBasicMaterial).opacity = 0.7 + 0.3 * Math.sin(t * 2 + i) })
      starMats.forEach((m, i) => { m.opacity = (i === 0 ? 0.85 : 0.7) * (0.75 + 0.25 * Math.sin(t * (1.1 + i) + i)) })

      // 雜誌排版強度：在碑前一段就浮現（巨碑完整入鏡）並停留更久
      let best = 0, bestS = 0
      MON_Z.forEach((z, i) => {
        const d = czCur - (z + 14) // 相機在碑前 14 單位為區間中心
        const s = d > 0 ? Math.max(0, 1 - Math.max(0, d - 6) / 13) : Math.max(0, 1 - Math.max(0, -d - 4) / 11)
        if (s > bestS) { bestS = s; best = i }
      })
      if (spreadRef.current) {
        spreadRef.current.style.opacity = String(bestS)
        spreadRef.current.style.transform = `translateY(${(1 - bestS) * 18}px)`
      }
      if (best !== activeCur && bestS > 0.08) { activeCur = best; setActive(best) }

      // hover 巨碑
      ndc.set(mouse.current.x, -mouse.current.y)
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(monuments, true)
      let hIdx = -1
      if (hits.length > 0) { hIdx = monuments.findIndex(gg => { let o: THREE.Object3D | null = hits[0].object; while (o) { if (o === gg) return true; o = o.parent } return false }) }
      hoverSeg.current = hIdx
      if (tooltipRef.current) {
        if (hIdx >= 0) {
          monuments[hIdx].getWorldPosition(tmpV); tmpV.project(camera)
          tooltipRef.current.style.opacity = '1'
          tooltipRef.current.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * window.innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * window.innerHeight - 30}px) translate(-50%,-100%)`
          tooltipRef.current.textContent = `LOG 0${hIdx + 1} · ${projects[hIdx].title}`
        } else tooltipRef.current.style.opacity = '0'
      }
      if (scrollEl.current) scrollEl.current.style.cursor = hIdx >= 0 ? 'pointer' : 'default'

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
      el.scrollTop = ((CAM_START - (MON_Z[i] + 14)) / RANGE) * (el.scrollHeight - el.clientHeight)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const onScroll = () => {
    const el = scrollEl.current; if (!el) return
    const p = el.scrollTop / ((el.scrollHeight - el.clientHeight) || 1)
    progress.current = p; setPct(p)
  }

  const heroOp = Math.max(0, 1 - pct / 0.055)
  const a = projects[active]
  const col = COLORS[active]
  const textRight = MON_X[active] < 0 // 碑在左 → 字在右

  return (
    <div ref={scrollEl} onScroll={onScroll} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#03050c', color: '#e6e9ff', fontFamily: 'var(--font-body)' }}>
      <div style={{ height: `${(projects.length + 1) * 120}vh` }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {mounted && <div ref={mountRef} style={{ width: '100%', height: '100%' }} />}
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 6, background: `rgba(${RGB},0.1)` }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: ACCENT, boxShadow: `0 0 18px rgba(${RGB},0.6)` }} />
      </div>
      <NavDock current="/lab/projects" accent={ACCENT} />
      <Link href="/" style={{ position: 'fixed', top: '1.4rem', right: '1.4rem', zIndex: 7, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.18em', color: 'rgba(225,230,255,0.5)', textDecoration: 'none' }}>EXIT ↗</Link>

      {/* 左緣航段刻度 */}
      <div style={{ position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'center' }}>
        {projects.map((_, i) => (
          <div key={i} style={{ width: i === active && pct > 0.04 ? '8px' : '5px', height: i === active && pct > 0.04 ? '8px' : '5px', borderRadius: '50%', background: i === active && pct > 0.04 ? COLORS[i] : 'rgba(180,195,255,0.25)', boxShadow: i === active && pct > 0.04 ? `0 0 10px ${COLORS[i]}` : 'none', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', opacity: heroOp }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.5em', color: ACCENT, marginBottom: '1.4rem', textShadow: `0 0 20px rgba(${RGB},0.6)` }}>VOYAGE LOG · 06 ENTRIES</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,10vw,7rem)', fontWeight: 700, margin: 0, letterSpacing: '0.04em', background: `linear-gradient(180deg,#fff,${ACCENT})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PROJECTS</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#8fa0d8', marginTop: '1.2rem', letterSpacing: '0.14em' }}>沿光路航行 · 每座巨碑是一段紀錄</p>
        <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#5c68a0', animation: 'vgPulse 1.8s ease-in-out infinite' }}>▼ 啟航</div>
      </div>

      {/* 雜誌式資訊排版（全螢幕、不綁物件） */}
      <div ref={spreadRef} style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: 0 }}>
        {/* 幽靈大字編號 */}
        <div style={{
          position: 'absolute', top: '50%', transform: 'translateY(-56%)',
          [textRight ? 'right' : 'left']: 'clamp(1rem,5vw,5rem)',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(9rem,30vw,21rem)', lineHeight: 1, color: 'transparent',
          WebkitTextStroke: `1.5px ${col}44`,
          userSelect: 'none',
        } as React.CSSProperties}>{String(active + 1).padStart(2, '0')}</div>
        {/* 內文欄 */}
        <div key={active} className="vg-col" style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          [textRight ? 'right' : 'left']: 'clamp(1.6rem,7vw,7rem)',
          width: 'min(440px, 82vw)', textAlign: textRight ? 'right' : 'left',
          pointerEvents: 'auto',
        } as React.CSSProperties}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.34em', color: col, marginBottom: '0.9rem' }}>LOG 0{active + 1} — {a.type === 'research' ? 'RESEARCH' : 'PROJECT'}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '0.6rem', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>{a.title}</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8fa0d8', letterSpacing: '0.1em', marginBottom: '1.1rem' }}>{a.subtitle} · {a.period}</div>
          <p style={{ fontSize: '0.92rem', color: '#cdd4f4', lineHeight: 1.9, marginBottom: '1.2rem', textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>{a.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.3rem', justifyContent: textRight ? 'flex-end' : 'flex-start' }}>
            {(a.tags as readonly string[]).slice(0, 5).map(tg => (
              <span key={tg} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.25em 0.8em', borderRadius: '99px', color: '#aab4e8', border: '1px solid rgba(150,170,255,0.28)', background: 'rgba(6,10,22,0.55)' }}>{tg}</span>
            ))}
          </div>
          <Link href={`/projects/${a.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: col, textDecoration: 'none', borderBottom: `1px solid ${col}`, paddingBottom: '2px' }}>READ FULL LOG →</Link>
        </div>
      </div>

      <div ref={tooltipRef} style={{ position: 'fixed', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#fff', padding: '0.35em 0.9em', borderRadius: '99px', background: 'rgba(5,9,20,0.8)', border: `1px solid rgba(${RGB},0.5)`, whiteSpace: 'nowrap' }} />

      {/* 導航鈕（右下並排） */}
      <div style={{ position: 'fixed', bottom: '1.6rem', right: '1.6rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => {
          const el = scrollEl.current; if (!el) return
          const next = pct < 0.02 ? 0 : (active + 1) % projects.length
          el.scrollTop = ((CAM_START - (MON_Z[next] + 14)) / RANGE) * (el.scrollHeight - el.clientHeight)
        }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#aab6e8', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(5,9,20,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.04 ? 1 : 0, pointerEvents: pct > 0.04 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>下一站 ▸</button>
        <button onClick={() => { if (scrollEl.current) scrollEl.current.scrollTop = 0 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#aab6e8', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(5,9,20,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.04 ? 1 : 0, pointerEvents: pct > 0.04 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>⏮ 返回起點</button>
      </div>

      <style>{`
        @keyframes vgPulse { 0%,100%{ opacity:0.5; transform:translateY(0) } 50%{ opacity:1; transform:translateY(6px) } }
        @keyframes vgIn { from{ opacity:0; transform:translateY(-50%) translateX(0) scale(0.97) } to{ opacity:1; transform:translateY(-50%) scale(1) } }
        .vg-col { animation: vgIn 0.5s ease both; }
      `}</style>
    </div>
  )
}
