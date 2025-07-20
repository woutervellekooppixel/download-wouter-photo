import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Generated with Tailwind CSS v3',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
       <body className="bg-black text-white">
      {children}</body>
    </html>
  )
}
