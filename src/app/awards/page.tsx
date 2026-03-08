import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'Awards' }

export default function AwardsPage() {
  type Award = { year: string; title: string; org: string }
  const allAwards = siteData.awards as unknown as Award[]
  const byYear = allAwards.reduce((acc, a) => {
    if (!acc[a.year]) acc[a.year] = []
    acc[a.year].push(a)
    return acc
  }, {} as Record<string, Award[]>)
  const years = Object.keys(byYear).sort((a,b) => Number(b)-Number(a))
  return (
    <div style={{ paddingTop:'64px', minHeight:'100vh' }}>
      <div style={{ borderBottom:'1px solid var(--border)', padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem) 3rem', maxWidth:'1100px', margin:'0 auto' }}>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1rem' }}>Recognition</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3rem,6vw,5rem)', fontWeight:300, lineHeight:1.05 }}>Awards &amp;<br /><em style={{ fontStyle:'italic', color:'var(--muted)' }}>Honors</em></h1>
      </div>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'var(--border)', marginBottom:'5rem' }}>
          {([[allAwards.length.toString(),'Total Awards'],[years.length.toString(),'Years Active'],['2024–25','Peak Period']] as [string,string][]).map(([num,label]) => (
            <div key={label} style={{ background:'var(--bg)', padding:'3rem 2rem' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3rem,5vw,5rem)', fontWeight:300, lineHeight:1, marginBottom:'0.5rem' }}>{num}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'4rem' }}>
          {years.map(year => (
            <div key={year} style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:'3rem' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:300, color:'var(--border-2)', lineHeight:1, paddingTop:'0.5rem' }}>{year}</div>
              <div>
                {byYear[year].map((a, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'center', padding:'1.5rem 0', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:400 }}>{a.title}</h3>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)', whiteSpace:'nowrap' }}>{a.org}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
