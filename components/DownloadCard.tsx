'use client'

import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

type Props = {
  title: string
  downloadUrl: string
}

export default function DownloadCard({ title, downloadUrl }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true)
      const hide = setTimeout(() => setShowTooltip(false), 2000)
      return () => clearTimeout(hide)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="text-center px-4">
      {/* Tooltip */}
      <div className="relative inline-block mb-6">
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 px-5 py-2 bg-white text-gray-800 text-sm rounded-xl shadow-lg z-10 whitespace-nowrap transition-opacity duration-500 ${
            showTooltip ? 'opacity-100 bounce-up' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transition: 'opacity 0.5s, transform 0.5s cubic-bezier(.22,1.5,.36,1)',
          }}
        >
          {title}.zip
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rotate-45 shadow-sm z-[-1]" />
        </div>

        {/* Grote ronde knop met ping */}
        <a
          href={downloadUrl}
          download
          className="relative w-40 h-40 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md hover:shadow-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Ping effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/20 animate-pingSlow"/>
          <FaChevronDown className="relative z-10 text-white text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>
    </div>
  )
}
