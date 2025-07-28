'use client'

import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import MobileMenu from '../components/MobileMenu'

const MotionSpan = motion.span

const suffixes = ['PHOTO', 'CONCERTS', 'EVENTS', 'MISC', 'DOWNLOAD']
const intervals = [800, 800, 800, 800, 800] // EVENTS blijft langer zichtbaar

export default function Header() {
  const [current, setCurrent] = useState(0)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (locked) return
    if (current === suffixes.length - 1) {
      setLocked(true)
      return
    }
    const timer = setTimeout(() => setCurrent((c) => c + 1), intervals[current])
    return () => clearTimeout(timer)
  }, [current, locked])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/portfolio" className="text-xl tracking-tight text-black flex items-baseline gap-0">
        <span className="font-extrabold">WOUTER</span>
        <AnimatePresence mode="wait">
          <MotionSpan
            key={suffixes[current]}
            className="font-light inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            .{suffixes[current]}
          </MotionSpan>
        </AnimatePresence>
      </Link>

      <nav className="hidden sm:flex items-center space-x-6 text-sm text-black">
        <Link href="https://www.wouter.photo" className="hover:text-gray-600">Portfolio</Link>
        <Link href="https://www.wouter.photo/about" className="hover:text-gray-600">About</Link>
        <a href="https://instagram.com/woutervellekoop" target="_blank" className="hover:text-gray-600"><FaInstagram size={16} /></a>
        <a href="https://linkedin.com/in/woutervellekoop" target="_blank" className="hover:text-gray-600"><FaLinkedin size={16} /></a>
        <a href="mailto:hello@wouter.photo" className="hover:text-gray-600"><FaEnvelope size={16} /></a>
      </nav>

      <div className="sm:hidden">
        <MobileMenu />
      </div>
    </header>
  )
}