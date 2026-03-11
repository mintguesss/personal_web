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
  const fadeLeft = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateX(-16px)',
    transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
  })

  const undergrad = siteData.education.find(e => e.school === '輔仁大學')
  const grad = siteData.education.find(e => e.school === '國立中央大學')
  const stats = [
    [undergrad?.school ?? '輔仁大學', undergrad?.dept ?? '資訊管理系'],
    [grad?.school ?? '中央大學', '研究所（2026）'],
    [`${siteData.awards.length}+`, 'Awards'],
    [`${siteData.projects.length}`, 'Projects'],
  ] as [string, string][]

  return (
    <div style={{ minHeight: '100vh' }}>
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div className="hero-grid" style={{ flex: 1, alignItems: 'center' }}>

          {/* Left — photo */}
          <div className="hero-photo">
            <div style={{ ...fadeLeft(0), position: 'relative', width: '45%', borderRadius: '4px', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img
                src='/personal_web/photo.jpg'
                alt={siteData.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,var(--bg-2) 0%,var(--border) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: -1 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,10vw,8rem)', fontWeight: 300, color: 'var(--border-2)', lineHeight: 1, userSelect: 'none' }}>K</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="hero-content">
            <div style={{ ...fade(100), marginBottom: '0.6rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>Information Management</p>
            </div>
            <div style={{ ...fade(180), marginBottom: '1.25rem' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,5vw,4.2rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{siteData.name}</h1>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem,1.4vw,1.15rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--muted)' }}>{siteData.nameEn}</p>
            </div>
            <div style={{ ...fade(260), marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '440px' }}>{siteData.bio[0]}</p>
            </div>
            <div style={{ ...fade(330), display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2rem' }}>
              {(siteData.taglines as readonly string[]).map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '14px', height: '1px', background: 'var(--accent)', display: 'block', flexShrink: 0, opacity: 0.4 + i * 0.15 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-2)', letterSpacing: '0.03em' }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ ...fade(400), display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/projects" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.65em 1.6em', background: 'var(--accent)', color: '#fff', borderRadius: '2px', textDecoration: 'none' }}>View Projects</Link>
              <Link href="/contact" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.65em 1.6em', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-2)', borderRadius: '2px', textDecoration: 'none' }}>Contact</Link>
            </div>
            <div style={{ ...fade(460) }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Core Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(siteData.homeSkills as readonly string[]).map(s => (
                  <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', padding: '0.2em 0.7em', borderRadius: '2px', background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部 stats */}
        <div style={{ ...fade(520), borderTop: '1px solid var(--border)' }}>
          <div className="stats-grid">
            {stats.map(([num, label], i) => (
              <div key={label} className="stats-cell" style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, lineHeight: 1, marginBottom: '0.2rem', color: 'var(--text)' }}>{num}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* FEATURED PROJECTS */}
      <section style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Selected Work</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 300 }}>Projects & Research</h2>
          </div>
          <Link href="/projects" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid var(--accent)', paddingBottom: '2px', textDecoration: 'none' }}>View All</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1px', background: 'var(--border)' }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--bg)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--border-2)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.2em 0.7em', borderRadius: '99px', background: 'rgba(59,91,219,0.06)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.15)' }}>{p.type === 'research' ? '研究' : '專案'}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, marginBottom: '0.3rem' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>{p.period}</p>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.75, flex: 1 }}>{p.description.slice(0, 100)}...</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                {p.tags.slice(0, 3).map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', padding: '0.2em 0.7em', borderRadius: '2px', background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
