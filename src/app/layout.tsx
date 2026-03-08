// src/app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { siteData } from '@/data/portfolio'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { default: `${siteData.nameEn} | Portfolio`, template: `%s | ${siteData.nameEn}` },
  description: `${siteData.institution} ${siteData.title}，專注於 NLP、詐騙偵測與全端開發。`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
