'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { siteData } from '@/data/portfolio'

type Project = typeof siteData.projects[number]

const DEMO_URL = 'https://aidit-weld.vercel.app'
const GITHUB_URL = 'https://github.com/mintguesss/aidit'
const IMG = '/personal_web/projects/aidit'

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

const features = [
  { title: '修業明細', image: `${IMG}/audit.png`, desc: '逐類別比對已修與應修學分，每一列都能展開，看採計了哪些課、引用的是哪一條規定原文。' },
  { title: '待確認事項', image: `${IMG}/holds.png`, desc: '規定沒寫清楚就停下來，不替你猜。說明這件事會影響幾學分、該找哪個單位確認，並可一鍵產生詢問信。' },
  { title: '選課建議', image: `${IMG}/plan-chat.png`, desc: '依未修學分與學校公開的開課資料排出下學期課表；可以用一句話微調，系統會回報改了什麼、代價是什麼。' },
  { title: '情境試算', image: `${IMG}/scenario.png`, desc: '提前畢業、停修、雙主修、輔系、學程，依規定逐項推算；沒有收錄的規定會明講，不推算。' },
  { title: '執行紀錄', image: `${IMG}/trace.png`, desc: '每一步用了哪個工具、耗時多久、有沒有重試或走到分支，全部留下紀錄，可匯出查核。' },
]

const principles = [
  { title: '算數的那層沒有模型', desc: '學分審查、排課求解、原文回查都是純確定性運算。CI 會對這三個模組做遞移相依分析，任何一層 import 到 LLM client 就直接失敗。' },
  { title: '不變式失敗就中止', desc: '各類學分加總對不上就不輸出結果；超修的學分不能拿去填補其他類別。寧可不答，也不給錯的答案。' },
  { title: '結論都能回查原文', desc: '規則包的每個欄位都附原文引句，輸出前逐條比對；對不上就重試一次，仍失敗則把該條降級為待確認。' },
  { title: '回覆的字不是模型寫的', desc: '模型只輸出意圖與參數，schema 結構上就沒有「回答」欄位；回覆由模板組成，學分數字一律等於引擎算出來的數字。' },
  { title: '規則的洞寫在資料裡', desc: '規則包用 ambiguities 記錄規定沒寫清楚的地方，命中的修課會移出判定、產生待確認事項。' },
  { title: '外部內容是資料，不是指令', desc: '公告與使用者訊息都先過提示注入檢查，命中就不送進模型。' },
]

const flow = [
  { step: '01', title: '讀取修課紀錄', desc: '讀取失敗就直接回報錯誤，不輸出任何部分結果。' },
  { step: '02', title: '比對規則版本', desc: '依入學學年找出適用的規則包；學籍與入學學年對不上時，整案轉人工處理。' },
  { step: '03', title: '公告衝突處理', desc: '偵測新公告與規則包是否衝突。判斷公告是否適用時，先過注入檢查，再交給模型；無法判定的列為待確認，該項不計入。' },
  { step: '04', title: '確定性審查', desc: '把每門課指派到學分類別（指派問題），計算各類學分；不變式失敗即中止。' },
  { step: '05', title: '原文引用回查', desc: '逐條比對結論與規定原文，失敗兩次的條目降級為待確認。' },
  { step: '06', title: '開課搜尋與排課', desc: '從開課資料中以分支定界求解選課組合；無解時找出衝突條件、放寬後重試。' },
]

const evals = [
  { item: '審查 golden set（35 案）', result: '正確率 100%、錯答 0' },
  { item: '真實成績單 10 個時間點', result: '本系統 10/10、平均 1.3 秒、不呼叫模型；同一模型直接算 20 次只答對 9 次、同題兩次一致僅 3/10' },
  { item: '對話理解（78 句）', result: '只用規則 69/78；接上模型 78/78' },
  { item: '模型故障（連不上、逾時）', result: '自動退回規則，審查仍零錯答' },
  { item: '提示注入', result: '惡意 16 則攔截 100%、正常 9 則誤攔 0%' },
  { item: '正式站對話 100 輪', result: '失敗 0，P50 2.75 秒、P95 5.90 秒，每輪約 US$0.0005' },
]

const tech = [
  { label: '前端 / API', value: 'Next.js 15 · TypeScript' },
  { label: '資料庫', value: 'Supabase（trace、規則包、開課資料）' },
  { label: '模型', value: 'Claude Haiku（可換 OpenAI 相容端點）' },
  { label: '求解', value: '分支定界選課求解器' },
  { label: '資料管線', value: 'Python：PDF 分段、開課資料抓取' },
  { label: '部署', value: 'Vercel' },
]

