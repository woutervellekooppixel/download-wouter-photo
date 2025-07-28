'use client'

import { useEffect, useState } from 'react'
import FolderUploader from '@/components/FolderUploader'
import toast, { Toaster } from 'react-hot-toast'

type DownloadEntry = {
  title: string
  downloadUrl: string
  heroImage: string
  hasGallery?: boolean
}

export default function BeheerPage() {
  const [downloads, setDownloads] = useState<Record<string, DownloadEntry>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const JSON_URL = `/api/get-json?cb=${Date.now()}`
        const res = await fetch(JSON_URL)
        const json = await res.json()
        setDownloads(json)
      } catch (e) {
        setError('⚠️ Kan huidige downloads niet laden.')
        toast.error('⚠️ Kan huidige downloads niet laden.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const updateEntry = (slug: string, field: keyof DownloadEntry, value: any) => {
    setDownloads(prev => {
      const updated = {
        ...prev,
        [slug]: {
          ...prev[slug],
          [field]: value,
        },
      }

      fetch('/api/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
        .then(res => res.json())
        .then(result => {
          if (!result.success) throw new Error(result.error || 'Onbekende fout')
          toast.success('✅ JSON bijgewerkt!')
          if (field === 'hasGallery' && value) {
            fetch('/api/regenerate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug }),
            }).then(() => toast.success('✅ Gallery opnieuw gegenereerd!'))
          }
        })
        .catch(e => {
          toast.error('❌ Fout bij opslaan: ' + e.message)
        })

      return updated
    })
  }

  // Verwijderen
  const handleDelete = (slug: string) => setDeleteSlug(slug)
  const confirmDelete = async () => {
    if (!deleteSlug) return
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: deleteSlug }),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error || 'Onbekende fout')
      const updated = { ...downloads }
      delete updated[deleteSlug]
      setDownloads(updated)
      toast.success('✅ Verwijderd!')
    } catch (e: any) {
      toast.error('❌ Verwijderen mislukt: ' + e.message)
    } finally {
      setDeleteSlug(null)
    }
  }

  return (
    <div className="min-h-screen text-white p-6 max-w-5xl mx-auto relative transition-colors duration-300">
      <Toaster position="top-center" />

      {/* Upload bovenaan */}
      <FolderUploader />

      {/* Downloads onderaan */}
      {loading && <p>Laden...</p>}
      {!loading && Object.keys(downloads).length === 0 && (
        <p>❌ Geen downloads gevonden.</p>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 mt-8">
        {Object.entries(downloads).map(([slug, entry]) => (
          <li
            key={slug}
            className="bg-gray-900/80 text-white rounded-2xl p-6 border border-gray-800 shadow transition-transform hover:scale-[1.01] flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={entry.heroImage}
                alt=""
                className="w-20 h-20 object-cover rounded-xl border border-gray-800 shadow"
              />
              <div>
                <div
                  className="inline-block bg-gray-800/70 text-xs px-3 py-1 rounded-full font-mono mb-2 cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => {navigator.clipboard.writeText(slug); toast.success('Slug gekopieerd!')}}
                  title="Klik om te kopiëren"
                >
                  {slug}
                </div>
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(slug, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 text-lg font-medium focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center mt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <span>Gallery tonen</span>
                <div className="relative w-10 h-6">
                  <input
                    type="checkbox"
                    checked={!!entry.hasGallery}
                    onChange={(e) => updateEntry(slug, 'hasGallery', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-10 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-400 transition-colors duration-300" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 pointer-events-none" />
                </div>
              </label>
              <a
                href={entry.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
                title="Downloadlink openen"
              >
                <span>⬇</span> Download
              </a>
              <a
                href={`/${slug}`}
                target="_blank"
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
              >
                🔗 Bekijk
              </a>
              <button
                onClick={() => handleDelete(slug)}
                className="flex items-center gap-1 text-sm text-white hover:opacity-70 transition"
                title="Verwijder"
              >
                <span style={{fontSize: '1.2em', lineHeight: 1}}>✕</span>
                Verwijder
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal voor verwijderen */}
      {deleteSlug && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-8 shadow-2xl max-w-xs w-full">
            <h2 className="font-bold text-lg mb-4">Verwijderen?</h2>
            <p className="mb-6">Weet je zeker dat je <span className="font-mono bg-gray-100 px-2 py-1 rounded">{deleteSlug}</span> wilt verwijderen?</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteSlug(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >Annuleer</button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >Verwijder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}