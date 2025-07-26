'use client'

import { useEffect, useState } from 'react'

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

  // ✅ Tijdelijk hardcoded — later vervangen door process.env.NEXT_PUBLIC_JSON_URL
  const JSON_URL = '/api/get-json'
  console.log('🌍 JSON_URL die gebruikt wordt:', JSON_URL)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(JSON_URL)
        const json = await res.json()
        console.log('📦 Gelezen JSON:', json)
        setDownloads(json)
      } catch (e) {
        console.error('⚠️ Fout bij laden JSON:', e)
        setError('⚠️ Kan huidige downloads niet laden.')
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

      if (!result.success) {
        throw new Error(result.error || 'Onbekende fout')
      }

      setSuccess(true)
    } catch (e: any) {
      setError('❌ Fout bij opslaan: ' + e.message)
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

      alert(`✅ ${slug} opnieuw gegenereerd: data.json + gallery.json`)
      setSuccess(true)
    } catch (e: any) {
      setError('❌ Fout bij hergenereren: ' + e.message)
    } finally {
      setRegenerating(false)
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

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">📁 Beheerpagina</h1>

      {loading && <p>Laden...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500 mb-4">✅ data.json succesvol bijgewerkt!</p>}

      <div className="flex gap-4 flex-wrap mb-6">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
        >
          {saving ? 'Bezig met opslaan...' : '📤 Update JSON'}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          {regenerating ? 'Bezig met hergenereren...' : '🔁 Herbouw download + gallery'}
        </button>
      </div>

      {!loading && Object.keys(downloads).length === 0 && (
        <p>❌ Geen downloads gevonden.</p>
      )}

      <ul className="space-y-4">
        {Object.entries(downloads).map(([slug, entry]) => (
          <li key={slug} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(slug, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 text-lg font-medium focus:outline-none"
                />
                <div className="text-sm text-white/50 mt-1">{slug}</div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!entry.hasGallery}
                  onChange={(e) => updateEntry(slug, 'hasGallery', e.target.checked)}
                />
                Gallery tonen
              </label>

              <a
                href={`/${slug}`}
                target="_blank"
                className="text-sm underline text-blue-400 hover:text-blue-200"
              >
                🔗 Bekijk
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}