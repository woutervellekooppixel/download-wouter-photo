"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function BeheerPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateJson = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/update-json");
      if (!res.ok) throw new Error("Fout bij het updaten van data.json");

      const data = await res.json();
      setStatus(`✅ Geüpdatet met ${Object.keys(data).length} items.`);
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-xl mx-auto py-16 px-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Download beheer</h1>

        <button
          onClick={updateJson}
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Bezig met bijwerken..." : "Update downloadlijst"}
        </button>

        {status && <p className="mt-6 text-lg">{status}</p>}

        <p className="mt-12 text-sm text-gray-400">
          Elke map in R2 met een .zip + .jpg wordt automatisch herkend. De mapnaam wordt gebruikt als slug en titel.
        </p>
      </main>
    </div>
  );
}