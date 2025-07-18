'use client'

import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

type Props = {
  title: string
  slug: string
}

export default function SubtleDownloadButton({ title, slug }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
      setShowTooltip(true)

      const hideTimer = setTimeout(() => setShowTooltip(false), 2000)
      return () => clearTimeout(hideTimer)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 px-5 py-2 bg-white text-gray-800 text-sm rounded-xl shadow-lg z-10 whitespace-nowrap transition-opacity duration-500 ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rotate-45 shadow-sm z-[-1]" />
        </div>

        {/* Ronde subtiele knop */}
        <a
          href={`/api/download/${slug}`}
          className="w-40 h-40 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md hover:shadow-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <FaChevronDown className="text-white text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>
    </div>
  )
}
