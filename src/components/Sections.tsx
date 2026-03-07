'use client'
// src/components/Sections.tsx
// 所有靜態 sections 集中在這個檔案，方便管理
import SectionWrapper from './SectionWrapper'
import { siteData } from '@/data/portfolio'

/* ==================== SHARED PRIMITIVES ==================== */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {children}
    </div>
  )
}

function Tag({ children }: { children: string }) {
  return (
    <span
      className="text-xs rounded-full px-3 py-1 transition-colors duration-200"
      style={{
        fontFamily: 'var(--font-mono)',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
      }}
    >
      {children}
    </span>
  )
}

/* ==================== ABOUT ==================== */
export function About() {
  return (
    <SectionWrapper id="about" label="introduction" title="關於我">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {siteData.bio.map((p, i) => (
            <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.9 }}>{p}</p>
          ))}
        </div>
        <Card>
          <ul className="space-y-4">
            {[
              ['學校', `${siteData.institution} ${siteData.title}`],
              ['Email', siteData.email],
              ['電話', siteData.phone],
              ['位置', siteData.location],
            ].map(([label, value]) => (
              <li key={label} className="flex gap-4 text-sm items-start">
                <span
                  className="text-xs tracking-wide pt-0.5 shrink-0"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', minWidth: '60px' }}
                >
                  {label}
                </span>
                {label === 'Email' ? (
                  <a href={`mailto:${value}`} style={{ color: 'var(--accent)' }}>{value}</a>
                ) : (
                  <span style={{ color: 'var(--text)' }}>{value}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </SectionWrapper>
  )
}

/* ==================== EDUCATION ==================== */
export function Education() {
  return (
    <SectionWrapper id="education" label="education" title="學歷">
      <div className="space-y-4">
        {siteData.education.map((e) => (
          <Card key={e.school}>
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-6">
                <span
                  className="text-xs shrink-0"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', minWidth: '110px' }}
                >
                  {e.period}
                </span>
                <div>
                  <div className="font-semibold text-base">{e.school}</div>
                  {e.dept && (
                    <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                      {e.dept} — {e.degree}
                    </div>
                  )}
                </div>
              </div>
              {e.badge && (
                <span
                  className="text-xs px-3 py-1 rounded-full shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(232,184,109,0.3)',
                  }}
                >
                  {e.badge}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

/* ==================== SKILLS ==================== */
export function Skills() {
  return (
    <SectionWrapper id="skills" label="skills" title="技能">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(siteData.skills).map(([group, items]) => (
          <Card key={group}>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
            >
              {group}
            </p>
            <div className="flex flex-wrap gap-2">
              {(items as readonly string[]).map(s => <Tag key={s}>{s}</Tag>)}
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

/* ==================== AWARDS ==================== */
export function Awards() {
  return (
    <SectionWrapper id="awards" label="awards & honors" title="獎項 & 榮譽">
      <Card className="!p-0 overflow-hidden">
        {siteData.awards.map((a, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors duration-200"
            style={{
              borderBottom: i < siteData.awards.length - 1 ? '1px solid var(--border)' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span
              className="text-xs w-12 shrink-0"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
            >
              {a.year}
            </span>
            <span className="flex-1 text-sm font-medium">{a.title}</span>
            <span
              className="text-xs hidden sm:block"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}
            >
              {a.org}
            </span>
          </div>
        ))}
      </Card>
    </SectionWrapper>
  )
}

/* ==================== EXPERIENCE ==================== */
export function Experience() {
  return (
    <SectionWrapper id="experience" label="experience" title="工作經驗">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {siteData.experience.map((e) => (
          <Card key={e.company}>
            <div className="font-semibold text-base">{e.role}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--accent)' }}>{e.company}</div>
            <div
              className="text-xs mt-1 mb-3"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}
            >
              {e.period}
            </div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>{e.desc}</div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

/* ==================== CONTACT ==================== */
export function Contact() {
  return (
    <SectionWrapper id="contact" label="contact" title="聯絡我">
      <div className="text-center max-w-xl mx-auto">
        <p className="mb-6" style={{ color: 'var(--muted)' }}>
          歡迎研究合作、實習機會或任何交流，隨時歡迎寫信！
        </p>
        <a
          href={`mailto:${siteData.email}`}
          className="block text-2xl md:text-4xl transition-opacity hover:opacity-75 mb-8"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
        >
          {siteData.email}
        </a>
        <div className="flex justify-center gap-4 flex-wrap">
          {siteData.links.github && (
            <a
              href={siteData.links.github}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              GitHub ↗
            </a>
          )}
          {siteData.links.linkedin && (
            <a
              href={siteData.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              LinkedIn ↗
            </a>
          )}
          <a href={`mailto:${siteData.email}`} className="btn-primary">
            寫信給我
          </a>
        </div>
      </div>
      <style jsx>{`
        .btn-primary {
          display: inline-flex; align-items: center;
          font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700;
          padding: 0.65em 1.5em; border-radius: 6px;
          background: var(--accent); color: var(--bg); border: none;
          cursor: pointer; transition: all 0.25s; text-decoration: none;
        }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .btn-outline {
          display: inline-flex; align-items: center;
          font-family: var(--font-mono); font-size: 0.82rem;
          padding: 0.65em 1.5em; border-radius: 6px;
          background: transparent; color: var(--text);
          border: 1px solid var(--border); cursor: pointer;
          transition: all 0.25s; text-decoration: none;
        }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </SectionWrapper>
  )
}

/* ==================== FOOTER ==================== */
export function Footer() {
  return (
    <footer
      className="py-8 text-center text-xs"
      style={{
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--muted)',
      }}
    >
      © {new Date().getFullYear()} {siteData.name} ({siteData.nameEn}) · Built with Next.js
    </footer>
  )
}
