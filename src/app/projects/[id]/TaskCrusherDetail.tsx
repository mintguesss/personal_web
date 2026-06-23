'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

type Project = typeof siteData.projects[number]

const REPORT_URL = '/personal_web/projects/task-crusher/group45_report.pdf'
const DEMO_URL = 'https://taica-llm.onrender.com/'
const GITHUB_URL = 'https://github.com/mintguesss/TAICA_LLM'

function R({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const t = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(t)
    } else {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect() } }, { threshold: 0.06 })
      obs.observe(el)
      return () => obs.disconnect()
    }
  }, [delay])
  return <div ref={ref} style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>{children}</div>
}

const ExtIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
)
const GhIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
)
const DocIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
)

function LinkBtn({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500,
      padding: '0.55em 1.1em', borderRadius: '7px', textDecoration: 'none',
      color: 'var(--text-2)', background: 'var(--bg)', border: '1px solid var(--border-2)', transition: 'all 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
    >{icon}{label}</a>
  )
}

function PageCard({ p, mobile }: { p: { icon: string; name: string; desc: string }; mobile: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%', padding: mobile ? '1.05rem 1.2rem' : '1.15rem 1.35rem',
        background: 'var(--surface-2)', border: '1px solid', borderColor: hovered ? 'var(--accent)' : 'var(--border)',
        borderRadius: '9px',
        transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '1.2rem', lineHeight: 1, transition: 'transform 0.22s', transform: hovered ? 'scale(1.18)' : 'none' }}>{p.icon}</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.97rem', fontWeight: 600, color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'color 0.22s' }}>{p.name}</h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{p.desc}</p>
    </div>
  )
}

const flow = [
  { step: '01', title: '使用者輸入', desc: '輸入任務需求（報告、專案、考試）、目前的拖延心情與卡關原因，可選填時間壓力、剩餘期限等個人狀態。' },
  { step: '02', title: 'AI 分析與粉碎', desc: '分析情緒文字辨識心理防衛機制、評估認知負荷，把大型任務拆成可立即執行的最小步驟，並產生陪伴式鼓勵。' },
  { step: '03', title: '執行與獎勵', desc: '每日完成最小步驟、打勾累積進度，解鎖可組裝的 3D 模型零件；集滿後可匯出 STL 做實體 3D 列印。' },
]

const pages = [
  { icon: '✅', name: '今日待辦', desc: '只顯示今天要做的最小任務與完成進度、本週完成度（總數 / 已完成 / 逾期），搭配專心時間與鼓勵小語。' },
  { icon: '🧩', name: '任務拆解', desc: '輸入任務與心情，右側即時給出心理分析與建議，並把龐大任務拆成小步驟清單，一鍵加入行事曆。' },
  { icon: '📅', name: '行事曆', desc: '檢視與手動新增所有任務、同步顯示模型收集進度與今日建議，月曆直接標示各日任務。' },
  { icon: '🎁', name: '收集箱', desc: '六款 3D 模型（小柴犬、企鵝先生…），顯示零件進度與解鎖狀態，完成後可下載 STL 列印檔。' },
]

const philosophy = [
  { icon: '🧠', title: '行為心理學', desc: '把拖延理解成逃避、完美主義等心理防衛，而非懶惰——先理解原因，才談行動。' },
  { icon: '🪶', title: '認知負荷理論', desc: '把任務拆到夠小、降低開始的門檻，一次只面對一步，而不是龐大的全貌。' },
  { icon: '🌱', title: '陪伴而非監督', desc: '在績效焦慮裡用溫和鼓勵與可視化的成長取代壓力，建立正向回饋循環。' },
]

const features = [
  { title: 'AI 拖延分析', desc: '不只貼上標籤，而是分析輸入的情緒文字，辨識完美主義、逃避、害怕失敗等心理防衛機制，點出壓力的真正來源，幫使用者理解自己、而不是責怪自己不夠自律。' },
  { title: '任務粉碎', desc: '把「完成研究報告」這種龐大任務，拆成「建立文件、找一篇文獻、寫第一段」等可立即執行的最小步驟，並依個人狀態與剩餘時間調整每日份量，降低開始行動的認知負荷。' },
  { title: '遊戲化收藏', desc: '每完成一項任務就發放模型零件，不同難度對應不同稀有度；零件會逐步組裝成可旋轉的 3D 模型，讓原本抽象的努力變成看得見、會慢慢成長的收藏。' },
  { title: '3D 列印輸出', desc: '當模型集滿零件後可匯出 STL 檔，透過 3D 列印把虛擬成果變成實體收藏品，讓長期的努力與成就變得可觸摸、具有紀念價值。' },
]

const tech = [
  { label: '前端', value: 'HTML / CSS / JavaScript' },
  { label: '後端', value: 'Python（Flask）' },
  { label: '資料庫', value: 'Supabase（PostgreSQL）' },
  { label: 'AI 模型', value: 'Groq API' },
  { label: '3D 輸出', value: 'STL 匯出 → 3D 列印' },
  { label: '部署', value: 'Render（雲端部署）' },
]

const team: { name: string; role: string; lead?: boolean }[] = [
  { name: '黃予岑', lead: true, role: '系統整體架構與建置、後端與 Groq API 串接、AI 任務拆解邏輯設計，以及今日待辦 / 行事曆 / 任務拆解等核心頁面開發。' },
  { name: '徐子崴', role: '收集箱頁面、資料庫結構與資料建置、系統背景講解。' },
  { name: '何沛真', role: '任務拆解頁面內容、簡報製作與講稿。' },
]

