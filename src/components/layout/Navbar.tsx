'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteData } from '@/data/portfolio'

const LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills',   label: 'Skills' },
  { href: '/awards',   label: 'Awards' },
  { href: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
    localStorage.setItem('theme', next ? 'dark' : 'light')
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
          gridTemplateColumns: isMobile ? '1fr auto auto' : '1fr 1fr 1fr',
          alignItems: 'center', height: '64px',
        }}>

          {/* Left — logo */}
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{siteData.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>{siteData.nameEn.toUpperCase()}</span>
          </Link>

          {/* Center — links（桌面才顯示） */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.73rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: pathname === href ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: pathname === href ? 500 : 400, transition: 'color 0.2s',
                }}>{label}</Link>
              ))}
            </nav>
          )}

          {/* Right — dark toggle + 漢堡 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={toggleDark} style={{
              background: 'none', border: '1px solid var(--border-2)', borderRadius: '99px',
              cursor: 'pointer', padding: '0.3em 0.75em',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)',
              whiteSpace: 'nowrap',
            }}>
              {dark ? '☀ Light' : '☾ Dark'}
            </button>

            {isMobile && (
              <button onClick={() => setOpen(v => !v)} aria-label="選單" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block', width: '20px', height: '1.2px',
                    background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s',
                    transform: open ? (i === 0 ? 'rotate(45deg) translate(4px,4px)' : i === 2 ? 'rotate(-45deg) translate(4px,-4px)' : 'none') : 'none',
                    opacity: open && i === 1 ? 0 : 1,
                  }} />
                ))}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 右側滑入選單 */}
      {isMobile && (
        <>
          {/* 背景遮罩 */}
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 48,
            background: 'rgba(0,0,0,0.3)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.3s',
          }} />

          {/* 側邊面板 */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 49,
            width: '260px',
            background: 'var(--bg)',
            borderLeft: '1px solid var(--border)',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column',
            paddingTop: '80px', paddingBottom: '2rem',
            paddingLeft: '2rem', paddingRight: '2rem',
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: pathname === href ? 'var(--accent)' : 'var(--text)',
                  fontWeight: pathname === href ? 500 : 400,
                  padding: '1rem 0',
                  borderBottom: '1px solid var(--border)',
                }}>{label}</Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}