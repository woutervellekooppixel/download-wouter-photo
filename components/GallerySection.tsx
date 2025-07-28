'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { FaChevronDown } from 'react-icons/fa'
import { useState } from 'react'

type Props = {
  sectionTitle: string
  images: string[]
}

export default function GallerySection({ sectionTitle, images }: Props) {
  return (
    <div className="my-10">
      <h2 className="font-light text-xl mb-6 tracking-widest uppercase text-gray-400">
        {sectionTitle.replaceAll('_', ' ')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5">
        {images.map((url, i) => {
          const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })
          const [loaded, setLoaded] = useState(false)

          return (
            <div
              key={i}
              className="relative group rounded-xl shadow-md overflow-hidden bg-gray-900"
              ref={ref}
            >
              {inView && (
                <>
                  <Image
                    src={url}
                    alt={`Image ${i + 1}`}
                    width={800}
                    height={600}
                    className={`w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105
                      ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
                    onLoadingComplete={() => setLoaded(true)}
                  />

                  {/* Subtiele ronde download-knop gecentreerd */}
                  <a
                    href={`/api/download?file=${encodeURIComponent(url)}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Download afbeelding"
                  >
                    <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 border border-white/30 backdrop-blur-md shadow hover:bg-blue-500/80 hover:text-white transition-all duration-300">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping pointer-events-none" />
                      <FaChevronDown className="relative z-10 text-white text-xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
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
