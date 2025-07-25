'use client'

import { useEffect, useRef, useState } from 'react'

export default function FolderUploader() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ Zet webkitdirectory via JS om TypeScript build errors te vermijden
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('directory', '')
    }
  }, [])

  const handleUpload = async () => {
    if (!files) return
    const allFiles = Array.from(files)
    setUploading(true)
    setTotalFiles(allFiles.length)
    setProgress(0)

    let uploaded = 0

    for (const file of allFiles) {
      const fullPath = (file as any).webkitRelativePath

      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', fullPath)

      await fetch('/api/upload-folder', {
        method: 'POST',
        body: formData,
      })

      uploaded++
      setProgress(uploaded)
    }

    // ✅ Automatisch data.json bijwerken na upload
    await fetch('/api/update-json', { method: 'POST' })

    alert('Upload afgerond ✅')
    setUploading(false)
  }

  return (
    <div className="border rounded p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2">📂 Upload een volledige map</h2>

      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <button
        onClick={handleUpload}
        disabled={!files || uploading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Bezig met uploaden...' : 'Uploaden naar R2'}
      </button>

      {uploading && (
        <div className="mt-4 w-full">
          <div className="text-sm mb-1">
            Uploading {progress} / {totalFiles} bestanden...
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(progress / totalFiles) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}