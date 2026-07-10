'use client'
/* SKILLS — 奧術星盤：滾輪進場後，按住左鍵「轉動星盤」切換徽記（放開自動吸附）；底部槽位是固定指針 */
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { siteData } from '@/data/portfolio'
import { mountThree, radialTexture, starSphere, NavDock } from '../rig'

const CATS = Object.entries(siteData.skills) as [string, readonly string[]][]
const COLORS = ['#6fb8ff', '#7de8c0', '#ff9d9d', '#ffd08a', '#c4a8ff', '#ff9dc8']
const ACCENT = '#e8c878'
const RGB = '232,200,120'
const GOLD = 0xd8b46a
const N = CATS.length
const TOTAL = CATS.reduce((s, [, sk]) => s + sk.length, 0)
const SIGIL_R = 10.5
const STEP = (Math.PI * 2) / N
/* 徽記 i 的基準角；底部槽位（固定指針）為 -90° */
const baseAngle = (i: number) => (i / N) * Math.PI * 2 + Math.PI / 2
const rotFor = (i: number) => -Math.PI / 2 - baseAngle(i) // 讓徽記 i 對準槽位的盤面轉角

export default function LabSkillsClient() {
  const mountRef = useRef<HTMLDivElement>(null)
  const scrollEl = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const drag = useRef({ rot: rotFor(0), active: false, goal: null as number | null })
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

  // 按住左鍵＝轉動星盤（主要切換方式）
  useEffect(() => {
    const isUI = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest('a,button')
    let px = 0
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0 || isUI(e.target)) return; drag.current.active = true; drag.current.goal = null; px = e.clientX }
    const move = (e: PointerEvent) => { if (!drag.current.active) return; drag.current.rot += (e.clientX - px) * 0.006; px = e.clientX }
    const up = () => { drag.current.active = false }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mount = mountRef.current!
    const { scene, camera, composer, track, dotTex, dispose } = mountThree(mount, { bg: '#070810', fov: 52, fogDensity: 0.006, bloom: [0.85, 0.55, 0.2] })
    camera.position.set(0, 9, 27)

    scene.add(new THREE.AmbientLight(0x8a7a5a, 0.55))
    const key = new THREE.DirectionalLight(0xffe8c0, 1.1); key.position.set(6, 20, 14); scene.add(key)

    const starMats = [starSphere(scene, track, dotTex, 5000, [80, 200], 0.42, 0xf0e4d0, 0.7), starSphere(scene, track, dotTex, 650, [60, 140], 0.9, 0xffffff, 0.6)]
    {
      const nebTex = track(radialTexture([[0, 'rgba(255,255,255,0.6)'], [0.4, 'rgba(190,170,255,0.18)'], [1, 'rgba(80,70,140,0)']]))
      const defs: [number, [number, number, number], number][] = [[0x3a3a7a, [-55, 18, -80], 110], [0x6a5a30, [50, -10, -90], 100], [0x2a3a6a, [-5, 35, -110], 95]]
      defs.forEach(([col, pos, sc]) => { const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: nebTex, color: col, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.25, depthWrite: false }))); sp.position.set(...pos); sp.scale.setScalar(sc); scene.add(sp) })
    }

    // ── 星盤：tilt（固定傾角）> wheel（轉動）+ anchor（固定槽位） ──
    const tilt = new THREE.Group(); tilt.rotation.x = -0.42; scene.add(tilt)
    const wheel = new THREE.Group(); tilt.add(wheel)
    const anchor = new THREE.Object3D(); anchor.position.set(0, -SIGIL_R, 0); tilt.add(anchor)
    // 槽位指針（固定不轉）：底部一枚金色三角 + 弧
    const pointerMat = track(new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }))
    const pointer = new THREE.Mesh(track(new THREE.ConeGeometry(0.5, 1.1, 3)), pointerMat)
    pointer.position.set(0, -SIGIL_R - 3.1, 0); pointer.rotation.z = 0; tilt.add(pointer)
    const pointerArc = new THREE.Mesh(track(new THREE.TorusGeometry(2.6, 0.035, 6, 40, Math.PI * 0.7)), pointerMat)
    pointerArc.position.set(0, -SIGIL_R, 0); pointerArc.rotation.z = Math.PI + Math.PI * 0.15; tilt.add(pointerArc)

    const goldMat = (op: number) => track(new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: op, blending: THREE.AdditiveBlending }))

    const spinRings: { g: THREE.Group; sp: number }[] = []
    const ringSpec: { r: number; sp: number; kind: 'solid' | 'dash' | 'tick' | 'dot' | 'rune' }[] = [
      { r: 3.6, sp: 0.12, kind: 'solid' },
      { r: 5.2, sp: -0.07, kind: 'rune' },
      { r: 6.6, sp: 0.05, kind: 'dash' },
      { r: 8.4, sp: -0.04, kind: 'dot' },
      { r: 12.6, sp: 0.03, kind: 'dash' },
      { r: 13.8, sp: -0.02, kind: 'tick' },
      { r: 15.0, sp: 0.015, kind: 'solid' },
    ]
    ringSpec.forEach(({ r, sp, kind }) => {
      const g = new THREE.Group()
      if (kind === 'solid') {
        g.add(new THREE.Mesh(track(new THREE.TorusGeometry(r, 0.03, 6, 128)), goldMat(0.5)))
      } else if (kind === 'dash') {
        for (let k = 0; k < 9; k++) {
          const arc = new THREE.Mesh(track(new THREE.TorusGeometry(r, 0.028, 6, 22, Math.PI * 2 * 0.07)), goldMat(0.55))
          arc.rotation.z = (k / 9) * Math.PI * 2 + Math.random() * 0.3
          g.add(arc)
        }
      } else if (kind === 'tick') {
        const tickGeo = track(new THREE.BoxGeometry(0.05, 0.42, 0.02))
        for (let k = 0; k < 72; k++) {
          const a = (k / 72) * Math.PI * 2
          const tick = new THREE.Mesh(tickGeo, goldMat(k % 6 === 0 ? 0.75 : 0.35))
          tick.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
          tick.rotation.z = a + Math.PI / 2
          if (k % 6 === 0) tick.scale.y = 1.6
          g.add(tick)
        }
      } else if (kind === 'dot') {
        const n = 100, pos = new Float32Array(n * 3)
        for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; pos[k * 3] = Math.cos(a) * r; pos[k * 3 + 1] = Math.sin(a) * r; pos[k * 3 + 2] = 0 }
        const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        g.add(new THREE.Points(geo, track(new THREE.PointsMaterial({ color: GOLD, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.6, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))))
      } else {
        const runeGeo = track(new THREE.OctahedronGeometry(0.14, 0))
        for (let k = 0; k < 24; k++) {
          const a = (k / 24) * Math.PI * 2
          const rune = new THREE.Mesh(runeGeo, goldMat(0.6))
          rune.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
          rune.rotation.z = a
          g.add(rune)
        }
      }
      wheel.add(g); spinRings.push({ g, sp })
    })
    const coreMat = track(new THREE.MeshStandardMaterial({ color: 0xffe8b0, emissive: 0xffd88a, emissiveIntensity: 0.8, roughness: 0.25, metalness: 0.4, flatShading: true }))
    const core = new THREE.Mesh(track(new THREE.OctahedronGeometry(1.1, 0)), coreMat)
    core.scale.set(0.85, 1.3, 0.85); wheel.add(core)
    const coreHalo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: track(radialTexture([[0, `rgba(${RGB},0.7)`], [0.4, `rgba(${RGB},0.22)`], [1, `rgba(${RGB},0)`]])), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })))
    coreHalo.scale.setScalar(8); wheel.add(coreHalo)

    // 徽記 + 公轉寶石
    type Gem = { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; halo: THREE.Sprite; cat: number; k: number; skill: string }
    const sigils: THREE.Mesh[] = []
    const sigilMats: THREE.MeshStandardMaterial[] = []
    const sigilGroups: THREE.Group[] = []
    const gems: Gem[] = []
    const spokes: THREE.MeshBasicMaterial[] = []
    const gemHaloTex = track(radialTexture([[0, 'rgba(255,255,255,0.85)'], [0.4, 'rgba(255,255,255,0.25)'], [1, 'rgba(255,255,255,0)']]))
    CATS.forEach(([, skills], ci) => {
      const col = new THREE.Color(COLORS[ci])
      const a = baseAngle(ci)
      const sg = new THREE.Group()
      sg.position.set(Math.cos(a) * SIGIL_R, Math.sin(a) * SIGIL_R, 0)
      wheel.add(sg); sigilGroups.push(sg)
      const spokeMat = goldMat(0.2)
      const len = SIGIL_R - 4
      const spoke = new THREE.Mesh(track(new THREE.CylinderGeometry(0.022, 0.022, len, 6)), spokeMat)
      spoke.position.set(Math.cos(a) * (4 + len / 2), Math.sin(a) * (4 + len / 2), 0)
      spoke.rotation.z = a + Math.PI / 2
      wheel.add(spoke); spokes.push(spokeMat)
      sg.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.5, 0.045, 8, 48)), goldMat(0.7)))
      sg.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.9, 0.022, 6, 48)), goldMat(0.4)))
      const sm = track(new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, roughness: 0.25, metalness: 0.3, flatShading: true }))
      const crystal = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.78, 0)), sm)
      crystal.scale.set(0.75, 1.15, 0.75)
      sg.add(crystal); sigils.push(crystal); sigilMats.push(sm)
      skills.forEach((sk, k) => {
        const gm = track(new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.7, roughness: 0.3 }))
        const gem = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.24, 0)), gm)
        gem.scale.setScalar(0.001)
        sg.add(gem)
        const halo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: gemHaloTex, color: col, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })))
        halo.scale.setScalar(1.1)
        sg.add(halo)
        gems.push({ mesh: gem, mat: gm, halo, cat: ci, k, skill: sk })
      })
    })

    // 金塵
    const DN = 500, dPos = new Float32Array(DN * 3), dSeed = new Float32Array(DN)
    for (let i = 0; i < DN; i++) { dPos[i * 3] = (Math.random() - 0.5) * 44; dPos[i * 3 + 1] = (Math.random() - 0.5) * 26; dPos[i * 3 + 2] = (Math.random() - 0.5) * 18; dSeed[i] = Math.random() * Math.PI * 2 }
    const dGeo = track(new THREE.BufferGeometry()); const dAttr = new THREE.BufferAttribute(dPos, 3); dGeo.setAttribute('position', dAttr)
    scene.add(new THREE.Points(dGeo, track(new THREE.PointsMaterial({ color: 0xf0dcae, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))))

    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const clock = new THREE.Clock()
    const tmpV = new THREE.Vector3(), wp = new THREE.Vector3()
    const camT = new THREE.Vector3(0, 9, 27), lookT = new THREE.Vector3(0, 0, 0), lookCur = new THREE.Vector3(0, 0, 0)
    const norm = (x: number) => Math.atan2(Math.sin(x), Math.cos(x))
    let raf = 0, activeCur = 0
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, p = progress.current
      const focusMode = p > 0.45

      // 盤面轉角：hero 自轉；focus 時放開自動吸附（或吸附到點擊目標）
      if (!drag.current.active) {
        if (!focusMode) drag.current.rot += dt * 0.04
        else {
          const goal = drag.current.goal
          let target: number
          if (goal !== null) {
            target = drag.current.rot + norm(rotFor(goal) - drag.current.rot)
            if (Math.abs(target - drag.current.rot) < 0.01) drag.current.goal = null
          } else {
            // 吸附到最近的徽記
            let bestI = 0, bestD = Infinity
            for (let i = 0; i < N; i++) { const d = Math.abs(norm(rotFor(i) - drag.current.rot)); if (d < bestD) { bestD = d; bestI = i } }
            target = drag.current.rot + norm(rotFor(bestI) - drag.current.rot)
          }
          drag.current.rot += (target - drag.current.rot) * 0.09
        }
      }
      wheel.rotation.z = drag.current.rot
      spinRings.forEach(({ g, sp }) => { g.rotation.z += dt * sp })
      core.rotation.y += dt * 0.4
      coreMat.emissiveIntensity = 0.7 + 0.25 * Math.sin(t * 1.6)

      // 目前對準槽位的徽記
      let idx = 0, bd = Infinity
      for (let i = 0; i < N; i++) { const d = Math.abs(norm(rotFor(i) - drag.current.rot)); if (d < bd) { bd = d; idx = i } }
      if (focusMode && idx !== activeCur) { activeCur = idx; setActive(idx) }

      pointerMat.opacity = focusMode ? 0.85 : 0.25

      sigilMats.forEach((m, i) => { m.emissiveIntensity += ((focusMode && i === idx ? 1.0 : 0.26) - m.emissiveIntensity) * 0.07 })
      sigils.forEach((s, i) => { s.rotation.y += dt * (focusMode && i === idx ? 1.2 : 0.3) })
      spokes.forEach((m, i) => { m.opacity += ((focusMode && i === idx ? 0.75 : 0.18) - m.opacity) * 0.07 })
      gems.forEach(g => {
        const on = focusMode && g.cat === idx
        const n = CATS[g.cat][1].length
        const ga = t * 0.55 + (g.k / n) * Math.PI * 2
        const gr = 2.75
        g.mesh.position.set(Math.cos(ga) * gr, Math.sin(ga) * gr, 0.35)
        g.halo.position.copy(g.mesh.position)
        const sc = on ? 1 + 0.15 * Math.sin(t * 2.5 + g.k) : 0.001
        g.mesh.scale.x += (sc - g.mesh.scale.x) * 0.09
        g.mesh.scale.y = g.mesh.scale.z = g.mesh.scale.x
        g.mesh.rotation.z += dt * 1.2
        const hm = g.halo.material as THREE.SpriteMaterial
        hm.opacity += ((on ? 0.65 : 0) - hm.opacity) * 0.09
      })
      for (let i = 0; i < DN; i++) { dPos[i * 3 + 1] += Math.sin(t * 0.4 + dSeed[i]) * 0.0022 + 0.0016; if (dPos[i * 3 + 1] > 13) dPos[i * 3 + 1] = -13 }
      dAttr.needsUpdate = true
      starMats.forEach((m, i) => { m.opacity = (i === 0 ? 0.7 : 0.6) * (0.75 + 0.25 * Math.sin(t * (1.2 + i) + i)) })

      // 相機：全盤 → 貼近固定槽位
      if (!focusMode) { camT.set(0, 9, 27); lookT.set(0, 0, 0) }
      else {
        anchor.getWorldPosition(wp)
        camT.set(wp.x * 0.6, wp.y * 0.6 + 4.2, wp.z + 11.5)
        lookT.copy(wp)
      }
      camera.position.lerp(camT, 0.05)
      lookCur.lerp(lookT, 0.05)
      camera.lookAt(lookCur)
      camera.updateMatrixWorld()

      // hover
      ndc.set(mouse.current.x, -mouse.current.y)
      raycaster.setFromCamera(ndc, camera)
      const meshes: THREE.Mesh[] = [...sigils, ...gems.filter(g => g.mesh.scale.x > 0.5).map(g => g.mesh)]
      const hits = raycaster.intersectObjects(meshes, false)
      let label = '', hCat = -1
      if (hits.length > 0) {
        const obj = hits[0].object as THREE.Mesh
        const si = sigils.indexOf(obj)
        if (si >= 0) { label = `✦ ${CATS[si][0]}`; hCat = si }
        else { const g = gems.find(x => x.mesh === obj); if (g) { label = `◆ ${g.skill}`; hCat = g.cat } }
      }
      hoverSeg.current = hCat
      if (tooltipRef.current) {
        if (label) {
          ;(hits[0].object as THREE.Mesh).getWorldPosition(tmpV); tmpV.project(camera)
          tooltipRef.current.style.opacity = '1'
          tooltipRef.current.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * window.innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * window.innerHeight - 22}px) translate(-50%,-100%)`
          tooltipRef.current.textContent = label
        } else tooltipRef.current.style.opacity = '0'
      }
      if (scrollEl.current) scrollEl.current.style.cursor = drag.current.active ? 'grabbing' : label ? 'pointer' : 'grab'

      composer.render()
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(raf); dispose() }
  }, [mounted])

  // 點擊徽記/寶石 → 轉盤把它帶到槽位（並確保進入 focus）
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('a,button')) return
      const i = hoverSeg.current
      if (i < 0) return
      drag.current.goal = i
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
  const panelOn = pct > 0.5
  const [cat, skills] = CATS[active]
  const col = COLORS[active]

  return (
    <div ref={scrollEl} onScroll={onScroll} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#070810', color: '#f2ead8', fontFamily: 'var(--font-body)' }}>
      <div style={{ height: '250vh' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {mounted && <div ref={mountRef} style={{ width: '100%', height: '100%' }} />}
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 6, background: `rgba(${RGB},0.1)` }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: ACCENT, boxShadow: `0 0 18px rgba(${RGB},0.6)` }} />
      </div>
      <NavDock current="/lab/skills" accent={ACCENT} />
      <Link href="/" style={{ position: 'fixed', top: '1.4rem', right: '1.4rem', zIndex: 7, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.18em', color: 'rgba(242,234,216,0.5)', textDecoration: 'none' }}>EXIT ↗</Link>

      {/* Hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', opacity: heroOp }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.5em', color: ACCENT, marginBottom: '1.4rem', textShadow: `0 0 20px rgba(${RGB},0.6)` }}>ARCANE ASTROLABE · {TOTAL} GEMS</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,10vw,7rem)', fontWeight: 700, margin: 0, letterSpacing: '0.04em', background: `linear-gradient(180deg,#fff,${ACCENT})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SKILLS</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c8b088', marginTop: '1.2rem', letterSpacing: '0.14em' }}>捲動進場 · 按住左鍵轉動星盤切換徽記</p>
        <div style={{ marginTop: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#8a7550', animation: 'asPulse 1.8s ease-in-out infinite' }}>▼ 進入星盤</div>
      </div>

      {/* 操作提示（focus 時） */}
      <div style={{ position: 'fixed', left: '50%', bottom: '1.7rem', transform: 'translateX(-50%)', zIndex: 5, pointerEvents: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.24em', color: '#9a8560', opacity: panelOn ? 0.9 : 0, transition: 'opacity 0.4s' }}>⟲ 按住左鍵轉動星盤切換</div>

      {/* 側欄徽記面板（左右交替） */}
      <div key={panelOn ? active : -1} className={panelOn ? 'as-panel' : undefined} style={{
        position: 'fixed', top: '50%', zIndex: 3,
        [active % 2 === 0 ? 'right' : 'left']: 'clamp(1.4rem,6vw,5.5rem)',
        width: 'min(340px, 76vw)', pointerEvents: 'none',
        opacity: panelOn ? 1 : 0, transition: 'opacity 0.35s',
        transform: 'translateY(-50%)',
      } as React.CSSProperties}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.34em', color: ACCENT, marginBottom: '0.8rem' }}>SIGIL 0{active + 1} / 0{N}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4.2vw,3rem)', fontWeight: 700, color: '#fff8ea', lineHeight: 1.1, marginBottom: '0.4rem', textShadow: `0 0 44px ${col}66` }}>{cat}</h2>
        <div style={{ width: '68px', height: '1px', background: `linear-gradient(90deg, ${ACCENT}, transparent)`, marginBottom: '1.2rem', boxShadow: `0 0 8px rgba(${RGB},0.5)` }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {skills.map((s, k) => (
            <div key={s} className="as-gem" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', animationDelay: `${k * 90}ms` }}>
              <span style={{ color: col, fontSize: '0.75rem', textShadow: `0 0 10px ${col}`, flexShrink: 0 }}>◆</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.94rem', color: '#f6efdc', letterSpacing: '0.05em' }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.26em', color: '#9a8560' }}>{skills.length} GEMS ORBITING</div>
      </div>

      <div ref={tooltipRef} style={{ position: 'fixed', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', color: '#fff', padding: '0.35em 0.9em', borderRadius: '99px', background: 'rgba(9,8,14,0.85)', border: `1px solid rgba(${RGB},0.5)`, whiteSpace: 'nowrap' }} />

      {/* 導航鈕（右下並排） */}
      <div style={{ position: 'fixed', bottom: '1.6rem', right: '1.6rem', zIndex: 7, display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => {
          const el = scrollEl.current
          if (progress.current < 0.45 && el) { el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' }); drag.current.goal = 0 }
          else drag.current.goal = (active + 1) % N
        }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#e0cba0', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(9,8,14,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.1 ? 1 : 0, pointerEvents: pct > 0.1 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>下一枚 ▸</button>
        <button onClick={() => { drag.current.goal = null; drag.current.rot = rotFor(0); if (scrollEl.current) scrollEl.current.scrollTop = 0 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: '#e0cba0', cursor: 'pointer', padding: '0.5em 1.1em', border: `1px solid rgba(${RGB},0.35)`, borderRadius: '99px', background: 'rgba(9,8,14,0.6)', backdropFilter: 'blur(8px)', opacity: pct > 0.1 ? 1 : 0, pointerEvents: pct > 0.1 ? 'auto' : 'none', transition: 'opacity 0.3s' }}>⌖ 回到全盤</button>
      </div>

      <style>{`
        @keyframes asPulse { 0%,100%{ opacity:0.5 } 50%{ opacity:1 } }
        @keyframes asIn { from{ opacity:0; transform:translateY(-50%) scale(0.96) } to{ opacity:1; transform:translateY(-50%) scale(1) } }
        .as-panel { animation: asIn 0.45s ease both; }
        @keyframes asGem { from{ opacity:0; transform:translateX(-12px) } to{ opacity:1; transform:translateX(0) } }
        .as-gem { animation: asGem 0.4s ease both; }
      `}</style>
    </div>
  )
}
