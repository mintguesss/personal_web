import type { Metadata } from 'next'
import { siteData } from '@/data/portfolio'
export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div style={{ paddingTop:'64px', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr' }}>
        <div style={{ borderRight:'1px solid var(--border)', padding:'clamp(4rem,8vw,8rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--accent)', textTransform:'uppercase', marginBottom:'2rem' }}>Get In Touch</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:300, lineHeight:1.1, marginBottom:'2rem' }}>
            {"Let's work"}<br /><em style={{ fontStyle:'italic', color:'var(--muted)' }}>together.</em>
          </h1>
          <p style={{ fontSize:'0.95rem', color:'var(--text-2)', lineHeight:1.85, maxWidth:'400px', marginBottom:'3rem' }}>
            歡迎研究合作、實習機會或任何交流。不管是技術問題、專案合作還是單純打招呼，都很歡迎寫信。
          </p>
          <a href={'mailto:'+siteData.email} style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.1rem,2.5vw,1.6rem)', fontWeight:300, color:'var(--accent)', borderBottom:'1px solid var(--accent)', paddingBottom:'4px', display:'inline-block' }}>{siteData.email}</a>
        </div>
        <div style={{ padding:'clamp(4rem,8vw,8rem) clamp(2rem,5vw,5rem)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          {[
            { label:'Phone', value:siteData.phone, href:'tel:'+siteData.phone },
            { label:'Location', value:siteData.location, href:'' },
            { label:'Institution', value:siteData.institution+' '+siteData.title, href:'' },
            ...(siteData.links.github ? [{ label:'GitHub', value:siteData.links.github, href:siteData.links.github }] : []),
          ].map(({ label, value, href }) => (
            <div key={label} style={{ padding:'2rem 0', borderBottom:'1px solid var(--border)', display:'grid', gridTemplateColumns:'110px 1fr', gap:'2rem', alignItems:'center' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', textTransform:'uppercase' }}>{label}</span>
              {href ? <a href={href} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{ fontSize:'0.95rem', color:'var(--text)' }}>{value}</a> : <span style={{ fontSize:'0.95rem' }}>{value}</span>}
            </div>
          ))}
          <div style={{ paddingTop:'3rem' }}>
            <a href={'mailto:'+siteData.email} style={{ display:'inline-flex', alignItems:'center', fontFamily:'var(--font-mono)', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.85em 2em', background:'var(--accent)', color:'#fff', borderRadius:'2px' }}>Send Email</a>
          </div>
        </div>
      </div>
    </div>
  )
}
