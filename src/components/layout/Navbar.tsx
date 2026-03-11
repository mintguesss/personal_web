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
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{siteData.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>{siteData.nameEn.toUpperCase()}</span>
          </Link>

          {/* 桌面 nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.73rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: pathname === href ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: pathname === href ? 500 : 400, transition: 'color 0.2s',
                }}>{label}</Link>
              ))}
              <button onClick={toggleDark} style={{
                marginLeft: '1rem', background: 'none', border: '1px solid var(--border-2)',
                borderRadius: '99px', cursor: 'pointer', padding: '0.3em 0.75em',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)',
              }}>
                {dark ? '☀ Light' : '☾ Dark'}
              </button>
            </nav>
          )}

          {/* 漢堡按鈕 */}
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
      </header>

      {/* Mobile menu */}
      {open && isMobile && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
          background: 'var(--bg)', zIndex: 49,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
        }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300,
              color: pathname === href ? 'var(--accent)' : 'var(--text)', textDecoration: 'none',
            }}>{label}</Link>
          ))}
          <button onClick={toggleDark} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            background: 'none', border: '1px solid var(--border-2)', borderRadius: '99px',
            padding: '0.4em 1.2em', cursor: 'pointer',
          }}>
            {dark ? '☀ Light Mode' : '☾ Dark Mode'}
          </button>
        </div>
      )}
    </>
  )
}