'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

export default function Home() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])

  type P = typeof siteData.projects[number]
  const featured = (siteData.projects as unknown as P[]).slice(0, 3)

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(16px)',
    transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
  })

  return (
    <div style={{ minHeight:'100vh' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>

        {/* Left — photo，有內邊距不貼邊 */}
        <div style={{ padding:'5rem 0 5rem 2.5rem', display:'flex', alignItems:'stretch', borderRight:'1px solid var(--border)' }}>
          <div style={{ position:'relative', width:'100%', borderRadius:'4px', overflow:'hidden', minHeight:'500px' }}>
            <img
              src={process.env.NODE_ENV === 'production' ? '/personal_web/photo.jpg' : '/photo.jpg'}
              alt={siteData.name}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
            />
            {/* 佔位背景 */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,var(--bg-2) 0%,var(--border) 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'clamp(5rem,12vw,9rem)', fontWeight:300, color:'var(--border-2)', lineHeight:1, userSelect:'none' }}>K</span>
            </div>
            {/* 底部 overlay */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.25rem 1.5rem', background:'linear-gradient(to top,rgba(0,0,0,0.28) 0%,transparent 100%)' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.18em', color:'rgba(255,255,255,0.75)', textTransform:'uppercase' }}>
                {siteData.institution} · {siteData.title}
              </p>
            </div>
          </div>
        </div>

        {/* Right — content */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'5rem 2.5rem 5rem 7rem', gap:'0' }}>

          <div style={{ ...fade(100), marginBottom:'0.75rem' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase' }}>Information Management</p>
          </div>

          <div style={{ ...fade(200), marginBottom:'1.5rem' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:'0.25rem' }}>{siteData.name}</h1>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.9rem,1.5vw,1.2rem)', fontWeight:300, fontStyle:'italic', color:'var(--muted)' }}>{siteData.nameEn}</p>
          </div>

          <div style={{ ...fade(300), marginBottom:'1.75rem' }}>
            <p style={{ fontSize:'0.88rem', color:'var(--text-2)', lineHeight:1.9, maxWidth:'400px' }}>{siteData.bio[0]}</p>
          </div>

          {/* Taglines */}
          <div style={{ ...fade(380), display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'2rem' }}>
            {([`NLP siteData.taglines.map Fraud Detection Researcher`, `Full-Stack Developer`, `Graduate Student @ NCU (2025)`] as string[]).map((t, i) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <span style={{ width:'16px', height:'1px', background:'var(--accent)', display:'block', flexShrink:0, opacity: 0.5 + i*0.2 }} />
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--text-2)', letterSpacing:'0.04em' }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ ...fade(450), display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'2.5rem' }}>
            <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.65em 1.6em', background:'var(--accent)', color:'#fff', borderRadius:'2px', textDecoration:'none' }}>View Projects</Link>
            <Link href="/contact"  style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.65em 1.6em', background:'transparent', color:'var(--text)', border:'1px solid var(--border-2)', borderRadius:'2px', textDecoration:'none' }}>Contact</Link>
          </div>

          <div style={{ ...fade(520), height:'1px', background:'var(--border)', marginBottom:'2rem' }} />

          {/* Stats */}
          <div style={{ ...fade(580), display:'grid', gridTemplateColumns:'repeat(4,1fr)', marginBottom:'2rem' }}>
            {([['5','Projects'],['8+','Awards'],['2025','Graduating'],['NCU','Grad School']] as [string,string][]).map(([num,label], i) => (
              <div key={label} style={{ paddingRight:'1.25rem', borderRight:i<3?'1px solid var(--border)':'none', paddingLeft:i>0?'1.25rem':'0' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, lineHeight:1, marginBottom:'0.2rem' }}>{num}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.56rem', letterSpacing:'0.1em', color:'var(--muted)', textTransform:'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ ...fade(640) }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.58rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Core Skills</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
              {['BERT','NLP','React','Next.js','Python','OCR','AWS'].map(s => (
                <span key={s} style={{ fontFamily:'var(--font-mono)', fontSize:'0.67rem', padding:'0.2em 0.7em', borderRadius:'2px', background:'var(--bg-2)', color:'var(--text-2)', border:'1px solid var(--border)' }}>{s}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section style={{ padding:'clamp(4rem,8vw,8rem) clamp(2rem,5vw,5rem)', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'3rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Selected Work</p>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:300 }}>Projects & Research</h2>
          </div>
          <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--accent)', borderBottom:'1px solid var(--accent)', paddingBottom:'2px', textDecoration:'none' }}>View All</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1px', background:'var(--border)' }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{ background:'var(--bg)', padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:300, color:'var(--border-2)', lineHeight:1 }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', padding:'0.2em 0.7em', borderRadius:'99px', background:'rgba(59,91,219,0.06)', color:'var(--accent)', border:'1px solid rgba(59,91,219,0.15)' }}>{p.type==='research'?'研究':'專案'}</span>
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:400, marginBottom:'0.3rem' }}>{p.title}</h3>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--muted)' }}>{p.period}</p>
              </div>
              <p style={{ fontSize:'0.88rem', color:'var(--text-2)', lineHeight:1.75, flex:1 }}>{p.description.slice(0,100)}...</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', paddingTop:'0.5rem', borderTop:'1px solid var(--border)' }}>
                {p.tags.slice(0,3).map(t => <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:'0.67rem', padding:'0.2em 0.7em', borderRadius:'2px', background:'var(--bg-2)', color:'var(--text-2)', border:'1px solid var(--border)' }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
