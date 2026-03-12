'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteData } from '@/data/portfolio'

const LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/about',         label: 'About' },
  { href: '/projects',      label: 'Projects' },
  { href: '/skills_awards', label: 'Skills & Awards' },
  { href: '/contact',       label: 'Contact' },
]

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
const LineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 10.3C24 4.9 18.6.6 12 .6S0 4.9 0 10.3c0 4.8 4.3 8.8 10 9.6.4.1.9.3 1.1.6.1.3.1.8 0 1.1l-.2 1c0 .3-.2 1.2 1 .6 1.3-.5 6.9-4.1 9.4-7C23.2 14.4 24 12.5 24 10.3zM7.9 13.1H5.7c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v3.8H7.9c.3 0 .6.3.6.6s-.3.6-.6.6zm2.3-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm5.1 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm3.6-2.7c.3 0 .6.3.6.6s-.3.6-.6.6H17.2v1.1h1.7c.3 0 .6.3.6.6s-.3.6-.6.6h-2.3c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6h2.3c.3 0 .6.3.6.6s-.3.6-.6.6h-1.7v1.1h1.7z"/>
  </svg>
)
const GmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [dark, setDark]         = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') { setDark(true); document.documentElement.setAttribute('data-theme', 'dark') }
  }, [])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])

  const toggleDark = () => {
    const next = !dark; setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const links = siteData.links as Record<string, string>
  const iconBtn: React.CSSProperties = {
    color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px', background: 'none', border: 'none', cursor: 'pointer',
    borderRadius: '50%', textDecoration: 'none', flexShrink: 0, transition: 'color 0.2s',
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: scrolled ? (dark ? 'rgba(15,17,23,0.92)' : 'rgba(244,245,247,0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr 1fr',
          alignItems: 'center', height: '72px',
        }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)' }}>{siteData.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>{siteData.nameEn.toUpperCase()}</span>
          </Link>

          {!isMobile && (
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.02em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: pathname === href ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: pathname === href ? 500 : 400, transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}>{label}</Link>
              ))}
            </nav>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button onClick={toggleDark} style={{
              background: 'none', border: '1px solid var(--border-2)', borderRadius: '99px',
              cursor: 'pointer', padding: '0.35em 0.95em',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
              whiteSpace: 'nowrap', marginRight: '0.25rem',
            }}>
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
            {links.instagram ? <a href={links.instagram} target="_blank" rel="noreferrer" style={iconBtn}><IgIcon /></a> : <span style={iconBtn}><IgIcon /></span>}
            {links.line ? <a href={links.line} target="_blank" rel="noreferrer" style={iconBtn}><LineIcon /></a> : <span style={iconBtn}><LineIcon /></span>}
            <a href={`mailto:${siteData.email}`} style={iconBtn}><GmailIcon /></a>

            {isMobile && (
              <button onClick={() => setOpen(v => !v)} aria-label="選單" style={{
                background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.25rem',
                display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block', width: '24px', height: '1.5px',
                    background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s',
                    transform: open ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none') : 'none',
                    opacity: open && i === 1 ? 0 : 1,
                  }} />
                ))}
              </button>
            )}
          </div>
        </div>
      </header>

      {isMobile && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 48, background: 'rgba(0,0,0,0.3)',
            opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s',
          }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 49,
            width: '280px', background: 'var(--bg)', borderLeft: '1px solid var(--border)',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column',
            paddingTop: '88px', paddingBottom: '2rem', paddingLeft: '2rem', paddingRight: '2rem',
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.95rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: pathname === href ? 'var(--accent)' : 'var(--text)',
                  fontWeight: pathname === href ? 500 : 400,
                  padding: '1.1rem 0', borderBottom: '1px solid var(--border)',
                }}>{label}</Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}