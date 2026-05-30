import { siteData } from '@/data/portfolio'
import ProjectDetailClient from './client'

export function generateStaticParams() {
  return (siteData.projects as readonly { id: string }[]).map(p => ({ id: p.id }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProjectDetailClient id={id} />
}
