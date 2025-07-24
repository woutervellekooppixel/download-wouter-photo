'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [zip, setZip] = useState<File | null>(null);
  const [hero, setHero] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!zip || !hero) {
      setStatus('❌ Selecteer zowel een ZIP als een hero.jpg');
      return;
    }

    const formData = new FormData();
    formData.append('zip', zip);
    formData.append('hero', hero);

    setStatus('⏳ Bezig met uploaden...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      if (res.ok) {
        setStatus('✅ Upload gelukt! Vergeet niet op "Update data.json" te klikken');
      } else {
        setStatus(`❌ Mislukt: ${text}`);
      }
    } catch (err: any) {
      setStatus(`❌ Fout: ${err.message}`);
    }
  };

  return (
    <div className="mb-10 border p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">⬆️ Upload nieuwe download</h2>

      <div className="flex flex-col gap-2 mb-2">
        <label className="font-medium">ZIP-bestand:</label>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setZip(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <label className="font-medium">Hero-afbeelding (.jpg):</label>
        <input
          type="file"
          accept=".jpg,.jpeg"
          onChange={(e) => setHero(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Upload
      </button>

      {status && <p className="mt-3">{status}</p>}
    </div>
  );
}