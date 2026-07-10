'use client'
/* BUILDS — 全息展示台：機庫旋轉展台上的線框全息投影，右側終端機讀出規格 */
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { siteData } from '@/data/portfolio'
import { mountThree, radialTexture, NavDock } from '../rig'

const COLORS = ['#4dd8ff', '#63e6be', '#ffb86b']
const ACCENT = '#4dd8ff'
const RGB = '77,216,255'
const builds = siteData.builds
const N = builds.length

export default function LabBuildsClient() {
  const mountRef = useRef<HTMLDivElement>(null)
  const scrollEl = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const manual = useRef({ rot: 0, active: false, goal: null as number | null })
  const hoverSeg = useRef(-1)
  const [pct, setPct] = useState(0)
  const [active, setActive] = useState(0)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 } }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // 拖曳＝親手轉動展台
  useEffect(() => {
    const isUI = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest('a,button')
    let px = 0
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0 || isUI(e.target)) return; manual.current.active = true; manual.current.goal = null; px = e.clientX }
    const move = (e: PointerEvent) => { if (!manual.current.active) return; manual.current.rot += (e.clientX - px) * 0.006; px = e.clientX }
    const up = () => { manual.current.active = false }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mount = mountRef.current!
    const { scene, camera, composer, track, dotTex, dispose } = mountThree(mount, { bg: '#020608', fov: 55, fogDensity: 0.014, bloom: [1.0, 0.6, 0.15] })
    camera.position.set(0, 7, 22)

    scene.add(new THREE.AmbientLight(0x2a4a5a, 0.7))
    const top = new THREE.PointLight(0x66d9ff, 1.6, 60); top.position.set(0, 14, 4); scene.add(top)

    // ── 機庫地板：網格 + 展台 ──
    const grid = new THREE.GridHelper(90, 45, 0x0e3a4a, 0x082430)
    ;(grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.55
    grid.position.y = -0.01; scene.add(grid)
    const dais = new THREE.Mesh(track(new THREE.CylinderGeometry(8.6, 9.2, 0.5, 64)), track(new THREE.MeshStandardMaterial({ color: 0x0c1a24, roughness: 0.4, metalness: 0.7 })))
    dais.position.y = 0.25; scene.add(dais)
    const rim = new THREE.Mesh(track(new THREE.TorusGeometry(8.9, 0.07, 8, 96)), track(new THREE.MeshBasicMaterial({ color: 0x33c6f0, transparent: true, opacity: 0.85 })))
    rim.rotation.x = Math.PI / 2; rim.position.y = 0.52; scene.add(rim)
    { // 展台底光
      const tex = track(radialTexture([[0, `rgba(${RGB},0.35)`], [0.5, `rgba(${RGB},0.12)`], [1, `rgba(${RGB},0)`]]))
      const pool = new THREE.Mesh(track(new THREE.CircleGeometry(13, 48)), track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })))
      pool.rotation.x = -Math.PI / 2; pool.position.y = 0.02; scene.add(pool)
    }
    // （聚光燈改為掛在每艘船上，跟著展台旋轉；見船隻建立處）
    const coneMats: THREE.MeshBasicMaterial[] = []
    const poolMats: THREE.MeshBasicMaterial[] = []
    // 背景吊臂剪影
    const armMat = track(new THREE.MeshStandardMaterial({ color: 0x0a1620, roughness: 0.9 }))
    for (let i = 0; i < 5; i++) {
      const arm = new THREE.Mesh(track(new THREE.BoxGeometry(0.8, 18, 0.8)), armMat)
      arm.position.set(-26 + i * 13, 9, -24); scene.add(arm)
      const beam = new THREE.Mesh(track(new THREE.BoxGeometry(10, 0.7, 0.7)), armMat)
      beam.position.set(-26 + i * 13 + 4, 16, -24); scene.add(beam)
    }
    // 漂浮微粒
    {
      const n = 600, pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 50; pos[i * 3 + 1] = Math.random() * 16; pos[i * 3 + 2] = (Math.random() - 0.5) * 50 }
      const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, track(new THREE.PointsMaterial({ color: 0x66d9ff, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))))
    }

    // ── 全息船 ×3（線框 + 幽靈面 + 掃描環）──
    const platter = new THREE.Group(); platter.position.y = 0.5; scene.add(platter)
    const ships: THREE.Group[] = []
    const scanRings: THREE.Mesh[] = []
    const holoMats: THREE.LineBasicMaterial[] = []
    const shipAngle = (i: number) => (i / N) * Math.PI * 2
    builds.forEach((b, i) => {
      const col = new THREE.Color(COLORS[i])
      const g = new THREE.Group()
      const a = shipAngle(i)
      g.position.set(Math.cos(a) * 5.4, 1.7, Math.sin(a) * 5.4)
      g.rotation.y = -a + Math.PI / 2
      const lineMat = track(new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 })); holoMats.push(lineMat)
      const ghostMat = track(new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.05, depthWrite: false }))
      const parts: [THREE.BufferGeometry, THREE.Vector3, THREE.Euler][] = [
        [new THREE.CylinderGeometry(0.85, 1.0, 3.6, 12), new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, Math.PI / 2)],
        [new THREE.ConeGeometry(0.85, 1.5, 12), new THREE.Vector3(2.55, 0, 0), new THREE.Euler(0, 0, -Math.PI / 2)],
        [new THREE.BoxGeometry(1.4, 0.1, 2.8), new THREE.Vector3(-1.2, 0, 0), new THREE.Euler(0, 0, 0)],
        [new THREE.CylinderGeometry(0.35, 0.5, 0.9, 8), new THREE.Vector3(-2.1, 0, 0.8), new THREE.Euler(0, 0, Math.PI / 2)],
        [new THREE.CylinderGeometry(0.35, 0.5, 0.9, 8), new THREE.Vector3(-2.1, 0, -0.8), new THREE.Euler(0, 0, Math.PI / 2)],
      ]
      parts.forEach(([geo, pos, rot]) => {
        track(geo)
        const edges = new THREE.LineSegments(track(new THREE.EdgesGeometry(geo, 12)), lineMat)
        edges.position.copy(pos); edges.rotation.copy(rot); g.add(edges)
        const ghost = new THREE.Mesh(geo, ghostMat)
        ghost.position.copy(pos); ghost.rotation.copy(rot); g.add(ghost)
      })
      // 掃描環（上下掃過船身）
      const scan = new THREE.Mesh(track(new THREE.TorusGeometry(1.6, 0.02, 6, 40)), track(new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })))
      scan.rotation.x = Math.PI / 2; g.add(scan); scanRings.push(scan)
      // 台座光柱
      const beamTex = track(radialTexture([[0, `rgba(255,255,255,0.35)`], [0.6, `rgba(255,255,255,0.06)`], [1, 'rgba(255,255,255,0)']]))
      const beam = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: beamTex, color: col, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.5 })))
      beam.scale.set(3.2, 5.4, 1); beam.position.y = -0.2; g.add(beam)
      // 專屬聚光燈錐（跟著展台轉，作用中最亮）
      const coneMat = track(new THREE.MeshBasicMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.03, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
      const cone = new THREE.Mesh(track(new THREE.ConeGeometry(2.4, 11, 32, 1, true)), coneMat)
      cone.position.y = 5.2; g.add(cone); coneMats.push(coneMat)
      // 腳下光池
      const poolMat = track(new THREE.MeshBasicMaterial({ map: track(radialTexture([[0, 'rgba(255,255,255,0.6)'], [0.6, 'rgba(255,255,255,0.14)'], [1, 'rgba(255,255,255,0)']])), color: col, transparent: true, depthWrite: false, opacity: 0.2 }))
      const pool2 = new THREE.Mesh(track(new THREE.CircleGeometry(2.7, 36)), poolMat)
      pool2.rotation.x = -Math.PI / 2; pool2.position.y = -1.62; g.add(pool2); poolMats.push(poolMat)
      platter.add(g); ships.push(g)
    })

    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const clock = new THREE.Clock()
    const tmpV = new THREE.Vector3()
    const lookT = new THREE.Vector3(0, 2.2, 0)
    const norm = (x: number) => Math.atan2(Math.sin(x), Math.cos(x))
    const rotFor = (i: number) => shipAngle(i) - Math.PI / 2
    let raf = 0, activeCur = -1
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, p = progress.current
      const focusMode = p > 0.45

      // 展台旋轉：hero 自轉；focus 時由左鍵拖曳控制，放開吸附最近一艘
      if (!manual.current.active) {
        if (!focusMode) manual.current.rot += dt * 0.12
        else {
          const goal = manual.current.goal
          let target: number
          if (goal !== null) {
            target = manual.current.rot + norm(rotFor(goal) - manual.current.rot)
            if (Math.abs(target - manual.current.rot) < 0.01) manual.current.goal = null
          } else {
            let bi = 0, bd = Infinity
            for (let i2 = 0; i2 < N; i2++) { const d = Math.abs(norm(rotFor(i2) - manual.current.rot)); if (d < bd) { bd = d; bi = i2 } }
            target = manual.current.rot + norm(rotFor(bi) - manual.current.rot)
          }
          manual.current.rot += (target - manual.current.rot) * 0.08
        }
      }
      platter.rotation.y = manual.current.rot
      // 目前在正前方的船
      let idx = 0
      { let bd = Infinity; for (let i2 = 0; i2 < N; i2++) { const d = Math.abs(norm(rotFor(i2) - manual.current.rot)); if (d < bd) { bd = d; idx = i2 } } }
      if (focusMode && idx !== activeCur) { activeCur = idx; setActive(idx) }

      // 相機：hero 遠觀 → 聚焦正對前方
      tmpV.set(0, focusMode ? 3.6 : 7, focusMode ? 14.6 : 22)
      camera.position.lerp(tmpV, 0.06)
      lookT.lerp(tmpV.set(0, focusMode ? 2.3 : 1.6, focusMode ? 5.4 : 0), 0.06)
      camera.lookAt(lookT)
      camera.updateMatrixWorld()

      // 聚光燈：正前方作用中的最亮
      coneMats.forEach((m, i) => { const tg = focusMode ? (i === idx ? 0.045 : 0.012) : 0.028; m.opacity += (tg - m.opacity) * 0.06 })
      poolMats.forEach((m, i) => { const tg = focusMode ? (i === idx ? 0.34 : 0.06) : 0.18; m.opacity += (tg - m.opacity) * 0.06 })

      // 全息閃爍 + 掃描
      holoMats.forEach((m, i) => { m.opacity = 0.75 + 0.2 * Math.sin(t * 9 + i * 2) + (Math.random() < 0.02 ? -0.3 : 0) })
      scanRings.forEach((s, i) => { const u = (t * 0.35 + i * 0.33) % 1; s.position.y = -1.4 + u * 3.2; (s.material as THREE.MeshBasicMaterial).opacity = 0.85 * Math.sin(u * Math.PI) })
      rim.rotation.z += dt * 0.2

      // hover
      ndc.set(mouse.current.x, -mouse.current.y)
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(ships, true)
      let hIdx = -1
      if (hits.length > 0) { hIdx = ships.findIndex(gg => { let o: THREE.Object3D | null = hits[0].object; while (o) { if (o === gg) return true; o = o.parent } return false }) }
      hoverSeg.current = hIdx
      ships.forEach((s, i) => { const sc = i === hIdx ? 1.12 : 1; s.scale.x += (sc - s.scale.x) * 0.15; s.scale.y = s.scale.z = s.scale.x })
      if (tooltipRef.current) {
        if (hIdx >= 0) {
          ships[hIdx].getWorldPosition(tmpV); tmpV.project(camera)
          tooltipRef.current.style.opacity = '1'
          tooltipRef.current.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * window.innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * window.innerHeight - 40}px) translate(-50%,-100%)`
          tooltipRef.current.textContent = `UNIT 0${hIdx + 1} · ${builds[hIdx].title}`
        } else tooltipRef.current.style.opacity = '0'
      }
      if (scrollEl.current) scrollEl.current.style.cursor = manual.current.active ? 'grabbing' : hIdx >= 0 ? 'pointer' : 'grab'

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
      manual.current.goal = i // 轉盤把它轉到正前方
      const el = scrollEl.current; if (!el) return
      if (progress.current < 0.45) el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' })
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const onScroll = () => {
    const el = scrollEl.current; if (!el) return
    const p = el.scrollTop / ((el.scrollHeight - el.clientHeight) || 1)
    progress.current = p; setPct(p)
  }

  const heroOp = Math.max(0, 1 - pct / 0.3)
  const consoleOn = pct > 0.5
  const b = builds[active]
  const col = COLORS[active]

  return (
    <div ref={scrollEl} onScroll={onScroll} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#020608', color: '#dff4ff', fontFamily: 'var(--font-body)' }}>
      <div style={{ height: '250vh' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {mounted && <div ref={mountRef} style={{ width: '100%', height: '100%' }} />}
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 6, background: `rgba(${RGB},0.1)` }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: ACCENT, boxShadow: `0 0 18px rgba(${RGB},0.6)` }} />
      </div>
      <NavDock current="/lab/builds" accent={ACCENT} />
      <Link href="/" style={{ position: 'fixed', top: '1.4rem', right: '1.4rem', zIndex: 7, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.18em', color: 'rgba(223,244,255,0.5)', textDecoration: 'none' }}>EXIT ↗</Link>

      {/* Hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', opacity: heroOp }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.5em', color: ACCENT, marginBottom: '1.4rem', textShadow: `0 0 20px rgba(${RGB},0.6)` }}>HOLO-DOCK · 03 UNITS</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,10vw,7rem)', fontWeight: 700, margin: 0, letterSpacing: '0.04em', background: `linear-gradient(180deg,#fff,${ACCENT})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BUILDS</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#7fb8d0', marginTop: '1.2rem', letterSpacing: '0.14em' }}>捲動進場 · 按住左鍵轉動展示台切換</p>
        <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#4d7890', animation: 'hdPulse 1.8s ease-in-out infinite' }}>▼ 啟動檢閱</div>
      </div>

      {/* 右側終端機 */}
      <div key={consoleOn ? active : -1} className={consoleOn ? 'hd-console' : undefined} style={{
        position: 'fixed', right: '1.6rem', top: '50%', zIndex: 4,
        width: 'min(370px, 84vw)',
        background: 'rgba(3,10,14,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid rgba(${RGB},0.25)`, borderLeft: `3px solid ${col}`,
        borderRadius: '10px', overflow: 'hidden',
        opacity: consoleOn ? 1 : 0, pointerEvents: consoleOn ? 'auto' : 'none',
        transform: `translateY(-50%) translateX(${consoleOn ? 0 : 30}px)`,
        transition: 'opacity 0.4s, transform 0.4s',
        boxShadow: `0 14px 50px rgba(0,0,0,0.6), 0 0 34px rgba(${RGB},0.08)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderBottom: `1px solid rgba(${RGB},0.18)`, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#6fa8c0' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, boxShadow: `0 0 8px ${col}` }} />
          DOCK-0{active + 1} · SPEC READOUT
        </div>
        <div style={{ padding: '1.1rem 1.2rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ fontSize: '0.62rem', color: '#5f92aa', letterSpacing: '0.16em', marginBottom: '0.2rem' }}>&gt; UNIT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.7rem' }}>{b.title}</div>
          <div style={{ fontSize: '0.62rem', color: '#5f92aa', letterSpacing: '0.16em', marginBottom: '0.2rem' }}>&gt; CLASS</div>
          <div style={{ fontSize: '0.78rem', color: col, marginBottom: '0.7rem' }}>{b.group} · {b.subtitle}</div>
          <div style={{ fontSize: '0.62rem', color: '#5f92aa', letterSpacing: '0.16em', marginBottom: '0.3rem' }}>&gt; BRIEF</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: '#c8e8f4', lineHeight: 1.75, marginBottom: '0.8rem' }}>{b.description}</p>
          <div style={{ fontSize: '0.62rem', color: '#5f92aa', letterSpacing: '0.16em', marginBottom: '0.4rem' }}>&gt; STACK</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {(b.tags as readonly string[]).slice(0, 5).map(tg => (
              <span key={tg} style={{ fontSize: '0.6rem', padding: '0.2em 0.7em', borderRadius: '3px', color: '#9fd4e8', border: `1px solid rgba(${RGB},0.3)`, background: `rgba(${RGB},0.06)` }}>{tg}</span>
            ))}
          </div>
          <Link href={`/builds/${b.id}`} style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: col, textDecoration: 'none', borderBottom: `1px solid ${col}`, paddingBottom: '1px' }}>OPEN FULL DOSSIER →</Link>
        </div>
      </div>

      <div ref={tooltipRef} style={{ position: 'fixed', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#fff', padding: '0.35em 0.9em', borderRadius: '99px', background: 'rgba(3,10,14,0.8)', border: `1px solid rgba(${RGB},0.5)`, whiteSpace: 'nowrap' }} />

      {/* 導航鈕（右下並排） */}
      <div style={{ position: 'fixed', bottom: '1.6rem', right: '1.6rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => {
          const el = scrollEl.current
          if (progress.current < 0.45 && el) { el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' }); manual.current.goal = 0 }
          else manual.current.goal = (active + 1) % N
        }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#a8d8ec', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(3,10,14,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.1 ? 1 : 0, pointerEvents: pct > 0.1 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>下一艘 ▸</button>
        <button onClick={() => { manual.current.goal = null; manual.current.rot = 0; if (scrollEl.current) scrollEl.current.scrollTop = 0 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#a8d8ec', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(3,10,14,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.1 ? 1 : 0, pointerEvents: pct > 0.1 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>↺ 重置展示</button>
      </div>

      <style>{`
        @keyframes hdPulse { 0%,100%{ opacity:0.5 } 50%{ opacity:1 } }
        @keyframes hdGlitch { 0%{ opacity:0; transform:translateY(-50%) translateX(14px) skewX(3deg) } 30%{ opacity:1; transform:translateY(-50%) translateX(-3px) skewX(-1deg) } 100%{ opacity:1; transform:translateY(-50%) translateX(0) } }
        .hd-console { animation: hdGlitch 0.35s ease both; }
      `}</style>
    </div>
  )
}