const limits = [
  '真實規則目前以一個學系、一個入學年度為主；雙主修、輔系、學程只收錄部分，沒收錄的會明講。',
  '提前畢業若距目標學期還有多個學期，只估算學分是否排得進，不逐學期排課。',
  '不代為選課、不寫回校務系統、不儲存帳密；畢業資格一律標示為參考。',
]

export default function AiditDetail({ project, mobile }: { project: Project; mobile: boolean }) {
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(59,91,219,0.2)' }}>LLM Agent</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.25em 0.9em', borderRadius: '99px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>獨立開發 · 已上線</span>
          </div>
        </R>
        <R delay={100}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? '1.9rem' : 'clamp(2rem,3.8vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.1rem' }}>{project.subtitle} · {project.period}</p>
        </R>
        <R delay={150}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.tags as readonly string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <LinkBtn href={DEMO_URL} label="線上展示" icon={<ExtIcon />} />
              <LinkBtn href={GITHUB_URL} label="GitHub" icon={<GhIcon />} />
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
          <R delay={60}>
            <blockquote style={{ margin: '0 0 1.25rem', padding: '1rem 1.4rem', borderLeft: '3px solid var(--accent)', background: 'var(--accent-light)', borderRadius: '0 8px 8px 0', fontFamily: 'var(--font-display)', fontSize: mobile ? '1rem' : '1.08rem', fontWeight: 600, color: 'var(--text)' }}>
              在畢業審查場域，答錯的代價遠高於不答。
            </blockquote>
          </R>
          <R delay={100}><p style={para}>{project.description}</p></R>
          <R delay={140}><p style={{ ...para, marginTop: '1rem' }}>直接把成績單丟給 LLM 算學分，看起來很聰明，但同一題問兩次常常得到不同答案，也說不出依據是哪一條規定。Aidit 把「理解」和「計算」拆開：模型只負責聽懂你想問什麼，數字全由可驗證的程式算出，並且每一個結論都能回查到規定原文。</p></R>
        </div>

        {/* 首頁截圖 */}
        <div style={sec}>
          <R>
            <img src={`${IMG}/home.png`} alt="Aidit 審查結果首頁" style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'block' }} />
          </R>
        </div>

        {/* 功能 */}
        <div style={sec}>
          <R><h2 style={secTitle}>功能</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '1.8rem' : '2rem 2.5rem', marginTop: '0.5rem' }}>
            {features.map((f, i) => (
              <R key={f.title} delay={50 + i * 60}>
                <div>
                  <img src={f.image} alt={f.title} loading="lazy" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)', display: 'block', marginBottom: '0.85rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.45rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.85 }}>{f.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* 怎麼保證不亂算 */}
        <div style={sec}>
          <R><h2 style={secTitle}>怎麼保證不亂算</h2></R>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '1.6rem' : '1.6rem 2.5rem', marginTop: '0.5rem' }}>
            {principles.map((p, i) => (
              <R key={p.title} delay={50 + i * 60}>
                <div style={{ position: 'relative', paddingTop: '1.6rem' }}>
                  <span style={{ position: 'absolute', top: '0', right: '0', fontFamily: 'var(--font-mono)', fontSize: '3.4rem', fontWeight: 700, color: 'var(--accent)', opacity: 0.09, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.55rem', position: 'relative' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.85, position: 'relative' }}>{p.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>

        {/* Agent 流程 */}
        <div style={sec}>
          <R><h2 style={secTitle}>Agent 流程</h2></R>
          <R delay={40}><p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>沒有引入 agent 框架：流程有限且已知，一個 step runner 加狀態機就夠，trace 格式也要自己掌控。</p></R>
          <div>
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

        {/* 評測 */}
        <div style={sec}>
          <R><h2 style={secTitle}>評測</h2></R>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {evals.map((e, i) => (
              <R key={e.item} delay={40 + i * 50}>
                <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '0.3rem' : '1.25rem', padding: '0.9rem 1.2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', flexShrink: 0, minWidth: mobile ? 0 : '13rem' }}>{e.item}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{e.result}</span>
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

        {/* 已知限制 */}
        <div style={sec}>
          <R><h2 style={secTitle}>範圍與限制</h2></R>
          {limits.map((l, i) => (
            <R key={l} delay={40 + i * 50}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.75rem', marginTop: '0.35rem' }}>▸</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.8 }}>{l}</span>
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
