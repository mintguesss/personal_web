import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'About' }
export default function AboutPage() {
  return (
    <div style={{ paddingTop:'64px', minHeight:'100vh' }}>
      <div style={{ borderBottom:'1px solid var(--border)', padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem) 3rem', maxWidth:'1100px', margin:'0 auto' }}>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1rem' }}>About</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3rem,6vw,5rem)', fontWeight:300, lineHeight:1.05 }}>關於<br /><em style={{ fontStyle:'italic', color:'var(--muted)' }}>我</em></h1>
      </div>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,5rem)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'5rem', marginBottom:'6rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {siteData.bio.map((p, i) => <p key={i} style={{ fontSize:'1rem', color:'var(--text-2)', lineHeight:1.9 }}>{p}</p>)}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
            {[['學校',siteData.institution],['科系',siteData.title],['Email',siteData.email],['電話',siteData.phone],['位置',siteData.location]].map(([label,value]) => (
              <div key={label} style={{ borderTop:'1px solid var(--border)', paddingTop:'1rem' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'0.4rem' }}>{label}</p>
                {label==='Email' ? <a href={'mailto:'+value} style={{ fontSize:'0.9rem', color:'var(--accent)' }}>{value}</a> : <p style={{ fontSize:'0.9rem' }}>{value}</p>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:'6rem' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'2.5rem' }}>Education</p>
          {siteData.education.map((e, i) => (
            <div key={e.school} style={{ display:'grid', gridTemplateColumns:'160px 1fr auto', gap:'2rem', padding:'2rem 0', borderTop:i===0?'1px solid var(--border)':'none', borderBottom:'1px solid var(--border)', alignItems:'start' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', color:'var(--muted)' }}>{e.period}</span>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:400, marginBottom:'0.2rem' }}>{e.school}</h3>
                {e.dept && <p style={{ fontSize:'0.88rem', color:'var(--text-2)' }}>{e.dept} — {e.degree}</p>}
              </div>
              {e.badge && <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', padding:'0.3em 0.9em', borderRadius:'2px', background:'var(--accent-lt)', color:'var(--accent)', border:'1px solid rgba(61,122,110,0.2)', whiteSpace:'nowrap' }}>{e.badge}</span>}
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'2.5rem' }}>Experience</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1px', background:'var(--border)' }}>
            {siteData.experience.map(e => (
              <div key={e.company} style={{ background:'var(--bg)', padding:'2rem 1.75rem' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>{e.period}</p>
                <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', fontWeight:400, marginBottom:'0.2rem' }}>{e.role}</h4>
                <p style={{ fontSize:'0.85rem', color:'var(--accent)', marginBottom:'0.75rem' }}>{e.company}</p>
                <p style={{ fontSize:'0.85rem', color:'var(--text-2)' }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
