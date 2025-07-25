import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import DownloadCard from '@/components/DownloadCard'
import { transformToDirectLink } from '@/scripts/transformToDirectLink'
import type { JSX } from 'react'

type DownloadInfo = {
  title: string
  downloadUrl: string
  heroImage?: string
  hasGallery?: boolean
}

type PageProps = {
  params: { slug: string }
}

const JSON_URL = process.env.NEXT_PUBLIC_JSON_URL || 'https://downloads-wouter-photo.r2.dev/data.json'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const res = await fetch(JSON_URL, { next: { revalidate: 10 } }) // 10s cache
  const data: Record<string, DownloadInfo> = await res.json()
  const download = data[params.slug]

  return {
    title: download ? `${download.title} | downloads.wouter.photo` : 'downloads.wouter.photo',
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(JSON_URL, { next: { revalidate: 10 } })
  const data: Record<string, DownloadInfo> = await res.json()

  return Object.keys(data).map((slug) => ({ slug }))
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const res = await fetch(JSON_URL, { next: { revalidate: 10 } })
  const data: Record<string, DownloadInfo> = await res.json()
  const download = data[params.slug]

  if (!download) {
    redirect('https://wouter.photo')
  }

  const { title, downloadUrl, heroImage } = download
  const transformedUrl = transformToDirectLink(downloadUrl)
  const heroImageUrl = heroImage ? transformToDirectLink(heroImage) : '/hero.jpg'

  return (
    <div className="bg-black text-white h-screen overflow-hidden">
      <Header />

      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <DownloadCard title={title} downloadUrl={transformedUrl} />
        </div>
      </div>
    </div>
  )
}