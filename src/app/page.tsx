import Link from 'next/link'
import { siteData } from '@/data/portfolio'

export default function Home() {
  type P = typeof siteData.projects[number]
  const featured = (siteData.projects as unknown as P[]).slice(0, 3)

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* HERO - split layout */}
      <section style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', position:'relative' }}>
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem) clamp(4rem,6vw,6rem)', borderRight:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:'6rem', left:'1.5rem', fontFamily:'var(--font-display)', fontSize:'clamp(7rem,16vw,14rem)', fontWeight:300, color:'var(--border)', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em', pointerEvents:'none' }}>黃</span>
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1.5rem' }}>Information Management</p>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3.5rem,7vw,6rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>{siteData.name}</h1>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.1rem,2vw,1.6rem)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:'2rem' }}>{siteData.nameEn}</p>
            <p style={{ fontSize:'0.95rem', color:'var(--text-2)', lineHeight:1.85, maxWidth:'380px', marginBottom:'3rem' }}>{siteData.bio[0]}</p>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.7em 1.8em', background:'var(--accent)', color:'#fff', borderRadius:'2px', display:'inline-block' }}>View Projects</Link>
              <Link href="/contact" style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.7em 1.8em', background:'transparent', color:'var(--text)', border:'1px solid var(--border-2)', borderRadius:'2px', display:'inline-block' }}>Contact</Link>
            </div>
          </div>
        </div>
        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'clamp(6rem,10vw,10rem) clamp(2rem,5vw,5rem) clamp(4rem,6vw,6rem)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--border)', marginTop:'2rem' }}>
            {([['5','Projects'],['8','Awards'],['2025','Graduating'],['NCU','Grad School']] as [string,string][]).map(([num,label]) => (
              <div key={label} style={{ background:'var(--bg)', padding:'2rem 1.5rem' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, lineHeight:1, marginBottom:'0.4rem' }}>{num}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'1rem' }}>Core Skills</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'3rem' }}>
              {['BERT','NLP','React','Next.js','Python','OCR','AWS'].map(s => <span key={s} className="chip">{s}</span>)}
            </div>
            <div style={{ paddingTop:'2rem', borderTop:'1px solid var(--border)' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Contact</p>
              <a href={'mailto:'+siteData.email} style={{ fontFamily:'var(--font-mono)', fontSize:'0.82rem', color:'var(--accent)' }}>{siteData.email}</a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section style={{ padding:'clamp(4rem,8vw,8rem) clamp(2rem,5vw,5rem)', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'3rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Selected Work</p>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:300 }}>Projects & Research</h2>
          </div>
          <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--accent)', borderBottom:'1px solid var(--accent)', paddingBottom:'2px' }}>View All</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1px', background:'var(--border)' }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{ background:'var(--bg)', padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:300, color:'var(--border-2)', lineHeight:1 }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', padding:'0.2em 0.7em', borderRadius:'99px', background:p.type==='research'?'rgba(61,122,110,0.08)':'rgba(193,127,58,0.08)', color:p.type==='research'?'var(--accent)':'var(--accent-2)', border:'1px solid '+(p.type==='research'?'rgba(61,122,110,0.2)':'rgba(193,127,58,0.2)') }}>{p.type==='research'?'研究':'專案'}</span>
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:400, marginBottom:'0.3rem' }}>{p.title}</h3>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)' }}>{p.period}</p>
              </div>
              <p style={{ fontSize:'0.88rem', color:'var(--text-2)', lineHeight:1.75, flex:1 }}>{p.description.slice(0,100)}...</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', paddingTop:'0.5rem', borderTop:'1px solid var(--border)' }}>
                {p.tags.slice(0,3).map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
