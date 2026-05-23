'use client'
import { useState } from 'react'
import Image from 'next/image'

interface LogoUploaderProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function LogoUploader({ onUpload, currentUrl }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || '')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const { url } = await res.json()
      setPreview(url)
      onUpload(url)
    } catch {
      // silent
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {preview && (
        <Image
          src={preview}
          alt="Logo preview"
          width={80}
          height={40}
          className="h-10 w-auto rounded border border-white/10 bg-white/5 p-1 object-contain"
          unoptimized
        />
      )}
      <label
        className={`cursor-pointer border border-white/10 rounded-lg px-4 py-2.5 text-sm transition-colors ${
          uploading ? 'text-white/30' : 'text-white/60 hover:border-white/30 hover:text-white'
        }`}
      >
        {uploading ? 'Uploading…' : 'Choose File'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          disabled={uploading}
        />
      </label>
      <span className="text-white/20 text-xs">PNG, JPG, SVG up to 2MB</span>
    </div>
  )
}
