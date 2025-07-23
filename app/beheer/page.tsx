'use client';

import { useEffect, useState } from 'react';

type DownloadInfo = {
  title: string;
  client?: string;
  date?: string;
  downloadUrl: string;
  heroImage?: string;
};

export default function BeheerPage() {
  const [downloads, setDownloads] = useState<Record<string, DownloadInfo>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data.json');
        const json = await res.json();
        setDownloads(json);
      } catch (err) {
        setMessage('❌ Kon data.json niet laden.');
      }
    };
    fetchData();
  }, []);

const handleUpdateJson = async () => {
  setLoading(true);
  setMessage(null);
  try {
    const username = process.env.NEXT_PUBLIC_LOGIN_USERNAME || 'admin';
    const password = process.env.NEXT_PUBLIC_LOGIN_PASSWORD || 'geheim';

    const res = await fetch('/api/update-json', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      },
    });

    if (!res.ok) throw new Error('Update mislukt');
    const result = await res.json();
    setMessage(result.message || '✅ data.json succesvol bijgewerkt');
    location.reload();
  } catch (err) {
    setMessage('❌ Fout bij bijwerken van data.json');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📁 Downloads beheren</h1>

      <button
        onClick={handleUpdateJson}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        {loading ? 'Bezig met bijwerken…' : '🔄 Update data.json'}
      </button>

      {message && (
        <p className="mt-4 text-sm text-yellow-300">
          {message}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {Object.entries(downloads).map(([slug, info]) => (
          <div key={slug} className="border border-white/20 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">{info.title}</h2>

            <div className="mb-2">
              <label className="text-sm block mb-1">🔗 Downloadpagina</label>
              <input
                type="text"
                readOnly
                value={`https://download.wouter.photo/${slug}`}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-1 text-sm font-mono text-white"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>

            {info.client && <p className="text-sm text-gray-400">👤 Klant: {info.client}</p>}
            {info.date && <p className="text-sm text-gray-400">📅 Datum: {info.date}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}