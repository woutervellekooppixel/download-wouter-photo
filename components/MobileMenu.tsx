'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { X, Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} className="text-black dark:text-white transition-colors">
        <Menu size={24} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center space-y-8 text-xl text-black dark:text-white animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-black dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center space-y-2">
              <Link href="/portfolio" onClick={() => setOpen(false)} className="text-lg font-medium hover:opacity-70 transition-opacity">
                Portfolio
              </Link>
              <Link href="/portfolio/concerts" onClick={() => setOpen(false)} className="text-base text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                Concerts
              </Link>
              <Link href="/portfolio/events" onClick={() => setOpen(false)} className="text-base text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                Events
              </Link>
              <Link href="/portfolio/misc" onClick={() => setOpen(false)} className="text-base text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                Misc
              </Link>
            </div>
            
            <Link href="/about" onClick={() => setOpen(false)} className="hover:opacity-70 transition-opacity">About</Link>
            
            {/* Theme toggle for mobile */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-base">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            )}
            
            <div className="flex space-x-6 pt-4">
              <a href="https://instagram.com/woutervellekoop.nl" target="_blank" onClick={() => setOpen(false)} aria-label="Instagram" className="hover:opacity-70 transition-opacity">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com/in/woutervellekoop" target="_blank" onClick={() => setOpen(false)} aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
                <FaLinkedin size={20} />
              </a>
              <a href="mailto:hello@wouter.photo" onClick={() => setOpen(false)} aria-label="Email" className="hover:opacity-70 transition-opacity">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}