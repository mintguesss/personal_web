'use client'
// src/components/Projects.tsx
import SectionWrapper from './SectionWrapper'
import { siteData } from '@/data/portfolio'

type ProjectType = 'project' | 'research'

export default function Projects() {
  return (
    <SectionWrapper id="projects" label="projects & research" title="專案 & 研究">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteData.projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </SectionWrapper>
  )
}

function ProjectCard({ project: p }: { project: typeof siteData.projects[number] }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="font-semibold text-base leading-snug"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {p.title}
          </h3>
          <p
            className="text-xs mt-1"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}
          >
            {p.subtitle} · {p.period}
          </p>
        </div>
        <TypeBadge type={p.type} />
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        {p.description}
      </p>

      {/* Highlights */}
      <ul className="flex flex-col gap-1.5">
        {p.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--muted)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>▸</span>
            {h}
          </li>
        ))}
      </ul>

      {/* Footer: tags + link */}
      <div className="mt-auto flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map(t => (
            <span
              key={t}
              className="text-xs rounded-full px-2.5 py-0.5"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs flex items-center gap-1 transition-all duration-200 hover:gap-2"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
          >
            查看 →
          </a>
        )}
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: ProjectType }) {
  const isResearch = type === 'research'
  return (
    <span
      className="text-xs px-2.5 py-0.5 rounded-full shrink-0"
      style={{
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        background: isResearch ? 'rgba(91,141,238,0.1)' : 'var(--accent-glow)',
        color: isResearch ? 'var(--accent-2)' : 'var(--accent)',
        border: isResearch ? '1px solid rgba(91,141,238,0.3)' : '1px solid rgba(232,184,109,0.3)',
      }}
    >
      {isResearch ? '研究' : '專案'}
    </span>
  )
}
