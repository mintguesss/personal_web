'use client'
// src/components/Navbar.tsx
import { useState, useEffect } from 'react'
import { siteData } from '@/data/portfolio'

const NAV_ITEMS = [
  { id: 'about',      label: '關於我' },
  { id: 'education',  label: '學歷' },
  { id: 'projects',   label: '專案' },
  { id: 'skills',     label: '技能' },
  { id: 'awards',     label: '獎項' },
  { id: 'contact',    label: '聯絡' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [active,    setActive]    = useState('')
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      // active section detection
      let cur = ''
      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) cur = id
      })
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13,15,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        padding: '1rem 0',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.9rem', letterSpacing: '0.05em' }}
        >
          {siteData.nameEn} /
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.05em',
                  color: active === id ? 'var(--accent)' : 'var(--muted)',
                  transition: 'color 0.2s',
                  position: 'relative',
                }}
                className="group"
              >
                {label}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: active === id ? '100%' : '0',
                    height: '1px',
                    background: 'var(--accent)',
                    transition: 'width 0.3s',
                  }}
                  className="group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="選單"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: 'var(--text)',
                borderRadius: '2px',
                transition: 'all 0.3s',
                transformOrigin: 'center',
                transform:
                  menuOpen
                    ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                    : i === 1 ? 'opacity:0'
                    : 'rotate(-45deg) translate(5px,-5px)'
                    : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
          className="md:hidden"
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="block px-8 py-4 text-sm"
              style={{
                fontFamily: 'var(--font-mono)',
                borderBottom: '1px solid var(--border)',
                color: active === id ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
