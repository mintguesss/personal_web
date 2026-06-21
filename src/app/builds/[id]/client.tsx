'use client'
import { useState, useEffect } from 'react'
import { siteData } from '@/data/portfolio'
import BuildDetail from './BuildDetail'

type Build = typeof siteData.builds[number]

export default function BuildDetailClient({ id }: { id: string }) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const build = (siteData.builds as readonly Build[]).find(b => b.id === id)
  if (!build) return (
    <div style={{ paddingTop: '8rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
      找不到此作品
    </div>
  )

  return <BuildDetail build={build} mobile={mobile} />
}
