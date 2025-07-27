'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

type Props = {
  sectionTitle: string
  images: string[]
}

export default function GallerySection({ sectionTitle, images }: Props) {
  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold mb-4">{sectionTitle}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {images.map((url, i) => {
          const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })

          return (
            <div key={i} className="relative group" ref={ref}>
              {inView && (
                <>
                  <Image
                    src={url}
                    alt={`Image ${i + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
                  />

                  <a
                    href={`/api/download?file=${encodeURIComponent(url)}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Download afbeelding"
                  >
                    <span className="bg-black/70 text-white text-2xl px-4 py-2 rounded-full">
                      ⬇
                    </span>
                  </a>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
