'use client';

import { useEffect, useState } from 'react';

type DownloadInfo = {
  title: string;
  downloadUrl: string;
  heroImage?: string;
};

export default function BeheerPage() {
  const [downloads, setDownloads] = useState<Record<string, DownloadInfo>>({});
  const [form, setForm] = useState({
    slug: '',
    title: '',
    downloadUrl: '',
    heroImage: '',
  });

  // Ophalen van bestaande downloads via API
  useEffect(() => {
    fetch('/api/downloads')
      .then((res) => res.json())
      .then((data) => {
        console.log('Downloads:', data);
        setDownloads(data);
      });
  }, []);

  // Toevoegen van nieuwe entry
  const handleAdd = async () => {
    if (!form.slug || !form.title || !form.downloadUrl) {
      alert('Vul minimaal slug, title en downloadUrl in.');
      return;
    }

    await fetch('/api/downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    location.reload(); // Of: herlaad via fetch
  };

  // Verwijderen van entry
  const handleDelete = async (slug: string) => {
    await fetch(`/api/downloads/${slug}`, {
      method: 'DELETE',
    });

    location.reload();
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Beheer Downloads</h1>

      {/* Formulier */}
      <div className="mb-8 space-y-2">
        <input
          className="block w-full p-2 bg-gray-800 rounded"
          placeholder="slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          className="block w-full p-2 bg-gray-800 rounded"
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="block w-full p-2 bg-gray-800 rounded"
          placeholder="downloadUrl"
          value={form.downloadUrl}
          onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
        />
        <input
          className="block w-full p-2 bg-gray-800 rounded"
          placeholder="heroImage (optioneel)"
          value={form.heroImage}
          onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
        />
        <button
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAdd}
        >
          ➕ Toevoegen
        </button>
      </div>

      {/* Lijst van bestaande downloads */}
      <div className="space-y-4">
        {Object.entries(downloads).map(([slug, info]) => (
          <div
            key={slug}
            className="flex justify-between items-center bg-gray-900 p-4 rounded"
          >
            <div>
              <p className="font-semibold">{info.title}</p>
              <p className="text-sm text-gray-400">{slug}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(slug)}
            >
              🗑️ Verwijder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
