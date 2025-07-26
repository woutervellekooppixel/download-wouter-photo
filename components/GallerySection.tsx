'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { useInView } from 'react-intersection-observer'

type Props = {
  sectionTitle: string
  images: string[]
}

export default function GallerySection({ sectionTitle, images }: Props) {
  const [index, setIndex] = useState(-1)

  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold mb-4">{sectionTitle}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="rounded-lg w-full h-auto object-cover cursor-zoom-in"
                    onClick={() => setIndex(i)}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
                  />

                  <a
  href={url}
  download
  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-2 py-1 text-xs rounded"
  title="Download afbeelding"
>
  ⬇
</a>
                </>
              )}
            </div>
          )
        })}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images.map((url) => ({ src: url }))}
        index={index}
        plugins={[Download]}
      />
    </div>
  )
}