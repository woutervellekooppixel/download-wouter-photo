import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import DownloadCard from '@/components/DownloadCard'
import GallerySection from '@/components/GallerySection'
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

const DATA_URL = 'https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/data.json'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const res = await fetch(DATA_URL, { next: { revalidate: 10 } })
  const data: Record<string, DownloadInfo> = await res.json()
  const download = data[params.slug]

  return {
    title: download ? `${download.title} | downloads.wouter.photo` : 'downloads.wouter.photo',
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(DATA_URL, { next: { revalidate: 10 } })
  const data: Record<string, DownloadInfo> = await res.json()
  return Object.keys(data).map((slug) => ({ slug }))
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const res = await fetch(DATA_URL, { next: { revalidate: 10 } })
  const data: Record<string, DownloadInfo> = await res.json()
  const download = data[params.slug]

  if (!download) {
    redirect('https://wouter.photo')
  }

  const { title, downloadUrl, heroImage, hasGallery } = download
  const transformedUrl = transformToDirectLink(downloadUrl)
  const heroImageUrl = heroImage ? transformToDirectLink(heroImage) : '/hero.jpg'

  // ⬇️ Optioneel: galerie ophalen
  let galleryData: Record<string, string[]> = {}
  if (hasGallery) {
    const galleryRes = await fetch(
      `https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/photos/${params.slug}/gallery.json`,
      { next: { revalidate: 10 } }
    )

    if (galleryRes.ok) {
      galleryData = await galleryRes.json()
    }
  }

const hasGalleryContent = hasGallery && Object.keys(galleryData).length > 0

return (
  <div className={`bg-white dark:bg-black text-black dark:text-white transition-colors ${hasGalleryContent ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      <Header />

      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 z-0 transition-colors" />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <DownloadCard title={title} downloadUrl={transformedUrl} />
        </div>
      </div>

      {/* ✅ GALLERY */}
      {hasGallery && Object.keys(galleryData).length > 0 && (
        <div className="px-5 md:px-16 xl:px-60 py-12 bg-white dark:bg-black transition-colors">
          {Object.entries(galleryData).map(([section, urls]) => (
            <GallerySection
              key={section}
              sectionTitle={section}
              images={urls}
            />
          ))}
        </div>
      )}
    </div>
  )
}