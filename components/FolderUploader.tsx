'use client'

import { useEffect, useRef, useState } from 'react'

export default function FolderUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [success, setSuccess] = useState(false)
  const [updatingJson, setUpdatingJson] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('directory', '')
    }
  }, [])

  const handleUpload = async (uploadFiles: File[]) => {
    if (!uploadFiles.length) return

    setUploading(true)
    setTotalFiles(uploadFiles.length)
    setProgress(0)
    setSuccess(false)

    let uploaded = 0

    for (const file of uploadFiles) {
      const fullPath = (file as any).webkitRelativePath || file.name

      // 👇 Vraag een signed upload-URL op voor elk bestand
      const res = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fullPath,
          contentType: file.type || 'application/octet-stream',
        }),
      })

      const { signedUrl } = await res.json()

      // 👇 Upload direct naar R2 via signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
      })

      if (!uploadRes.ok) {
        console.error(`❌ Upload mislukt voor ${fullPath}`)
      }

      uploaded++
      setProgress(uploaded)
    }

    setUploading(false)

    setUpdatingJson(true)
    // JSON bijwerken
    const res = await fetch('/api/update-json', { method: 'POST' })
    let result = null
    try {
      result = await res.json()
    } catch {
      alert('Fout: backend gaf geen geldige JSON terug!')
      setUpdatingJson(false)
      return
    }
    setUpdatingJson(false)
    if (result && result.success) {
      window.location.reload()
    } else {
      alert('Fout bij bijwerken van JSON: ' + (result?.error || 'Onbekende fout'))
    }

    setSuccess(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return
    const fileArray = Array.from(selectedFiles).filter(
      (f) => !(f.name === '.DS_Store' || f.webkitRelativePath?.includes('.DS_Store'))
    )
    setFiles(fileArray)

    const zipFiles = fileArray.filter((f) => f.name.endsWith('.zip'))
    console.log('📦 ZIP-bestanden gevonden:', zipFiles.map((f) => f.name))

    // Start direct met uploaden
    if (fileArray.length > 0) {
      handleUpload(fileArray)
    }
  }

  return (
    <div className="">
      <div className="mt-8">
        <label
          htmlFor="folder-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 backdrop-blur rounded-xl p-10 cursor-pointer hover:border-blue-500 hover:bg-gray-900/40 transition text-gray-300"
        >
          <span className="text-4xl mb-2">📁</span>
          <span className="mb-2">Sleep hier een map, of klik om te kiezen</span>
          <input
            id="folder-upload"
            ref={inputRef}
            type="file"
            multiple
            webkitdirectory="true"
            directory="true"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {uploading && (
          <div className="mt-4 w-full">
            <div className="text-sm mb-1">
              Uploading {progress} / {totalFiles} bestanden...
            </div>
            <div className="w-full h-3 bg-gray-800 rounded mt-4 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(progress / totalFiles) * 100}%` }}
              />
            </div>
          </div>
        )}

        {updatingJson && (
          <div className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold">
            ⏳ JSON wordt bijgewerkt...
          </div>
        )}

        {success && (
          <div className="mt-4 inline-block bg-green-700 text-white px-4 py-2 rounded-full font-semibold">
            ✅ Upload voltooid – pagina wordt ververst...
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 text-xs text-gray-400 max-h-32 overflow-y-auto">
            {files.map((f) => (
              <div key={f.name}>{f.webkitRelativePath || f.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}