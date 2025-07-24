'use client';
import { useState } from "react";

export default function BeheerPage() {
  const [status, setStatus] = useState("Wachtend op upload...");

  async function handleFolderUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setStatus("❌ Geen bestanden geselecteerd.");
      return;
    }

    // Groepeer bestanden op rootmap
    const grouped: Record<string, File[]> = {};
    for (const file of Array.from(files)) {
      const parts = file.webkitRelativePath.split("/");
      const rootFolder = parts[0];
      if (!grouped[rootFolder]) grouped[rootFolder] = [];
      grouped[rootFolder].push(file);
    }

    for (const folderName in grouped) {
      const folderFiles = grouped[folderName];
      const zip = folderFiles.find(f => f.name.endsWith(".zip"));
      const hero = folderFiles.find(f =>
        f.name.toLowerCase().endsWith(".jpg") || f.name.toLowerCase().endsWith(".jpeg")
      );
      const images = folderFiles.filter(f =>
        f.type.startsWith("image/") && f !== hero
      );

      if (!zip || !hero) {
        setStatus(`❌ Map "${folderName}" mist zip of hero-afbeelding.`);
        continue;
      }

      const formData = new FormData();
      formData.append("slug", folderName);
      formData.append("zip", zip);
      formData.append("hero", hero);
      images.forEach((img) => formData.append("images", img));

      setStatus(`⏫ Uploaden: ${folderName}...`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      try {
        const result = await res.json();
        setStatus(result.success ? `✅ ${folderName} geüpload!` : `❌ ${result.error}`);
      } catch {
        setStatus("❌ Upload mislukt – geen geldige JSON ontvangen.");
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Beheerpagina</h1>

      <input
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFolderUpload}
        className="mb-4"
      />

      <p className="text-sm text-gray-600 mb-8">{status}</p>

      <div className="border-t pt-6 mt-6">
        <h2 className="font-semibold mb-2">Bestaande downloads:</h2>
        <ul className="list-disc pl-4 text-sm text-gray-700">
          <li><a href="/nsj" className="text-blue-500 underline">/nsj</a></li>
          <li><a href="/nsj2" className="text-blue-500 underline">/nsj2</a></li>
          {/* Later: dynamisch uit data.json */}
        </ul>
      </div>
    </div>
  );
}