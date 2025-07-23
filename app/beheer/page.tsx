// app/beheer/page.tsx

"use client";

import { useEffect, useState } from "react";

type DownloadEntry = {
  slug: string;
  title: string;
  downloadUrl: string;
  heroImage: string;
};

export default function BeheerPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);

  const handleUpdate = async () => {
    setLoading(true);
    setStatus("⏳ Bezig met bijwerken...");

    try {
      const res = await fetch("/api/update-json", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setStatus("✅ data.json succesvol bijgewerkt!");
        fetchDownloads(); // direct opnieuw ophalen
      } else {
        setStatus("❌ Fout: " + (data.error || "onbekend probleem"));
      }
    } catch (err: any) {
      setStatus("❌ Netwerkfout of server error");
    }

    setLoading(false);
  };

  const fetchDownloads = async () => {
    try {
      const res = await fetch("/data.json");
      const data = await res.json();

      const formatted: DownloadEntry[] = Object.entries(data).map(
        ([slug, entry]: [string, any]) => ({
          slug,
          title: entry.title,
          downloadUrl: entry.downloadUrl,
          heroImage: entry.heroImage,
        })
      );

      setDownloads(formatted);
    } catch (error) {
      console.error("Fout bij ophalen van data.json", error);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Beheerpagina</h1>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Bijwerken..." : "Update data.json"}
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-2">Beschikbare pagina's</h2>
      <ul className="list-disc list-inside space-y-1">
        {downloads.map((entry) => (
          <li key={entry.slug}>
            <a
              href={`/${entry.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {entry.slug} – {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}