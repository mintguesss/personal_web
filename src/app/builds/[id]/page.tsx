import { siteData } from '@/data/portfolio'
import BuildDetailClient from './client'

export function generateStaticParams() {
  return (siteData.builds as readonly { id: string }[]).map(b => ({ id: b.id }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BuildDetailClient id={id} />
}
