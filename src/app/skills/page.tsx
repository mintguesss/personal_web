import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'Skills' }

export default function SkillsPage() {
  return (
    <div style={{ paddingTop:'64px', minHeight:'100vh' }}>
      <div style={{ borderBottom:'1px solid var(--border)', padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem) 3rem', maxWidth:'1100px', margin:'0 auto' }}>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1rem' }}>Expertise</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3rem,6vw,5rem)', fontWeight:300, lineHeight:1.05 }}>Skills &amp;<br /><em style={{ fontStyle:'italic', color:'var(--muted)' }}>Technologies</em></h1>
      </div>
      <div style={{ maxWidth:'1100px', margin:'0 auto',transform:'translateX(40px)', padding:'clamp(3rem,6vw,6rem) clamp(5rem,8vw,rem)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1px', background:'var(--border)', marginBottom:'6rem' }}>
          {Object.entries(siteData.skills).map(([group, items], i) => (
            <div key={group} style={{ background:'var(--bg)', padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'3.5rem', fontWeight:300, color:'var(--border-2)', lineHeight:1 }}>{String(i+1).padStart(2,'00')}</span>
              <div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.9rem', letterSpacing:'0.15em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1.25rem' }}>{group}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                  {(items as readonly string[]).map(skill => (
                    <div key={skill} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--accent)', flexShrink:0, display:'block' }} />
                      <span style={{ fontSize:'0.95rem' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'1.5rem' }}>All Technologies</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem' }}>
            {Object.values(siteData.skills).flat().map((s,i) => <span key={i} className="chip" style={{ fontSize:'0.78rem', padding:'0.35em 1em' }}>{s as string}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
