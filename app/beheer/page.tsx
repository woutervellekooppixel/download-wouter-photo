'use client';

import { useEffect, useState } from 'react';

type DownloadEntry = {
  title: string;
  downloadUrl: string;
  heroImage?: string;
};

export default function BeheerPage() {
  const [downloads, setDownloads] = useState<Record<string, DownloadEntry>>({});
  const [slugEdits, setSlugEdits] = useState<Record<string, string>>({});
  const [newEntry, setNewEntry] = useState({ slug: '', title: '', downloadUrl: '', heroImage: '' });
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://download.wouter.photo";

  useEffect(() => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(setDownloads)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (originalSlug: string, entry: DownloadEntry) => {
    const newSlug = slugEdits[originalSlug] ?? originalSlug;

    if (newSlug !== originalSlug) {
      // 1. Voeg toe onder nieuwe slug
      const addRes = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug, ...entry }),
      });

      if (!addRes.ok) {
        const err = await addRes.json();
        alert("Fout bij toevoegen nieuwe slug: " + err.error);
        return;
      }

      // 2. Verwijder oude slug
      await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: originalSlug }),
      });

      // 3. Update lokale state
      const updated = { ...downloads };
      delete updated[originalSlug];
      updated[newSlug] = entry;
      setDownloads(updated);

      setSlugEdits(prev => {
        const copy = { ...prev };
        delete copy[originalSlug];
        return copy;
      });

      alert('Slug aangepast en opgeslagen!');
    } else {
      // Gewone update
      await fetch('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: originalSlug, ...entry }),
      });

      alert('Bijgewerkt!');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Verwijder ${slug}?`)) return;

    await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const updated = { ...downloads };
    delete updated[slug];
    setDownloads(updated);
  };

  const handleAdd = async () => {
    if (!newEntry.slug.trim()) return alert("Slug is verplicht");

    const res = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Fout: " + err.error);
      return;
    }

    setDownloads({
      ...downloads,
      [newEntry.slug]: {
        title: newEntry.title,
        downloadUrl: newEntry.downloadUrl,
        heroImage: newEntry.heroImage,
      },
    });

    setNewEntry({ slug: '', title: '', downloadUrl: '', heroImage: '' });
  };

  if (loading) return <p className="p-4">Laden...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Downloads beheren</h1>

      {/* Bestaande downloads */}
      <ul className="space-y-6">
        {Object.entries(downloads).map(([slug, entry]) => (
          <li key={slug} className="border p-4 rounded bg-black shadow space-y-2">
            <input
              value={slugEdits[slug] ?? slug}
              onChange={e => setSlugEdits(prev => ({ ...prev, [slug]: e.target.value }))}
              placeholder="Slug"
              className="border p-2 w-full bg-black"
            />
            <input
              value={entry.title}
              onChange={e => setDownloads({ ...downloads, [slug]: { ...entry, title: e.target.value } })}
              placeholder="Titel"
              className="border p-2 w-full bg-black"
            />
            <input
              value={entry.downloadUrl}
              onChange={e => setDownloads({ ...downloads, [slug]: { ...entry, downloadUrl: e.target.value } })}
              placeholder="Download URL"
              className="border p-2 w-full bg-black"
            />
            <input
              value={entry.heroImage || ''}
              onChange={e => setDownloads({ ...downloads, [slug]: { ...entry, heroImage: e.target.value } })}
              placeholder="Hero image URL (optioneel)"
              className="border p-2 w-full bg-black"
            />

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleUpdate(slug, entry)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Opslaan
              </button>
              <button
                onClick={() => handleDelete(slug)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Verwijder
              </button>
              <a
                href={`${BASE_URL}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline self-center"
              >
                Bekijk pagina →
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* Nieuwe toevoegen */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Nieuwe download toevoegen</h2>
        <div className="grid gap-4">
          <input
            value={newEntry.slug}
            onChange={e => setNewEntry({ ...newEntry, slug: e.target.value })}
            placeholder="Unieke slug (bijv. nsj2025)"
            className="border p-2 w-full bg-black"
          />
          <input
            value={newEntry.title}
            onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
            placeholder="Titel"
            className="border p-2 w-full bg-black"
          />
          <input
            value={newEntry.downloadUrl}
            onChange={e => setNewEntry({ ...newEntry, downloadUrl: e.target.value })}
            placeholder="Download URL"
            className="border p-2 w-full bg-black"
          />
          <input
            value={newEntry.heroImage}
            onChange={e => setNewEntry({ ...newEntry, heroImage: e.target.value })}
            placeholder="Hero image URL (optioneel)"
            className="border p-2 w-full bg-black"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded w-fit"
          >
            Toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}