"use client"

import useSWR from 'swr'
import { useState } from 'react'
import { contentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ContentsPage() {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterLang, setFilterLang] = useState('')
  const fetcher = async () => {
    const res = await contentApi.getContents({ page: 1, size: 10, q: query || undefined, type: filterType || undefined, lang: filterLang || undefined })
    return res
  }
  const { data, error, isLoading, mutate } = useSWR(`contents:list:1:10:${query}:${filterType}:${filterLang}`, fetcher)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('AUDIO')
  const [lang, setLang] = useState('fr')
  const [mediaUrl, setMediaUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await contentApi.uploadFile(file)
      const url = res?.data?.url || res?.data?.location || res?.url
      if (typeof url === 'string') setMediaUrl(url)
    } finally {
      setUploading(false)
    }
  }

  const onCreate = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await contentApi.createContent({ title, type, lang, mediaUrl })
      setTitle('')
      setType('AUDIO')
      setLang('fr')
      setMediaUrl('')
      await mutate()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contenus</CardTitle>
          <CardDescription>Liste des contenus (10 premiers)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="form-input" placeholder="Rechercher (titre)" value={query} onChange={e => setQuery(e.target.value)} />
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">Type (tous)</option>
              <option value="AUDIO">AUDIO</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PDF">PDF</option>
              <option value="TEXT">TEXT</option>
            </select>
            <select className="form-select" value={filterLang} onChange={e => setFilterLang(e.target.value)}>
              <option value="">Langue (toutes)</option>
              <option value="fr">fr</option>
              <option value="wo">wo</option>
              <option value="ar">ar</option>
            </select>
            <Button variant="outline" onClick={() => { setQuery(''); setFilterType(''); setFilterLang('') }}>Réinitialiser</Button>
          </div>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
            <input className="form-input" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
            <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
              <option value="AUDIO">AUDIO</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PDF">PDF</option>
              <option value="TEXT">TEXT</option>
            </select>
            <select className="form-select" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="fr">fr</option>
              <option value="wo">wo</option>
              <option value="ar">ar</option>
            </select>
            <input className="form-input" placeholder="Media URL (mp3/mp4/pdf)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
            <label className="block">
              <span className="text-sm">Uploader un fichier</span>
              <input type="file" className="block w-full text-sm" onChange={e => e.target.files && onUpload(e.target.files[0])} />
            </label>
            <Button onClick={onCreate} disabled={submitting || uploading}>{uploading ? 'Upload…' : 'Ajouter'}</Button>
          </div>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun contenu trouvé</div>}
              {data.data.map((c: any) => (
                <div key={c.id} className="border-b py-2">
                  <div className="font-medium"><Link href={`/contents/${c.id}`}>{c.title || `Contenu #${c.id}`}</Link></div>
                  <div className="text-sm text-gray-500">{c.type} • {c.lang} • vues: {c.viewsCount}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
