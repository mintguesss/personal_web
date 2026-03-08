'use client'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

export default function Home() {
  type P = typeof siteData.projects[number]
  const featured = (siteData.projects as unknown as P[]).slice(0, 3)

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* HERO */}
      <section style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', position:'relative' }}>

        {/* Left — 照片 */}
        <div style={{ position:'relative', borderRight:'1px solid var(--border)', overflow:'hidden', minHeight:'100vh' }}>
          {/* 照片佔位：把 public/photo.jpg 放好後這裡會自動顯示 */}
          <img
            src="/personal_web/photo.jpg"
            alt={siteData.name}
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          {/* 沒有照片時的佔位背景 */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(160deg, var(--bg-2) 0%, var(--border) 100%)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:-1,
          }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'clamp(8rem,18vw,15rem)', fontWeight:300, color:'var(--border-2)', lineHeight:1, userSelect:'none' }}>黃</span>
          </div>
          {/* 左下角姓名 overlay */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'2rem', background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(255,255,255,0.7)', textTransform:'uppercase', marginBottom:'0.3rem' }}>
              {siteData.institution} · {siteData.title}
            </p>
          </div>
        </div>

        {/* Right — 文字 */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'clamp(6rem,10vw,10rem) clamp(2rem,5vw,4rem) clamp(4rem,6vw,6rem)' }}>
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'1.5rem' }}>Information Management</p>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(3rem,6vw,5rem)', fontWeight:300, lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:'0.4rem' }}>{siteData.name}</h1>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1rem,1.8vw,1.4rem)', fontWeight:300, fontStyle:'italic', color:'var(--muted)', marginBottom:'2rem' }}>{siteData.nameEn}</p>
            <p style={{ fontSize:'0.93rem', color:'var(--text-2)', lineHeight:1.85, maxWidth:'400px', marginBottom:'2.5rem' }}>{siteData.bio[0]}</p>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
              <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.7em 1.8em', background:'var(--accent)', color:'#fff', borderRadius:'2px', textDecoration:'none' }}>View Projects</Link>
              <Link href="/contact" style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.7em 1.8em', background:'transparent', color:'var(--text)', border:'1px solid var(--border-2)', borderRadius:'2px', textDecoration:'none' }}>Contact</Link>
            </div>
          </div>

          <div>
            {/* Stats grid — 小一點 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--border)', marginBottom:'2rem' }}>
              {([['5','Projects'],['8','Awards'],['2025','Graduating'],['NCU','Grad School']] as [string,string][]).map(([num,label]) => (
                <div key={label} style={{ background:'var(--bg)', padding:'1.25rem 1.5rem' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:400, lineHeight:1, marginBottom:'0.3rem' }}>{num}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.12em', color:'var(--muted)', textTransform:'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop:'1.5rem', borderTop:'1px solid var(--border)' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'0.4rem' }}>Contact</p>
              <a href={'mailto:'+siteData.email} style={{ fontFamily:'var(--font-mono)', fontSize:'0.82rem', color:'var(--accent)', textDecoration:'none' }}>{siteData.email}</a>
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
          <Link href="/projects" style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--accent)', borderBottom:'1px solid var(--accent)', paddingBottom:'2px', textDecoration:'none' }}>View All</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1px', background:'var(--border)' }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{ background:'var(--bg)', padding:'2.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:300, color:'var(--border-2)', lineHeight:1 }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', padding:'0.2em 0.7em', borderRadius:'99px', background:p.type==='research'?'rgba(59,91,219,0.06)':'rgba(59,91,219,0.06)', color:'var(--accent)', border:'1px solid rgba(59,91,219,0.15)' }}>{p.type==='research'?'研究':'專案'}</span>
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:400, marginBottom:'0.3rem' }}>{p.title}</h3>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--muted)' }}>{p.period}</p>
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
