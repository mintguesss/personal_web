'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteData } from '@/data/portfolio'

const LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/projects',    label: 'Projects' },
  { href: '/skills',      label: 'Skills' },
  { href: '/awards',      label: 'Awards' },
  { href: '/contact',     label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(244,245,247,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{siteData.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>{siteData.nameEn.toUpperCase()}</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '2rem' }} className="hidden md:flex">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.73rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: active ? 500 : 400,
                  transition: 'color 0.2s',
                }}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(v => !v)} className="flex md:hidden flex-col justify-center gap-1.5 w-8 h-8" aria-label="選單" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ display: 'block', height: '1.5px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
            <span style={{ display: 'block', height: '1.5px', background: 'var(--text)', borderRadius: '2px', opacity: open ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', height: '1.5px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 49, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: pathname === href ? 'var(--accent)' : 'var(--text)', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      )}
    </>
  )
}
