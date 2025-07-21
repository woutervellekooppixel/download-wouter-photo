import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import UploadForm from "@/components/UploadForm";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";

type DownloadEntry = {
  title: string;
  client: string;
  date: string;
  originalUrl: string;
  heroImage?: string;
};

export default function BeheerPage() {
  const filePath = path.join(process.cwd(), "public", "data.json");
  if (!fs.existsSync(filePath)) return notFound();

  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData) as Record<string, DownloadEntry>;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">📦 Download Beheer</h1>

      {/* Upload formulier */}
      <UploadForm />

      {/* Bestaande downloads */}
      <h2 className="text-xl font-semibold mt-10 mb-4">📁 Bestaande downloads</h2>
      <ul className="space-y-4">
        {Object.entries(data).map(([slug, entry]) => (
          <li key={slug} className="border border-gray-700 rounded p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-lg">{entry.title}</p>
                <p className="text-sm text-gray-400">{entry.client} – {entry.date}</p>
              </div>
              <div className="mt-2 md:mt-0 flex gap-4">
                <a
                  href={`/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Bekijk
                </a>
                <a
                  href={transformToDirectLink(entry.originalUrl)}
                  className="text-green-400 underline"
                >
                  Download ZIP
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}