'use client'
// src/components/Hero.tsx
import { siteData } from '@/data/portfolio'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden hero-grid"
      style={{ paddingTop: '8rem', paddingBottom: '5rem' }}
    >
      {/* 光暈 */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(232,184,109,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* greeting */}
        <p
          className="flex items-center gap-3 mb-4 text-sm tracking-widest reveal in-view"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', animationDelay: '0ms' }}
        >
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--accent)' }} />
          Hi, 我是
        </p>

        {/* name */}
        <h1
          className="font-bold leading-none mb-2 reveal in-view"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            animationDelay: '80ms',
          }}
        >
          {siteData.name}
        </h1>

        {/* name en */}
        <p
          className="mb-6 reveal in-view"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: 'var(--muted)',
            animationDelay: '140ms',
          }}
        >
          {siteData.nameEn}
        </p>

        {/* tagline */}
        <p
          className="mb-10 max-w-xl leading-relaxed reveal in-view"
          style={{ fontSize: '1.1rem', color: 'var(--muted)', animationDelay: '200ms' }}
        >
          <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>{siteData.institution}</strong>{' '}
          {siteData.title}
          <br />
          <span style={{ color: 'var(--muted)' }}>{siteData.tagline}</span>
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 reveal in-view" style={{ animationDelay: '260ms' }}>
          <a href="#projects" className="btn-primary">查看專案</a>
          <a href="#contact"  className="btn-outline">聯絡我</a>
          {siteData.links.github && (
            <a href={siteData.links.github} target="_blank" rel="noreferrer" className="btn-outline">
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* scroll hint */}
      <div
        className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          animation: 'bounce 2s infinite',
        }}
      >
        SCROLL
        <span
          style={{
            display: 'block',
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
          }}
        />
      </div>

      <style jsx>{`
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.65em 1.5em;
          border-radius: 6px;
          background: var(--accent);
          color: var(--bg);
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
        }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,109,0.3); }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          padding: 0.65em 1.5em;
          border-radius: 6px;
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
        }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </section>
  )
}
