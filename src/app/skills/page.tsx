import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'Skills' }

const CAT_DESC: Record<string,string> = {
  '程式語言':    'Languages I write in daily',
  '前端框架':    'Building user interfaces',
  'AI / ML':    'Models, training & pipelines',
  '後端 / 資料庫':'Server, API & data layer',
  '雲端 / 工具': 'Infrastructure & tooling',
}

export default function SkillsPage() {
  const entries = Object.entries(siteData.skills)
  const total   = Object.values(siteData.skills).flat().length

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem) 2.5rem', display:'grid', gridTemplateColumns:'1fr auto', alignItems:'flex-end', gap:'2rem' }}>
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'0.75rem' }}>Expertise</p>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:300, lineHeight:1.05 }}>
              Skills &amp; <em style={{ fontStyle:'italic', color:'var(--muted)' }}>Technologies</em>
            </h1>
          </div>
          <div style={{ textAlign:'right', paddingBottom:'0.25rem' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'3.5rem', fontWeight:300, lineHeight:1, color:'var(--accent)' }}>{total}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase', marginTop:'0.25rem' }}>technologies</div>
          </div>
        </div>
      </div>

      {/* 主要分類：左右排版 */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)' }}>
        {entries.map(([group, items], i) => (
          <div key={group} style={{
            display:'grid', gridTemplateColumns:'240px 1fr',
            gap:'3rem', padding:'3rem 0',
            borderBottom:'1px solid var(--border)',
            alignItems:'start',
          }}>
            {/* 左：分類資訊 */}
            <div style={{ paddingTop:'0.25rem' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:300, color:'var(--border-2)', lineHeight:1, display:'block', marginBottom:'0.75rem' }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:400, color:'var(--text)', marginBottom:'0.4rem' }}>{group}</h2>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--muted)', lineHeight:1.6, marginBottom:'0.75rem' }}>{CAT_DESC[group] ?? ''}</p>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--accent)' }}>{(items as readonly string[]).length} skills</span>
            </div>

            {/* 右：技能 tag + bar */}
            <div>
              {/* Tags */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.75rem' }}>
                {(items as readonly string[]).map((skill, si) => (
                  <span key={skill} style={{
                    fontFamily:'var(--font-mono)',
                    fontSize: si === 0 ? '0.88rem' : '0.75rem',
                    padding: si === 0 ? '0.4em 1.2em' : '0.3em 0.9em',
                    borderRadius:'2px',
                    background: si === 0 ? 'var(--accent)' : 'var(--bg-2)',
                    color: si === 0 ? '#fff' : 'var(--text-2)',
                    border: si === 0 ? 'none' : '1px solid var(--border)',
                    fontWeight: si === 0 ? 500 : 400,
                  }}>{skill}</span>
                ))}
              </div>
              {/* 每項進度條 */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.6rem 2.5rem' }}>
                {(items as readonly string[]).map((skill, si) => {
                  const pct = Math.max(50, 98 - si * 10)
                  return (
                    <div key={skill} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--text-2)', width:'90px', flexShrink:0 }}>{skill}</span>
                      <div style={{ flex:1, height:'3px', background:'var(--border)', borderRadius:'99px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background: si===0 ? 'var(--accent)' : 'var(--border-2)', borderRadius:'99px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tag cloud 總覽 */}
      <div style={{ background:'var(--bg-2)', borderTop:'1px solid var(--border)', marginTop:'0' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'3rem clamp(1.5rem,5vw,4rem)' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.2em', color:'var(--muted)', textTransform:'uppercase', marginBottom:'1.25rem' }}>All Technologies</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {Object.values(siteData.skills).flat().map((s,i) => (
              <span key={i} style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', padding:'0.3em 0.9em', borderRadius:'2px', background:'var(--bg)', color:'var(--text-2)', border:'1px solid var(--border)' }}>{s as string}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
