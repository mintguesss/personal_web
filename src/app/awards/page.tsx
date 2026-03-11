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
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div className="page-header" style={{ borderBottom: '1px solid var(--border)', padding: 'clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem) 3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Recognition</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,6vw,5rem)', fontWeight: 300, lineHeight: 1.05 }}>
          Awards &amp;<br /><em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Honors</em>
        </h1>
      </div>
      <div className="page-body" style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem)' }}>
        {years.map(year => (
          <div key={year} className="award-year-grid">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', paddingTop: '1.2rem' }}>{year}</div>
            <div>
              {byYear[year].map((a, i) => (
                <div key={i} className="award-row" style={{ padding: '1.1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400 }}>{a.title}</h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{a.org}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
