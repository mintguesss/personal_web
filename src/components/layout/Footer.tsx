// src/components/layout/Footer.tsx
import { siteData } from '@/data/portfolio'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)', padding: '2rem 0',
      textAlign: 'center', fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem', color: 'var(--muted)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        © {new Date().getFullYear()} {siteData.name} ({siteData.nameEn}) · Built with Next.js
      </div>
    </footer>
  )
}
