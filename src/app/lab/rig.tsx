'use client'
/* 實驗版共用工具：three 掛載器 / 貼圖 / 星海 / 隱形導覽 */
import Link from 'next/link'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export type Track = <T extends { dispose(): void }>(x: T) => T

export function radialTexture(stops: [number, string][]) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

export function starSphere(scene: THREE.Scene, track: Track, dotTex: THREE.Texture, count: number, spread: [number, number], size: number, color: number, opacity: number) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = spread[0] + Math.random() * (spread[1] - spread[0])
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i * 3 + 2] = r * Math.cos(ph)
  }
  const geo = track(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = track(new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity, depthWrite: false, map: dotTex, blending: THREE.AdditiveBlending }))
  scene.add(new THREE.Points(geo, mat))
  return mat
}

/* three 場景掛載器：renderer + bloom + 資源追蹤 + resize，回傳 dispose */
export function mountThree(mount: HTMLDivElement, opt: { bg: string; fov?: number; fogDensity?: number; bloom?: [number, number, number] }) {
  let w = mount.clientWidth || window.innerWidth
  let h = mount.clientHeight || window.innerHeight
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(opt.bg)
  if (opt.fogDensity) scene.fog = new THREE.FogExp2(opt.bg, opt.fogDensity)
  const camera = new THREE.PerspectiveCamera(opt.fov ?? 58, w / h, 0.1, 600)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  mount.appendChild(renderer.domElement)
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const [bs, br, bt] = opt.bloom ?? [0.85, 0.55, 0.22]
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), bs, br, bt)
  composer.addPass(bloom)
  const disposables: { dispose(): void }[] = [bloom]
  const track: Track = (x) => { disposables.push(x); return x }
  const dotTex = track(radialTexture([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.75)'], [1, 'rgba(255,255,255,0)']]))
  const onResize = () => {
    w = mount.clientWidth || window.innerWidth; h = mount.clientHeight || window.innerHeight
    camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); composer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)
  const dispose = () => {
    window.removeEventListener('resize', onResize)
    disposables.forEach(d => d.dispose())
    composer.renderTarget1.dispose(); composer.renderTarget2.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
  }
  return { scene, camera, renderer, composer, track, dotTex, dispose }
}

/* ── 隱形導覽：無底框、細字距、融入畫面 ── */
export const NAV = [
  { href: '/lab', label: 'HOME' },
  { href: '/lab/projects', label: 'PROJECTS' },
  { href: '/lab/builds', label: 'BUILDS' },
  { href: '/lab/skills', label: 'SKILLS' },
  { href: '/lab/awards', label: 'AWARDS' },
]
export function NavDock({ current, accent }: { current: string; accent: string }) {
  return (
    <nav className="ldock" style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 7, display: 'flex', gap: 'clamp(1rem,3vw,2.4rem)', alignItems: 'center' }}>
      {NAV.map(n => {
        const on = n.href === current
        return (
          <Link key={n.href} href={n.href} style={{
            position: 'relative',
            fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.32em',
            color: on ? accent : 'rgba(225,230,255,0.42)', textDecoration: 'none',
            textShadow: on ? `0 0 14px ${accent}` : 'none',
            transition: 'color 0.25s',
            paddingBottom: '0.45rem',
          }}>
            {n.label}
            <span style={{
              position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
              width: on ? '5px' : '0px', height: on ? '5px' : '0px', borderRadius: '50%',
              background: accent, boxShadow: `0 0 10px ${accent}`, transition: 'all 0.25s',
            }} />
          </Link>
        )
      })}
      <style>{`.ldock a:hover { color: #fff !important; }`}</style>
    </nav>
  )
}
