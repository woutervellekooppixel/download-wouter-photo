'use client';

import { useEffect, useState } from 'react';

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
};

export default function BeheerPage() {
  const [downloads, setDownloads] = useState<Record<string, DownloadInfo>>({});
  const [form, setForm] = useState({
    slug: '',
    title: '',
    client: '',
    date: '',
    downloadUrl: '',
    heroImage: '',
  });

  useEffect(() => {
    fetch('/data/data.json')
      .then((res) => res.json())
      .then(setDownloads);
  }, []);

  const handleAdd = async () => {
    await fetch('/api/downloads', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    location.reload(); // of: fetch opnieuw
  };

  const handleDelete = async (slug: string) => {
    await fetch(`/api/downloads/${slug}`, {
      method: 'DELETE',
    });
    location.reload();
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Beheer Downloads</h1>

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
          placeholder="client"
          value={form.client}
          onChange={(e) => setForm({ ...form, client: e.target.value })}
        />
        <input
          className="block w-full p-2 bg-gray-800 rounded"
          placeholder="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
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
