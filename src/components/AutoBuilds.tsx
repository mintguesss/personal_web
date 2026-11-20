'use client'
import { useEffect, useState } from 'react'
import { siteData } from '@/data/portfolio'
import { buildsDetail } from '@/data/buildsDetail'

/**
 * Projects from the repofolio showcase that aren't on this site yet.
 * New repos show up here automatically; once you write a proper entry in portfolio.ts
 * (same name / id / GitHub repo), it disappears from this list.
 */
const SOURCE = 'https://mintguesss.github.io/repofolio/projects.json'
const SHOWCASE = 'https://mintguesss.github.io/repofolio/'
/** Repos that are already on the site under another name, or shouldn't be listed. */
const ALREADY_HERE = ['TAICA_LLM', 'personal_web', 'mintguesss']

interface ShowcaseProject {
  id: string
  name: string
  repo: string
  summary: string
  stack: string[]
  languages: { name: string; pct: number }[]
  image?: string
  created: string
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function known(): Set<string> {
  const keys = new Set<string>(ALREADY_HERE.map(norm))
  for (const b of [...siteData.builds, ...siteData.projects]) {
    keys.add(norm(b.id))
    keys.add(norm(b.title.split(' ')[0] ?? b.title))
  }
  for (const d of Object.values(buildsDetail) as { links?: { github?: string } }[]) {
    const repo = d.links?.github?.split('/').pop()
    if (repo) keys.add(norm(repo))
  }
  return keys
}

export default function AutoBuilds({ mobile }: { mobile: boolean }) {
  const [items, setItems] = useState<ShowcaseProject[]>([])
  useEffect(() => {
    let alive = true
    fetch(SOURCE, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then((d: { projects?: ShowcaseProject[] } | null) => {
        if (!alive || !d?.projects) return
        const k = known()
        const fresh = d.projects
          .filter(p => !k.has(norm(p.name)) && !k.has(norm(p.repo.split('/').pop() ?? '')))
          .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
        setItems(fresh)
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  if (!items.length) return null

  return (
    <section style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>More</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>其他作品</h2>
        </div>
        <a href={SHOWCASE} target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>全部作品 →</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
        {items.map(p => <Card key={p.id} p={p} />)}
      </div>
    </section>
  )
}

function Card({ p }: { p: ShowcaseProject }) {
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(!!p.image)
  const tags = Array.from(new Set(p.stack.concat(p.languages.slice(0, 2).map(l => l.name)))).slice(0, 4)
  return (
    <a
      href={`${SHOWCASE}#/p/${p.id}`}
      target="_blank"
      rel="noopener"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit',
        border: '1px solid', borderColor: hovered ? 'var(--border-2)' : 'var(--border)', borderRadius: 'var(--radius)',
        overflow: 'hidden', background: 'var(--bg)',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
      }}
    >
      <div style={{ aspectRatio: '16/9', background: 'var(--bg-2)', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
        {imgOk && p.image ? (
          <img src={p.image} alt={p.name} referrerPolicy="no-referrer" onError={() => setImgOk(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.04)' : 'none' }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--border-2)' }}>{p.name.slice(0, 1).toUpperCase()}</span>
        )}
      </div>
      <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'color 0.2s' }}>{p.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.4rem' }}>
          {tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.64rem' }}>{t}</span>)}
        </div>
      </div>
    </a>
  )
}
