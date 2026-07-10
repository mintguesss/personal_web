'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { THEME, type Focus, type Hover, type Drag } from './themes'

function radialTexture(stops: [number, string][]) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
function hexShift(hex: number, amt: number) {
  const r = Math.min(255, Math.max(0, ((hex >> 16) & 255) + amt))
  const g = Math.min(255, Math.max(0, ((hex >> 8) & 255) + amt))
  const b = Math.min(255, Math.max(0, (hex & 255) + amt))
  return `rgb(${r},${g},${b})`
}

/* ── 行星表面：各行星專屬的真實風格紋理 ── */
function mixHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16)
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t)
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t)
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t)
  return `rgb(${r},${g},${bl})`
}
function newCanvas(s = 512) {
  const c = document.createElement('canvas'); c.width = c.height = s
  return { c, ctx: c.getContext('2d')! }
}
function toTex(c: HTMLCanvasElement) { const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t }
function iceCaps(ctx: CanvasRenderingContext2D, s: number, strength = 0.85) {
  for (let cap = 0; cap < 2; cap++) {
    const capH = s * (0.08 + Math.random() * 0.04)
    for (let yy = 0; yy < capH; yy += 2) {
      ctx.globalAlpha = strength * (1 - yy / capH)
      ctx.fillStyle = '#eef6ff'
      ctx.fillRect(0, cap === 0 ? yy : s - yy - 2, s, 2)
    }
  }
  ctx.globalAlpha = 1
}
/* 氣態巨行星：平滑色帶 + 湍流 +（可選）大紅斑 */
function gasTexture(colA: string, colB: string, colC: string, spot: boolean) {
  const { c, ctx } = newCanvas(); const s = 512
  const seed = Math.random() * 10
  for (let y = 0; y < s; y++) {
    const v = (Math.sin(y * 0.021 + seed) * 0.5 + Math.sin(y * 0.055 + seed * 2.7) * 0.3 + Math.sin(y * 0.012 + seed * 5.1) * 0.2 + 1) / 2
    ctx.fillStyle = v < 0.45 ? mixHex(colA, colB, v / 0.45) : mixHex(colB, colC, (v - 0.45) / 0.55)
    ctx.fillRect(0, y, s, 1)
  }
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.07 + Math.random() * 0.09
    ctx.fillStyle = Math.random() > 0.5 ? colA : colC
    ctx.beginPath(); ctx.ellipse(Math.random() * s, Math.random() * s, 20 + Math.random() * 70, 2 + Math.random() * 5, 0, 0, Math.PI * 2); ctx.fill()
  }
  if (spot) {
    ctx.globalAlpha = 0.8; ctx.fillStyle = '#b8431a'
    ctx.beginPath(); ctx.ellipse(s * 0.7, s * 0.6, 42, 22, -0.1, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#e07a4a'
    ctx.beginPath(); ctx.ellipse(s * 0.7, s * 0.6, 28, 13, -0.1, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.3; ctx.strokeStyle = '#f5c9a8'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.ellipse(s * 0.7, s * 0.6, 46, 25, -0.1, 0, Math.PI * 2); ctx.stroke()
  }
  ctx.globalAlpha = 1
  return toTex(c)
}
/* 海洋行星：海洋 + 大陸 + 冰蓋 */
function terraTexture() {
  const { c, ctx } = newCanvas(); const s = 512
  const og = ctx.createLinearGradient(0, 0, 0, s)
  og.addColorStop(0, '#14395e'); og.addColorStop(0.5, '#1d5a8c'); og.addColorStop(1, '#14395e')
  ctx.fillStyle = og; ctx.fillRect(0, 0, s, s)
  for (let k = 0; k < 9; k++) {
    const cx = Math.random() * s, cy = s * 0.16 + Math.random() * s * 0.68
    const col = ['#3e7a3a', '#57853f', '#8a7a4a'][k % 3]
    // 淺海緣
    ctx.fillStyle = '#2e7ba6'
    for (let i = 0; i < 42; i++) { ctx.globalAlpha = 0.5; const a = Math.random() * Math.PI * 2, d = Math.random() * 38; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, 6 + Math.random() * 16, 0, Math.PI * 2); ctx.fill() }
    // 陸地
    ctx.fillStyle = col
    for (let i = 0; i < 42; i++) { ctx.globalAlpha = 0.95; const a = Math.random() * Math.PI * 2, d = Math.random() * 32; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, 4 + Math.random() * 13, 0, Math.PI * 2); ctx.fill() }
    // 山脈陰影
    ctx.fillStyle = '#2c5228'
    for (let i = 0; i < 12; i++) { ctx.globalAlpha = 0.55; const a = Math.random() * Math.PI * 2, d = Math.random() * 22; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, 2 + Math.random() * 6, 0, Math.PI * 2); ctx.fill() }
  }
  iceCaps(ctx, s, 0.9)
  return toTex(c)
}
/* 雲層（透明貼圖，罩在海洋行星外） */
function cloudTexture() {
  const { c, ctx } = newCanvas(256); const s = 256
  ctx.clearRect(0, 0, s, s)
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 46; i++) {
    ctx.globalAlpha = 0.16 + Math.random() * 0.22
    ctx.beginPath(); ctx.ellipse(Math.random() * s, Math.random() * s, 14 + Math.random() * 42, 4 + Math.random() * 9, Math.random() * 0.6 - 0.3, 0, Math.PI * 2); ctx.fill()
  }
  for (let i = 0; i < 160; i++) {
    ctx.globalAlpha = 0.1 + Math.random() * 0.2
    ctx.beginPath(); ctx.arc(Math.random() * s, Math.random() * s, 2 + Math.random() * 7, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1
  return toTex(c)
}
/* 火星：鏽紅漸層 + 暗色玄武岩 + 隕石坑 + 小冰蓋 */
function marsTexture() {
  const { c, ctx } = newCanvas(); const s = 512
  const g = ctx.createLinearGradient(0, 0, 0, s)
  g.addColorStop(0, '#8a3a22'); g.addColorStop(0.45, '#b3552f'); g.addColorStop(0.75, '#c96a3a'); g.addColorStop(1, '#8a3a22')
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
  for (let k = 0; k < 10; k++) {
    const cx = Math.random() * s, cy = Math.random() * s
    ctx.fillStyle = '#5e2c1a'
    for (let i = 0; i < 30; i++) { ctx.globalAlpha = 0.4; const a = Math.random() * Math.PI * 2, d = Math.random() * 40; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.5, 5 + Math.random() * 16, 0, Math.PI * 2); ctx.fill() }
  }
  for (let i = 0; i < 200; i++) { ctx.globalAlpha = 0.2; ctx.fillStyle = Math.random() > 0.5 ? '#d98a5a' : '#7a3520'; ctx.beginPath(); ctx.ellipse(Math.random() * s, Math.random() * s, 8 + Math.random() * 26, 2 + Math.random() * 4, 0, 0, Math.PI * 2); ctx.fill() }
  for (let i = 0; i < 36; i++) {
    const x = Math.random() * s, y = Math.random() * s, r = 4 + Math.random() * 14
    ctx.globalAlpha = 0.4; ctx.fillStyle = '#6e3018'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.35; ctx.fillStyle = '#d9885a'; ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.55, 0, Math.PI * 2); ctx.fill()
  }
  iceCaps(ctx, s, 0.55)
  return toTex(c)
}
/* 海王星：深藍平滑 + 淡條紋 + 白色捲雲 */
function neptuneTexture() {
  const { c, ctx } = newCanvas(); const s = 512
  const g = ctx.createLinearGradient(0, 0, 0, s)
  g.addColorStop(0, '#1a3a8c'); g.addColorStop(0.35, '#2a5ecc'); g.addColorStop(0.6, '#3f7de0'); g.addColorStop(1, '#1a3a8c')
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
  for (let y = 0; y < s; y += 3 + Math.random() * 9) {
    ctx.globalAlpha = 0.1 + Math.random() * 0.1
    ctx.fillStyle = Math.random() > 0.5 ? '#5a95f0' : '#16308a'
    ctx.fillRect(0, y, s, 2 + Math.random() * 4)
  }
  for (let i = 0; i < 14; i++) {
    ctx.globalAlpha = 0.25 + Math.random() * 0.2
    ctx.fillStyle = '#dcecff'
    ctx.beginPath(); ctx.ellipse(Math.random() * s, Math.random() * s, 16 + Math.random() * 40, 2 + Math.random() * 4, 0, 0, Math.PI * 2); ctx.fill()
  }
  // 大暗斑
  ctx.globalAlpha = 0.4; ctx.fillStyle = '#122a70'
  ctx.beginPath(); ctx.ellipse(s * 0.4, s * 0.42, 34, 18, 0.1, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  return toTex(c)
}

/* 土星環：同心條紋 + 卡西尼縫 */
function ringTexture(base: number) {
  const s = 512, c = document.createElement('canvas'); c.width = c.height = s
  const ctx = c.getContext('2d')!
  const cx = s / 2
  for (let r = s * 0.30; r < s * 0.5; r += 1.5) {
    const u = (r - s * 0.30) / (s * 0.2)
    let a = 0.25 + 0.55 * Math.abs(Math.sin(u * 26) * Math.sin(u * 7))
    if (u > 0.62 && u < 0.7) a *= 0.12 // 卡西尼縫
    if (u > 0.94) a *= (1 - (u - 0.94) / 0.06)
    ctx.strokeStyle = hexShift(base, Math.floor((Math.random() - 0.35) * 60))
    ctx.globalAlpha = a; ctx.lineWidth = 1.6
    ctx.beginPath(); ctx.arc(cx, cx, r, 0, Math.PI * 2); ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4
  return tex
}

export type SunFx = { on: boolean; arrive: number; x: number; y: number; r: number }

export default function Scene3D({ progress, focus, mouse, hover, drag, sunFx }: {
  progress: React.MutableRefObject<number>
  focus: React.MutableRefObject<Focus>
  mouse: React.MutableRefObject<{ x: number; y: number }>
  hover: React.MutableRefObject<Hover>
  drag: React.MutableRefObject<Drag>
  sunFx: React.MutableRefObject<SunFx>
}) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let w = mount.clientWidth || window.innerWidth
    let h = mount.clientHeight || window.innerHeight
    const theme = THEME

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(theme.bg)
    scene.fog = new THREE.FogExp2(theme.bg, 0.009)
    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 400)
    camera.position.set(Math.sin(0.6) * 24, 15, Math.cos(0.6) * 24); camera.lookAt(0, 0, 0)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)

    // ── Bloom 後處理 ──
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.85, 0.55, 0.22)
    composer.addPass(bloom)

    scene.add(new THREE.AmbientLight(0x556090, 0.5))
    scene.add(new THREE.PointLight(0xffe8c0, 1.75, 0, 0)) // decay 0：外圈行星也照得到

    const disposables: { dispose(): void }[] = []
    const track = <T extends { dispose(): void }>(x: T) => { disposables.push(x); return x }
    track(bloom)

    // 圓形柔光粒子貼圖（所有 Points 共用 → 不再是方塊）
    const dotTex = track(radialTexture([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.75)'], [1, 'rgba(255,255,255,0)']]))

    function makeStars(count: number, spread: [number, number], size: number, color: number, opacity: number) {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) { const r = spread[0] + Math.random() * (spread[1] - spread[0]), th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1); pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i * 3 + 2] = r * Math.cos(ph) }
      const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = track(new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))
      const pts = new THREE.Points(geo, mat); scene.add(pts); return { pts, mat, base: opacity }
    }
    const s1 = makeStars(9000, [80, 190], 0.5, theme.star, 0.9)
    const s2 = makeStars(3000, [45, 120], 0.85, theme.star, 0.65)
    const s3 = makeStars(900, [40, 100], 1.3, 0xffffff, 0.8) // 亮星層（閃爍最明顯）
    { // 銀河帶：密集星群 + 暗塵裂縫 + 銀心核球 + 沿帶霧光
      const gGroup = new THREE.Group()
      gGroup.rotation.z = 0.55; gGroup.rotation.x = 0.15
      scene.add(gGroup)
      const CORE_A = 0.9 // 銀心方位角
      const n = 17000
      const pos = new Float32Array(n * 3), col = new Float32Array(n * 3)
      const cA = new THREE.Color(0xdde4ff), cB = new THREE.Color(0xffd9a8), cC = new THREE.Color(0xa8bcff), cD = new THREE.Color(0xffc9c0)
      for (let i = 0; i < n; i++) {
        const towardCore = Math.random() < 0.38
        const a = towardCore
          ? CORE_A + (Math.random() - 0.5) * (Math.random() - 0.5) * 3.6 // 向銀心聚集
          : Math.random() * Math.PI * 2
        const r = 60 + Math.random() * 130
        pos[i * 3] = Math.cos(a) * r
        pos[i * 3 + 1] = (Math.random() - 0.5) * (Math.random() - 0.5) * r * (towardCore ? 0.62 : 0.42)
        pos[i * 3 + 2] = Math.sin(a) * r
        const cc = towardCore
          ? (Math.random() < 0.6 ? cB : cD)
          : (Math.random() < 0.18 ? cB : (Math.random() < 0.55 ? cA : cC))
        col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b
      }
      const geo = track(new THREE.BufferGeometry())
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      gGroup.add(new THREE.Points(geo, track(new THREE.PointsMaterial({ size: 0.68, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending, vertexColors: true }))))
      // 沿帶霧光
      const hazeTex = track(radialTexture([[0, 'rgba(200,210,255,0.32)'], [0.5, 'rgba(165,175,240,0.14)'], [1, 'rgba(100,110,180,0)']]))
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2
        const r = 95 + Math.random() * 55
        const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: hazeTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.7 })))
        sp.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 5, Math.sin(a) * r)
        sp.scale.set(58, 20, 1)
        gGroup.add(sp)
      }
      // 銀心核球（暖色大光暈 ×3）
      const coreTex2 = track(radialTexture([[0, 'rgba(255,224,175,0.55)'], [0.35, 'rgba(255,200,140,0.22)'], [1, 'rgba(180,120,70,0)']]))
      ;[[86, 46, 0.9], [100, 30, 0.7], [78, 60, 0.5]].forEach(([sc, sy, op]) => {
        const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: coreTex2, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: op })))
        sp.position.set(Math.cos(CORE_A) * 115, 0, Math.sin(CORE_A) * 115)
        sp.scale.set(sc, sy, 1)
        gGroup.add(sp)
      })
      // 暗塵裂縫（沿帶中線的黑色雲帶，遮住後方星光）
      const dustTex = track(radialTexture([[0, 'rgba(4,5,10,0.92)'], [0.55, 'rgba(5,6,12,0.55)'], [1, 'rgba(6,7,14,0)']]))
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.2
        const r = (88 + Math.random() * 40) * 0.92
        const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false, opacity: 0.8 })))
        sp.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 3.5 - 1, Math.sin(a) * r)
        sp.scale.set(40 + Math.random() * 22, 6 + Math.random() * 5, 1)
        gGroup.add(sp)
      }
    }
    { const n = 5200, pos = new Float32Array(n * 3), col = new Float32Array(n * 3)
      const coreCol = new THREE.Color(0xffe0b0), armA = new THREE.Color(0x9db4ff), armB = new THREE.Color(0xe8f0ff)
      for (let i = 0; i < n; i++) {
        const rr = Math.pow(Math.random(), 0.6) * 26, arm = Math.floor(Math.random() * 2) * Math.PI, a = arm + rr * 0.22 + (Math.random() - 0.5) * 0.5
        pos[i * 3] = Math.cos(a) * rr; pos[i * 3 + 1] = (Math.random() - 0.5) * (2 + rr * 0.05); pos[i * 3 + 2] = Math.sin(a) * rr
        const cc = rr < 7 ? coreCol : (Math.random() < 0.6 ? armA : armB)
        col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b
      }
      const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const gal = new THREE.Points(geo, track(new THREE.PointsMaterial({ size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.8, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending, vertexColors: true }))); gal.position.set(-90, 38, -100); gal.rotation.set(0.6, 0.4, 0.5); scene.add(gal)
      const coreTex = track(radialTexture([[0, `rgba(${theme.glowRgb},0.8)`], [0.4, `rgba(${theme.glowRgb},0.25)`], [1, `rgba(${theme.glowRgb},0)`]])); const core = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: coreTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }))); core.position.copy(gal.position); core.scale.setScalar(22); scene.add(core) }
    { const nebTex = track(radialTexture([[0, 'rgba(255,255,255,0.8)'], [0.4, 'rgba(180,180,255,0.35)'], [1, 'rgba(90,90,170,0)']])); const nebPos: [number, number, number][] = [[-55, 20, -70], [60, -25, -80], [10, 40, -95], [-45, -35, -60], [40, 32, -55], [-20, -10, -110]]; const nebSize = [95, 120, 85, 75, 90, 130]
      theme.nebula.forEach((col, i) => { const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: nebTex, color: col, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.26, depthWrite: false }))); sp.position.set(...nebPos[i % nebPos.length]); sp.scale.setScalar(nebSize[i % nebSize.length]); scene.add(sp) }) }

    // ── 太陽 + 日冕 ──
    const sunTex = track((() => { const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const ctx = c.getContext('2d')!; ctx.fillStyle = hexShift(theme.sun, 0); ctx.fillRect(0, 0, s, s); for (let i = 0; i < 500; i++) { ctx.fillStyle = hexShift(theme.sun, Math.random() > 0.5 ? 40 : -50); ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 6, 0, Math.PI * 2); ctx.fill() } return new THREE.CanvasTexture(c) })())
    const sun = new THREE.Mesh(track(new THREE.SphereGeometry(2.4, 48, 48)), track(new THREE.MeshBasicMaterial({ map: sunTex, color: 0xcfa860 })))
    scene.add(sun)
    const glowTex = track(radialTexture([[0, `rgba(${theme.glowRgb},0.5)`], [0.3, `rgba(${theme.glowRgb},0.2)`], [0.65, `rgba(${theme.glowRgb},0.06)`], [1, `rgba(${theme.glowRgb},0)`]]))
    const glow = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }))); glow.scale.setScalar(8); scene.add(glow)
    // 日冕粒子
    const CO = 420, coPos = new Float32Array(CO * 3), coSeed = new Float32Array(CO)
    for (let i = 0; i < CO; i++) { const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 2.7 + Math.random() * 1.2; coPos[i * 3] = r * Math.sin(ph) * Math.cos(th); coPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); coPos[i * 3 + 2] = r * Math.cos(ph); coSeed[i] = Math.random() * Math.PI * 2 }
    const coGeo = track(new THREE.BufferGeometry()); const coAttr = new THREE.BufferAttribute(coPos, 3); coGeo.setAttribute('position', coAttr)
    const corona = new THREE.Points(coGeo, track(new THREE.PointsMaterial({ color: 0xffb060, size: 0.28, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending })))
    scene.add(corona)

    // ── 行星（各有真實身分）──
    type Kind = 'mars' | 'terra' | 'saturn' | 'neptune' | 'jupiter'
    const planetDefs: { r: number; size: number; speed: number; kind: Kind; ring?: boolean; tilt?: number }[] = [
      { r: 4.4, size: 0.45, speed: 0.62, kind: 'mars' },
      { r: 6.8, size: 0.62, speed: 0.44, kind: 'terra' },
      { r: 9.4, size: 1.0, speed: 0.3, kind: 'saturn', ring: true, tilt: 0.5 },
      { r: 12.4, size: 0.58, speed: 0.22, kind: 'neptune' },
      { r: 15.6, size: 0.82, speed: 0.15, kind: 'jupiter', tilt: 0.3 },
    ]
    const surface: Record<Kind, () => THREE.CanvasTexture> = {
      mars: marsTexture,
      terra: terraTexture,
      saturn: () => gasTexture('#a8845c', '#d6b98c', '#e8d9b0', false),
      neptune: neptuneTexture,
      jupiter: () => gasTexture('#7a4a2a', '#c98a4a', '#e8c9a0', true),
    }
    const atmoDef: Record<Kind, { color: number; op: number }> = {
      mars: { color: 0xff9a6a, op: 0.07 },
      terra: { color: 0x7ab8ff, op: 0.2 },
      saturn: { color: 0xe8d9b0, op: 0.1 },
      neptune: { color: 0x5c8cff, op: 0.16 },
      jupiter: { color: 0xe8b980, op: 0.1 },
    }
    const roughDef: Record<Kind, number> = { mars: 0.85, terra: 0.55, saturn: 0.75, neptune: 0.5, jupiter: 0.75 }
    const pivots: { pivot: THREE.Object3D; mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; speed: number; size: number; clouds?: THREE.Mesh }[] = []
    planetDefs.forEach((d, di) => {
      const color = theme.planets[di]
      const pivot = new THREE.Object3D(); pivot.rotation.x = (Math.random() - 0.5) * 0.2; scene.add(pivot)
      const tex = track(surface[d.kind]())
      const bumpy = d.kind === 'mars' || d.kind === 'terra'
      const mat = track(new THREE.MeshStandardMaterial({ map: tex, bumpMap: bumpy ? tex : undefined, bumpScale: bumpy ? 0.05 : 0, roughness: roughDef[d.kind], metalness: 0.05, emissive: color, emissiveIntensity: 0.03 }))
      const mesh = new THREE.Mesh(track(new THREE.SphereGeometry(d.size, 48, 48)), mat)
      mesh.position.x = d.r; mesh.rotation.z = d.tilt ?? 0; pivot.add(mesh)
      const at = atmoDef[d.kind]
      mesh.add(new THREE.Mesh(track(new THREE.SphereGeometry(d.size * 1.16, 32, 32)), track(new THREE.MeshBasicMaterial({ color: at.color, transparent: true, opacity: at.op, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }))))
      let clouds: THREE.Mesh | undefined
      if (d.kind === 'terra') {
        clouds = new THREE.Mesh(track(new THREE.SphereGeometry(d.size * 1.035, 48, 48)), track(new THREE.MeshStandardMaterial({ map: track(cloudTexture()), transparent: true, depthWrite: false, roughness: 0.9, opacity: 0.9 })))
        mesh.add(clouds)
      }
      if (d.ring) {
        const rt = track(ringTexture(theme.planets[di]))
        const ring = new THREE.Mesh(track(new THREE.RingGeometry(d.size * 1.45, d.size * 2.6, 96)), track(new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false })))
        ring.rotation.x = Math.PI / 2 - 0.35; mesh.add(ring)
      }
      const seg = 128, op = new Float32Array((seg + 1) * 3); for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI * 2; op[i * 3] = Math.cos(a) * d.r; op[i * 3 + 2] = Math.sin(a) * d.r }
      const og = track(new THREE.BufferGeometry()); og.setAttribute('position', new THREE.BufferAttribute(op, 3)); const orbit = new THREE.LineLoop(og, track(new THREE.LineBasicMaterial({ color: theme.band, transparent: true, opacity: 0.25 }))); orbit.rotation.copy(pivot.rotation); scene.add(orbit)
      pivot.rotation.y = Math.random() * Math.PI * 2
      pivots.push({ pivot, mesh, mat, speed: d.speed, size: d.size, clouds })
    })
    const bn = 1100, bp = new Float32Array(bn * 3); for (let i = 0; i < bn; i++) { const rr = 10.6 + Math.random(), a = Math.random() * Math.PI * 2; bp[i * 3] = Math.cos(a) * rr; bp[i * 3 + 1] = (Math.random() - 0.5) * 0.5; bp[i * 3 + 2] = Math.sin(a) * rr }
    const bg2 = track(new THREE.BufferGeometry()); bg2.setAttribute('position', new THREE.BufferAttribute(bp, 3)); const belt = new THREE.Points(bg2, track(new THREE.PointsMaterial({ color: theme.band, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.55, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))); scene.add(belt)

    // ── 相機 / 互動 ──
    const clock = new THREE.Clock()
    const lookAt = new THREE.Vector3(0, 0, 0)
    const UP = new THREE.Vector3(0, 1, 0)
    const d0 = new THREE.Vector3(), d1 = new THREE.Vector3(), l0 = new THREE.Vector3(), l1 = new THREE.Vector3(), wp = new THREE.Vector3(), radial = new THREE.Vector3(), tangent = new THREE.Vector3(), desired = new THREE.Vector3(), look = new THREE.Vector3(), fwp = new THREE.Vector3(), dirV = new THREE.Vector3(), axisV = new THREE.Vector3(), stepV = new THREE.Vector3()
    // 弧線飛行狀態
    const flightStart = new THREE.Vector3(), flightLook0 = new THREE.Vector3(), ctrl = new THREE.Vector3(), lat = new THREE.Vector3(), lookGoal = new THREE.Vector3()
    let inFlight = false, flightU = 0, flightDur = 2.5
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    // sun → 彩蛋（seg 99）；最內圈行星 → 段 0（Home）；行星 1~4 → 段 1~4
    const hoverTargets: { mesh: THREE.Mesh; seg: number; name: string }[] = [
      { mesh: sun, seg: 99, name: '☀ 太陽的真面目？' },
      { mesh: pivots[0].mesh, seg: 0, name: '☀ Home' },
      { mesh: pivots[1].mesh, seg: 1, name: '01 · About' },
      { mesh: pivots[2].mesh, seg: 2, name: '02 · Work' },
      { mesh: pivots[3].mesh, seg: 3, name: '03 · Stack' },
      { mesh: pivots[4].mesh, seg: 4, name: '04 · Contact' },
    ]
    const segTarget = (i: number, p: number, out: THREE.Vector3, outL: THREE.Vector3) => {
      if (i === 0) { const a = p * Math.PI * 2 + 0.6; out.set(Math.sin(a) * 24, 15, Math.cos(a) * 24); outL.set(0, 0, 0) }
      else {
        const pl = pivots[i]; pl.mesh.getWorldPosition(wp)
        radial.copy(wp).setY(0).normalize()
        tangent.crossVectors(UP, radial).normalize()
        const dist = pl.size * 3.6 + 3.4
        // 停在「向陽側」斜前方：看到被照亮的半球
        out.copy(wp).addScaledVector(radial, -dist * 0.78).addScaledVector(tangent, dist * 0.62)
        out.y += pl.size * 1.3 + 0.9
        outL.copy(wp)
      }
    }

    let raf = 0
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, p = progress.current
      const seg = 5, fp = p * (seg - 1), i0 = Math.floor(fp), i1 = Math.min(i0 + 1, seg - 1), f = fp - i0, near = Math.round(fp)
      const sf = f * f * (3 - 2 * f)

      sun.rotation.y += dt * 0.05
      glow.scale.setScalar(8 + Math.sin(t * 1.5) * 0.35)
      corona.rotation.y += dt * 0.06; corona.rotation.x = Math.sin(t * 0.3) * 0.08
      // 星星閃爍
      s1.mat.opacity = s1.base * (0.8 + 0.2 * Math.sin(t * 1.1))
      s2.mat.opacity = s2.base * (0.75 + 0.25 * Math.sin(t * 1.7 + 2))
      s3.mat.opacity = s3.base * (0.6 + 0.4 * Math.sin(t * 2.6 + 4))
      pivots.forEach((pl, i) => { const fc = near > 0 && i === near; pl.pivot.rotation.y += dt * pl.speed * (fc ? 0.04 : 1); pl.mesh.rotation.y += dt * (fc ? 0.05 : 0.4); if (pl.clouds) pl.clouds.rotation.y += dt * (fc ? 0.03 : 0.12) })
      belt.rotation.y += dt * 0.04

      segTarget(i0, p, d0, l0); segTarget(i1, p, d1, l1)
      desired.lerpVectors(d0, d1, sf); look.lerpVectors(l0, l1, sf)
      // 拖曳 orbit：抓著場景繞目標旋轉（放開後維持、不彈回；pitch 動態夾限避免翻越極點）
      dirV.copy(desired).sub(look)
      if (Math.abs(drag.current.yaw) > 0.0005 || Math.abs(drag.current.pitch) > 0.0005) {
        dirV.applyAxisAngle(UP, drag.current.yaw)
        const elev0 = Math.asin(Math.max(-1, Math.min(1, dirV.y / dirV.length())))
        const pitchEff = Math.max(elev0 - 1.45, Math.min(elev0 + 1.45, drag.current.pitch))
        axisV.crossVectors(UP, dirV).normalize()
        dirV.applyAxisAngle(axisV, pitchEff)
      }
      desired.copy(look).add(dirV)
      // ☀ 太陽模式：接管相機目標，沿目前方位漸進貼近太陽
      if (sunFx.current.on) {
        dirV.copy(camera.position); dirV.y *= 0.45
        if (dirV.lengthSq() < 1) dirV.set(0, 0.3, 1)
        dirV.normalize()
        desired.copy(dirV).multiplyScalar(7.4); desired.y += 1.1
        look.set(0, 0, 0)
      }
      // 長距離 → 弧線飛行（貝茲曲線側弧進場）；短距離 → 阻尼跟隨
      const distToTarget = camera.position.distanceTo(desired)
      if (!inFlight && distToTarget > 8 && !drag.current.active) {
        inFlight = true; flightU = 0
        flightStart.copy(camera.position)
        flightLook0.copy(lookAt)
        flightDur = 2.0 + distToTarget * 0.045
      }
      if (inFlight && drag.current.active) inFlight = false
      if (inFlight) {
        flightU = Math.min(1, flightU + dt / flightDur)
        const u = flightU
        const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2 // 緩入緩出
        stepV.copy(desired).sub(flightStart)
        const len = stepV.length()
        lat.crossVectors(UP, stepV)
        if (lat.lengthSq() < 1e-6) lat.set(1, 0, 0); else lat.normalize()
        // 控制點：中點 + 側向外弧 + 上抬 → 弧線進場
        ctrl.copy(flightStart).add(desired).multiplyScalar(0.5)
          .addScaledVector(lat, len * 0.32)
          .addScaledVector(UP, len * 0.15)
        camera.position.set(0, 0, 0)
          .addScaledVector(flightStart, (1 - e) * (1 - e))
          .addScaledVector(ctrl, 2 * (1 - e) * e)
          .addScaledVector(desired, e * e)
        lookGoal.lerpVectors(flightLook0, look, e)
        if (flightU >= 1) inFlight = false
      } else {
        camera.position.lerp(desired, 0.07)
        lookGoal.copy(lookAt).lerp(look, 0.07)
      }
      // 視線角速度限制：不管目標怎麼跳，鏡頭每秒最多轉 ~85°，避免甩鏡
      {
        dirV.copy(lookAt).sub(camera.position)
        const dCur = Math.max(dirV.length(), 0.001); dirV.normalize()
        stepV.copy(lookGoal).sub(camera.position)
        const dDes = Math.max(stepV.length(), 0.001); stepV.normalize()
        const ang = dirV.angleTo(stepV)
        const maxAng = 1.5 * dt
        if (ang > maxAng && ang > 1e-5) {
          axisV.crossVectors(dirV, stepV)
          if (axisV.lengthSq() < 1e-8) dirV.copy(stepV)
          else { axisV.normalize(); dirV.applyAxisAngle(axisV, maxAng) }
        } else dirV.copy(stepV)
        const dist = dCur + (dDes - dCur) * Math.min(1, 3 * dt)
        lookAt.copy(camera.position).addScaledVector(dirV, dist)
      }
      camera.lookAt(lookAt)
      camera.updateMatrixWorld()

      // ☀ 太陽模式：回報太陽的螢幕座標 / 半徑 / 抵達程度
      if (sunFx.current.on) {
        const el = renderer.domElement
        fwp.set(0, 0, 0).project(camera)
        sunFx.current.x = (fwp.x * 0.5 + 0.5) * el.clientWidth
        sunFx.current.y = (-fwp.y * 0.5 + 0.5) * el.clientHeight
        const cy = sunFx.current.y
        fwp.set(0, 2.4, 0).project(camera)
        sunFx.current.r = Math.abs(cy - (-fwp.y * 0.5 + 0.5) * el.clientHeight)
        sunFx.current.arrive = Math.max(0, 1 - camera.position.distanceTo(desired) / 6)
      } else sunFx.current.arrive = 0

      // hover 偵測（滑鼠指到太陽 / 行星）
      ndc.set(mouse.current.x, -mouse.current.y)
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(hoverTargets.map(ht => ht.mesh), false)
      const hovered = hits.length > 0 ? hoverTargets.find(ht => ht.mesh === hits[0].object) ?? null : null
      hoverTargets.forEach(ht => {
        const s = ht === hovered && ht.mesh !== sun ? 1.22 : 1
        ht.mesh.scale.x += (s - ht.mesh.scale.x) * 0.15
        ht.mesh.scale.y = ht.mesh.scale.z = ht.mesh.scale.x
      })
      if (hovered) {
        hovered.mesh.getWorldPosition(fwp); fwp.project(camera)
        const el = renderer.domElement
        hover.current.idx = hovered.seg
        hover.current.name = hovered.name
        hover.current.x = (fwp.x * 0.5 + 0.5) * el.clientWidth
        hover.current.y = (-fwp.y * 0.5 + 0.5) * el.clientHeight
      } else { hover.current.idx = -1; hover.current.name = '' }

      // 聚焦行星 → 螢幕座標（卡片錨定；相機還在飛時先不浮現）
      const settle = 1 - Math.min(1, Math.abs(fp - near) / 0.4)
      const arrive = Math.max(0, 1 - camera.position.distanceTo(desired) / 6)
      if (near > 0) {
        pivots[near].mesh.getWorldPosition(fwp); fwp.project(camera)
        const el = renderer.domElement
        focus.current.x = (fwp.x * 0.5 + 0.5) * el.clientWidth
        focus.current.y = (-fwp.y * 0.5 + 0.5) * el.clientHeight
        focus.current.idx = near
        focus.current.settle = fwp.z < 1 && !sunFx.current.on ? settle * arrive : 0
      } else { focus.current.idx = 0; focus.current.settle = 0 }

      composer.render()
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => { w = mount.clientWidth || window.innerWidth; h = mount.clientHeight || window.innerHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); composer.setSize(w, h) }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      disposables.forEach(d => d.dispose())
      composer.renderTarget1.dispose(); composer.renderTarget2.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [progress, focus, mouse, hover, drag, sunFx])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