export default function TaskCrusherDetail({ project, mobile }: { project: Project; mobile: boolean }) {
  const pad = mobile ? '0 1.5rem' : '0 clamp(2rem,5vw,4.5rem)'
  const sec: React.CSSProperties = { padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }
  const secTitle: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontSize: mobile ? '1.1rem' : '1.2rem',
    fontWeight: 600, color: 'var(--text)', marginBottom: '1.1rem',
  }
  const para: React.CSSProperties = { fontSize: '0.97rem', color: 'var(--text-2)', lineHeight: 2 }

  return (
    <div style={{ paddingTop: mobile ? '4.5rem' : '5rem', paddingBottom: '5rem' }}>

      {/* ── Header ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: mobile ? '2.5rem 1.5rem 2rem' : '3rem clamp(2rem,5vw,4.5rem) 2rem' }}>
        <R>
          <Link href="/projects" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >← 所有專案</Link>
        </R>
        <R delay={60}>
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0 1.1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>課程專題</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>團隊專題 · 3 人</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.1rem' }}>AI Procrastination Analyzer &amp; Task Crusher · {project.period}</p>
        </R>
        <R delay={150}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <LinkBtn href={DEMO_URL} label="線上 Demo" icon={<ExtIcon />} />
              <LinkBtn href={GITHUB_URL} label="GitHub" icon={<GhIcon />} />
              <LinkBtn href={REPORT_URL} label="專案報告 PDF" icon={<DocIcon />} />
            </div>
          </div>
        </R>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: pad }}>

        {/* 核心概念 */}
        <div style={sec}>
          <R><h2 style={secTitle}>核心概念</h2></R>
          <R delay={60}><p style={para}>{project.description}</p></R>
          <R delay={100}><p style={{ ...para, marginTop: '1rem' }}>傳統待辦事項只記錄「要做什麼」，卻無法理解人為什麼開始不了。本系統沿著「理解拖延原因 → 降低心理壓力 → 粉碎任務 → 協助開始行動」的流程，把抽象的努力轉成看得見、甚至列印得出來的成果。</p></R>
        </div>

        {/* 運作流程 — 時間軸 */}
        <div style={sec}>
          <R><h2 style={secTitle}>運作流程</h2></R>
          <div style={{ marginTop: '0.5rem' }}>
            {flow.map((f, i) => (
              <R key={f.step} delay={50 + i * 70}>
                <div style={{ display: 'flex', gap: mobile ? '1rem' : '1.4rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem' }}>{f.step}</div>
                    {i < flow.length - 1 && <div style={{ flex: 1, width: '2px', background: 'linear-gradient(var(--accent-mid),transparent)', marginTop: '0.35rem', minHeight: '1.4rem' }} />}
                  </div>
                  <div style={{ paddingBottom: i < flow.length - 1 ? '1.7rem' : 0, paddingTop: '0.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.85 }}>{f.desc}</p>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 功能亮點 */}
        <div style={sec}>
          <R><h2 style={secTitle}>功能亮點</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '1.6rem' : '1.6rem 2.5rem', marginTop: '0.5rem' }}>
            {features.map((f, i) => (
              <R key={f.title} delay={50 + i * 60}>
                <div style={{ position: 'relative', paddingTop: '1.6rem' }}>
                  <span style={{ position: 'absolute', top: '0', right: '0', fontFamily: 'var(--font-mono)', fontSize: '3.4rem', fontWeight: 700, color: 'var(--accent)', opacity: 0.09, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.55rem', position: 'relative' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.85, position: 'relative' }}>{f.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 四大頁面 */}
        <div style={sec}>
          <R><h2 style={secTitle}>四大頁面</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.85rem', marginTop: '0.5rem' }}>
            {pages.map((p, i) => (
              <R key={p.name} delay={50 + i * 50}>
                <PageCard p={p} mobile={mobile} />
              </R>
            ))}
          </div>
        </div>

        {/* 設計理念 */}
        <div style={sec}>
          <R><h2 style={secTitle}>設計理念</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: mobile ? '1.5rem' : '2rem', marginTop: '0.5rem' }}>
            {philosophy.map((p, i) => (
              <R key={p.title} delay={50 + i * 70}>
                <div>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{p.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.45rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.8 }}>{p.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 技術架構 */}
        <div style={sec}>
          <R><h2 style={secTitle}>技術架構</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.7rem 2rem', marginTop: '0.5rem' }}>
            {tech.map((t, i) => (
              <R key={t.label} delay={40 + i * 45}>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', background: 'var(--accent-light)', border: '1px solid rgba(59,91,219,0.2)', borderRadius: '99px', padding: '0.32em 0.95em', flexShrink: 0, minWidth: '5.5rem', textAlign: 'center' }}>{t.label}</span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-2)' }}>{t.value}</span>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 團隊分工 */}
        <div style={sec}>
          <R><h2 style={secTitle}>團隊分工</h2></R>
          <R delay={50}><p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.9rem' }}>輔仁大學 資訊管理學系 · 3 人團隊</p></R>
          {team.map((m, i) => (
            <R key={m.name} delay={70 + i * 55}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', padding: '0.85rem 1rem', marginBottom: '0.45rem', borderLeft: m.lead ? '3px solid var(--accent)' : '3px solid var(--border)', background: m.lead ? 'var(--accent-light)' : 'transparent', borderRadius: '0 8px 8px 0' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', flexShrink: 0, minWidth: '4.5rem' }}>{m.name}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {m.lead && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.15em 0.65em', borderRadius: '99px', background: 'var(--bg)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.25)', marginRight: '0.5rem', verticalAlign: 'middle' }}>主要開發</span>}
                  {m.role}
                </span>
              </div>
            </R>
          ))}
        </div>

        <R delay={80}>
          <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none', marginTop: '2.5rem', display: 'inline-flex' }}>← 回到專案列表</Link>
        </R>
      </div>
    </div>
  )
}
