'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-black">
        <FaBars size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-white z-50 p-6">
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-black">
            <FaTimes size={24} />
          </button>
          <nav className="flex flex-col space-y-4 text-lg mt-12">
            <Link href="/concerts" onClick={() => setOpen(false)}>Concerts</Link>
            <Link href="/events" onClick={() => setOpen(false)}>Events</Link>
            <Link href="/misc" onClick={() => setOpen(false)}>Misc</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <a href="https://instagram.com/woutervellekoop" target="_blank">Instagram</a>
            <a href="https://linkedin.com/in/woutervellekoop" target="_blank">LinkedIn</a>
            <a href="mailto:hello@wouter.photo">E-mail</a>
          </nav>
        </div>
      )}
    </>
  )
}