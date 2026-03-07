// src/app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'
import { siteData } from '@/data/portfolio'

export const metadata: Metadata = {
  title: `${siteData.name} | Portfolio`,
  description: `${siteData.institution}${siteData.title}，專注於 NLP、詐騙偵測與全端開發。`,
  openGraph: {
    title: `${siteData.name} (${siteData.nameEn})`,
    description: siteData.tagline,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
