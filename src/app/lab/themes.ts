export type LabTheme = {
  name: string
  bg: string
  accent: string
  accentRgb: string
  sectionColors: string[]
  sun: number
  glowRgb: string
  planets: number[]
  nebula: number[]
  star: number
  band: number
}

export const THEME: LabTheme = {
  name: 'Solar System',
  bg: '#04050a', accent: '#748ffc', accentRgb: '116,143,252',
  sectionColors: ['#4dabf7', '#b197fc', '#63e6be', '#ffa94d'],
  sun: 0xffcf7a, glowRgb: '255,200,120',
  planets: [0xd06b4a, 0x4a7fd0, 0xc9a06a, 0x53b6a0, 0xc88a4a],
  nebula: [0x6d5bd0, 0x2f6bb0, 0x2ba090, 0xb0407a, 0x4050c0, 0x7a3fb0],
  star: 0xcdd6ff, band: 0xb0bcff,
}

export type Focus = { x: number; y: number; idx: number; settle: number }
export type Hover = { idx: number; x: number; y: number; name: string }
export type Drag = { yaw: number; pitch: number; active: boolean }
