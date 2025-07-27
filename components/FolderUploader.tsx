'use client'

import { useEffect, useRef, useState } from 'react'

export default function FolderUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('directory', '')
    }
  }, [])

  const handleUpload = async () => {
    if (!files.length) return

    setUploading(true)
    setTotalFiles(files.length)
    setProgress(0)
    setSuccess(false)

    let uploaded = 0

    for (const file of files) {
      const fullPath = (file as any).webkitRelativePath || file.name

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

    await fetch('/api/update-json', { method: 'POST' })

    setUploading(false)
    setSuccess(true)

    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return
    const fileArray = Array.from(selectedFiles)
    setFiles(fileArray)

    const zipFiles = fileArray.filter((f) => f.name.endsWith('.zip'))
    console.log('📦 ZIP-bestanden gevonden:', zipFiles.map((f) => f.name))
  }

  return (
    <div className="border rounded p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2">📂 Upload een volledige map</h2>

      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
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

      {success && (
        <div className="mt-4 text-green-500 font-semibold">
          ✅ Upload voltooid – pagina wordt ververst...
        </div>
      )}
    </div>
  )
}