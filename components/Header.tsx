'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMenu from '../components/MobileMenu'

const MotionSpan = motion.span

export default function Header() {
  const pathname = usePathname()

  const isHome = pathname === '/'
  let suffix = 'DOWNLOAD'
  if (pathname.startsWith('/concerts')) suffix = 'CONCERTS'
  else if (pathname.startsWith('/events')) suffix = 'EVENTS'
  else if (pathname.startsWith('/misc')) suffix = 'MISC'

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/portfolio" className="text-xl tracking-tight text-black flex items-baseline gap-1">
        <span className="font-extrabold">WOUTER</span>
        <AnimatePresence mode="wait">
          <MotionSpan
            key={suffix}
            className="font-light inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            .{suffix}
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