'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

const IgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 10.3C24 4.9 18.6.6 12 .6S0 4.9 0 10.3c0 4.8 4.3 8.8 10 9.6.4.1.9.3 1.1.6.1.3.1.8 0 1.1l-.2 1c0 .3-.2 1.2 1 .6 1.3-.5 6.9-4.1 9.4-7C23.2 14.4 24 12.5 24 10.3zM7.9 13.1H5.7c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v3.8H7.9c.3 0 .6.3.6.6s-.3.6-.6.6zm2.3-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm5.1 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm3.6-2.7c.3 0 .6.3.6.6s-.3.6-.6.6H17.2v1.1h1.7c.3 0 .6.3.6.6s-.3.6-.6.6h-2.3c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6h2.3c.3 0 .6.3.6.6s-.3.6-.6.6h-1.7v1.1h1.7z"/>
  </svg>
)
const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

export default function Home() {
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile]   = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  const links = siteData.links as Record<string, string>
  const contactLinks = [
    { icon: <GmailIcon />,  label: siteData.email,  href: `mailto:${siteData.email}`,      color: '#EA4335' },
    { icon: <GithubIcon />, label: 'mintguesss',    href: 'https://github.com/mintguesss', color: '#6e7681' },
    { icon: <IgIcon />,     label: '@mintguesss',   href: links.instagram,                 color: '#E1306C' },
    { icon: <LineIcon />,   label: 'Line',          href: links.line,                      color: '#06C755' },
  ]

  const taglinesMeta = [
    { color: '#3B5BDB', label: 'EDU' },
    { color: '#0CA678', label: 'EDU' },
    { color: '#6e7681', label: 'ROLE' },
    { color: '#E1306C', label: 'ROLE' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      <section style={{ paddingTop: '10vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '50% 50%',
          alignItems: 'center',
        }}>

          {/* Left — photo */}
          <div style={{
            padding: mobile ? '6rem 3rem 2rem' : '1rem 2rem 0 2.5rem',
            borderRight: mobile ? 'none' : '1px solid var(--border)',
            borderBottom: mobile ? '1px solid var(--border)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: mobile ? 'auto' : '100%',
          }}>
            <div style={{ ...fadeLeft(0), position: 'relative', width: mobile ? '55%' : '55%', borderRadius: '4px', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img
                src={siteData.photo}
                alt={siteData.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,var(--bg-2) 0%,var(--border) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: -1 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,10vw,8rem)', fontWeight: 300, color: 'var(--border-2)', lineHeight: 1, userSelect: 'none' }}>K</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ padding: mobile ? '2rem 1.5rem 2.5rem' : '4rem 4rem 4rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Label */}
            <div style={{ ...fade(100), marginBottom: '0.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>Information Management</p>
            </div>

            {/* Name + English name inline */}
            <div style={{ ...fade(180), marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(2rem,3.8vw,3rem)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '0.04em',
                  margin: 0,
                }}>
                  {siteData.name}
                </h1>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(0.85rem,1.2vw,1rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  letterSpacing: '0.01em',
                }}>
                  {siteData.nameEn}
                </span>
              </div>
            </div>

            {/* Bio — moved here */}
            <div style={{ ...fade(240), marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.9, maxWidth: '440px' }}>{siteData.bio[0]}</p>
            </div>

            {/* Taglines */}
            <div style={{ ...fade(330), display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.75rem' }}>
              {(siteData.taglines as readonly string[]).map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '14px', height: '1px', background: 'var(--accent)', display: 'block', flexShrink: 0, opacity: 0.4 + i * 0.15 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-2)', letterSpacing: '0.03em' }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Core Skills */}
            <div style={{ ...fade(390), marginBottom: '1.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Core Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(siteData.homeSkills as readonly string[]).map(s => (
                  <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', padding: '0.2em 0.7em', borderRadius: '2px', background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div style={{ ...fade(460) }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Contact</p>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.45rem' }}>
                {contactLinks.map(({ icon, label, href, color }) => (
                  <a key={label} href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.65rem',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                      color: 'var(--muted)',
                      padding: '0.55em 0.9em',
                      borderRadius: '3px',
                      border: '1px solid transparent',
                      transition: 'color 0.18s, border-color 0.18s, background 0.18s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.color = color
                      el.style.borderColor = color + '40'
                      el.style.background = color + '12'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.color = 'var(--muted)'
                      el.style.borderColor = 'transparent'
                      el.style.background = 'transparent'
                    }}
                  >
                    <span style={{ color, display: 'flex', flexShrink: 0 }}>{icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                  </a>
                ))}
              </div>
            </div>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1px', background: 'var(--border)' }}>
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