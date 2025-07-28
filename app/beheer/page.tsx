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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [filter, setFilter] = useState('')
  const [dark, setDark] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null) // voor modal

  useEffect(() => {
    const loadData = async () => {
      try {
        const JSON_URL = `/api/get-json?cb=${Date.now()}`
        const res = await fetch(JSON_URL)
        const json = await res.json()
        Object.keys(json).forEach((slug) => {
          if (typeof json[slug].hasGallery !== 'boolean') {
            json[slug].hasGallery = false
          }
        })
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

  const handleUpdate = async () => {
    setSaving(true)
    setSuccess(false)
    setError(null)
    try {
      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downloads),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Onbekende fout')
      setSuccess(true)
      toast.success('✅ JSON succesvol bijgewerkt!')
    } catch (e: any) {
      setError('❌ Fout bij opslaan: ' + e.message)
      toast.error('❌ Fout bij opslaan: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerate = async () => {
    const slug = prompt('Welke slug wil je hergenereren (bv: 2024-12-28_Nick-Schilder)?')
    if (!slug) return
    setRegenerating(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json?.dataUpdated?.error || json?.galleryUpdated?.error || 'Onbekende fout')
      }
      toast.success(`✅ ${slug} opnieuw gegenereerd!`)
      setSuccess(true)
    } catch (e: any) {
      setError('❌ Fout bij hergenereren: ' + e.message)
      toast.error('❌ Fout bij hergenereren: ' + e.message)
    } finally {
      setRegenerating(false)
    }
  }

  // Modal voor verwijderen
  const handleDelete = async (slug: string) => {
    setDeleteSlug(slug)
  }
  const confirmDelete = async () => {
    if (!deleteSlug) return
    setSaving(true)
    setError(null)
    setSuccess(false)
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
      setSuccess(true)
      toast.success('✅ Verwijderd!')
    } catch (e: any) {
      setError('❌ Verwijderen mislukt: ' + e.message)
      toast.error('❌ Verwijderen mislukt: ' + e.message)
    } finally {
      setSaving(false)
      setDeleteSlug(null)
    }
  }

  const updateEntry = (slug: string, field: keyof DownloadEntry, value: any) => {
    setDownloads((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value,
      },
    }))
  }

  // Filtered downloads
  const filtered = Object.entries(downloads)
    .filter(([slug, entry]) =>
      slug.toLowerCase().includes(filter.toLowerCase()) ||
      entry.title.toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-5xl mx-auto relative transition-colors duration-300">
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold mb-8 tracking-tight">📁 Beheerpagina</h1>

      <input
        type="text"
        placeholder="Zoek op titel of slug..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-6 w-full px-4 py-2 rounded-xl bg-gray-900 border-gray-800 text-white border placeholder-gray-400 focus:outline-none"
      />

      <div className="flex gap-4 flex-wrap mb-8">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
        >
          <span>📤</span>
          {saving ? 'Bezig met opslaan...' : 'Update JSON'}
        </button>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition disabled:opacity-50"
        >
          <span>🔁</span>
          {regenerating ? 'Bezig met hergenereren...' : 'Herbouw download + gallery'}
        </button>
      </div>

      {loading && <p>Laden...</p>}
      {!loading && filtered.length === 0 && (
        <p>❌ Geen downloads gevonden.</p>
      )}

      <ul className="grid gap-6 sm:grid-cols-2">
        {filtered.map(([slug, entry]) => (
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
                <input
                  type="checkbox"
                  checked={!!entry.hasGallery}
                  onChange={(e) => updateEntry(slug, 'hasGallery', e.target.checked)}
                  className="peer sr-only"
                />
                <span className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-gray-400 relative transition-colors duration-300">
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
                </span>
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

      <div className="mt-10">
        <FolderUploader />
      </div>
    </div>
  )
}