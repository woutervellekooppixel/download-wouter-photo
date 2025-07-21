// components/UploadForm.tsx
"use client";

import { useState } from "react";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    setStatus("Uploaden...");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload-r2", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("✔️ Upload gelukt!");
    } else {
      setStatus("❌ Upload mislukt.");
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed p-6 rounded-lg text-center bg-gray-800 text-white mb-6"
    >
      <p>Sleep hier je ZIP + hero.jpg</p>
      {files.length > 0 && (
        <div className="mt-2 text-sm">
          {files.map((file) => (
            <p key={file.name}>{file.name}</p>
          ))}
        </div>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Upload
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}