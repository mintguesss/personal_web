'use client'
import { useState, useEffect } from 'react'
import { siteData } from '@/data/portfolio'

const IgSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
const LineSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 10.3C24 4.9 18.6.6 12 .6S0 4.9 0 10.3c0 4.8 4.3 8.8 10 9.6.4.1.9.3 1.1.6.1.3.1.8 0 1.1l-.2 1c0 .3-.2 1.2 1 .6 1.3-.5 6.9-4.1 9.4-7C23.2 14.4 24 12.5 24 10.3zM7.9 13.1H5.7c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v3.8H7.9c.3 0 .6.3.6.6s-.3.6-.6.6zm2.3-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm5.1 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.4zm3.6-2.7c.3 0 .6.3.6.6s-.3.6-.6.6H17.2v1.1h1.7c.3 0 .6.3.6.6s-.3.6-.6.6h-2.3c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6h2.3c.3 0 .6.3.6.6s-.3.6-.6.6h-1.7v1.1h1.7z"/>
  </svg>
)
const GmailSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)

export default function ContactPage() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const CONTACT_ITEMS = [
    { icon: <GmailSVG />, label: 'Email',     value: siteData.email,       href: `mailto:${siteData.email}`,                                     note: '歡迎寄信交流' },
    { icon: <IgSVG />,    label: 'Instagram', value: '@mintguesss',        href: (siteData.links as Record<string,string>).instagram || '',        note: '追蹤日常' },
    { icon: <LineSVG />,  label: 'Line',      value: 'mintguesss',         href: (siteData.links as Record<string,string>).line || '',             note: '即時聯繫' },
  ]

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: mobile ? '4rem 1.5rem 2rem' : 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem) 2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get In Touch</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, lineHeight: 1.1 }}>
            {"Let's"} <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Connect</em>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: mobile ? '2rem 1.5rem' : 'clamp(3rem,5vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '2.5rem' : '5rem', alignItems: 'start' }}>

          {/* 左 */}
          <div>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: 1.9, marginBottom: '2.5rem' }}>
              歡迎研究合作、實習機會或任何技術交流。不管是專案合作、問題討論還是單純打招呼，都很歡迎聯繫。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                ['電話', siteData.phone],
                ['位置', siteData.location],
                ['學校', siteData.institution],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)' }} />
            </div>
          </div>

          {/* 右 */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Channels</p>
            {CONTACT_ITEMS.map((item, i) => (
              <div key={item.label} style={{ borderTop: i === 0 ? '1px solid var(--border)' : 'none' }}>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr auto',
                    gap: '1rem', padding: '1.35rem 0',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center', textDecoration: 'none', color: 'inherit',
                  }}>
                    <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.15rem', color: 'var(--text)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{item.value}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', textAlign: 'right', whiteSpace: 'nowrap' }}>{item.note} →</span>
                  </a>
                ) : (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr auto',
                    gap: '1rem', padding: '1.35rem 0',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center', opacity: 0.5,
                  }}>
                    <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.15rem', color: 'var(--text)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{item.value}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'right' }}>填入連結</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
