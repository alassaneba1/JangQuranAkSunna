"use client"

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { contentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'

function PDFPreview({ url }: { url?: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function run() {
      setError(null)
      setBlobUrl(null)
      if (!url) {
        setError('URL manquante')
        return
      }
      try {
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        if (!active) return
        const objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
      } catch (e: any) {
        if (!active) return
        setError('Impossible de charger le PDF')
      }
    }
    run()
    return () => {
      active = false
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [url])

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm">{error}</div>
        {url && (
          <a className="btn btn-outline btn-sm" href={url} target="_blank" rel="noreferrer noopener">
            Ouvrir dans un nouvel onglet
          </a>
        )}
      </div>
    )
  }
  if (!blobUrl) return <div>Chargement du PDF…</div>
  return <iframe className="w-full h-96 border" src={blobUrl} />
}

export default function ContentsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const paramQ = params.get('q') || ''

  const [q, setQ] = useState(paramQ)
  const [type, setType] = useState<'ALL' | 'AUDIO' | 'VIDEO' | 'PDF' | 'TEXT'>('ALL')
  const [lang, setLang] = useState<'ALL' | 'fr' | 'wo' | 'ar'>('ALL')
  const [page, setPage] = useState(1)
  const size = 10
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', type: 'AUDIO', lang: 'fr', url: '', filename: '' } as any)

  useEffect(() => { setQ(paramQ) }, [paramQ])

  const key = useMemo(() => `contents:list:${page}:${size}:${q}:${type}:${lang}`,[page,size,q,type,lang])
  const fetcher = async () => contentApi.getContents({ page, size, q: q || undefined, type: type === 'ALL' ? undefined : type, lang: lang === 'ALL' ? undefined : lang })
  const { data, error, isLoading, mutate } = useSWR(key, fetcher)

  const pagination = data?.pagination

  const submitCreate = async () => {
    setCreating(true)
    try {
      await contentApi.createContent({ title: newItem.title, type: newItem.type, lang: newItem.lang, assets: newItem.url ? [{ id: 0, contentId: 0, kind: newItem.type === 'PDF' ? 'PDF' : (newItem.type === 'VIDEO' ? 'VIDEO_HIGH' : 'AUDIO_HIGH'), url: newItem.url, isEncrypted: false, isDefault: true, processingStatus: 'COMPLETED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] : [] })
      setShowCreate(false)
      setNewItem({ title: '', type: 'AUDIO', lang: 'fr', url: '' })
      mutate()
    } finally { setCreating(false) }
  }

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/contents/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}` }, body: JSON.stringify({ status }) })
    mutate()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contenus</CardTitle>
          <CardDescription>Recherche, filtres et prévisualisation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <input className="form-input md:flex-1" placeholder="Rechercher un contenu" value={q} onChange={e=>{setPage(1);setQ(e.target.value); router.replace(`/contents?q=${encodeURIComponent(e.target.value)}`)}} />
            <select className="form-select w-full md:w-40" value={type} onChange={e=>{setPage(1);setType(e.target.value as any)}}>
              <option value="ALL">Tous</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Vidéo</option>
              <option value="PDF">PDF</option>
              <option value="TEXT">Texte</option>
            </select>
            <select className="form-select w-full md:w-32" value={lang} onChange={e=>{setPage(1);setLang(e.target.value as any)}}>
              <option value="ALL">Langues</option>
              <option value="fr">Français</option>
              <option value="wo">Wolof</option>
              <option value="ar">Arabe</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(s=>!s)}>{showCreate? 'Fermer' : 'Nouveau contenu'}</button>
          </div>

          {showCreate && (
            <div className="border rounded p-3 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input className="form-input" placeholder="Titre" value={newItem.title} onChange={e=>setNewItem({ ...newItem, title: e.target.value })} />
              <select className="form-select" value={newItem.type} onChange={e=>setNewItem({ ...newItem, type: e.target.value })}>
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Vidéo</option>
                <option value="PDF">PDF</option>
                <option value="TEXT">Texte</option>
              </select>
              <select className="form-select" value={newItem.lang} onChange={e=>setNewItem({ ...newItem, lang: e.target.value })}>
                <option value="fr">Français</option>
                <option value="wo">Wolof</option>
                <option value="ar">Arabe</option>
              </select>
              <input className="form-input md:col-span-4" placeholder="URL média (mp3/mp4/pdf) — optionnel" value={newItem.url} onChange={e=>setNewItem({ ...newItem, url: e.target.value })} />
              <div className="md:col-span-4 flex justify-end">
                <button className="btn btn-primary btn-sm" onClick={submitCreate} disabled={creating || !newItem.title}>Créer</button>
              </div>
            </div>
          )}

          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun contenu trouvé</div>}
              {data.data.map((c: any) => (
                <div key={c.id} className="border-b py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.title || `Contenu #${c.id}`}</div>
                      <div className="text-sm text-gray-500">{c.type} • {c.lang} • vues: {c.viewsCount}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-outline btn-sm" onClick={()=>setExpandedId(expandedId===c.id?null:c.id)}>
                        {expandedId===c.id? 'Fermer' : 'Prévisualiser'}
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={()=>updateStatus(c.id, 'PUBLISHED')}>Publier</button>
                      <button className="btn btn-outline btn-sm" onClick={()=>updateStatus(c.id, 'REJECTED')}>Rejeter</button>
                    </div>
                  </div>
                  {expandedId===c.id && (
                    <div className="mt-3">
                      {c.type === 'AUDIO' && (
                        <audio controls className="w-full">
                          <source src={c.assets?.[0]?.url} />
                        </audio>
                      )}
                      {c.type === 'VIDEO' && (
                        <video controls className="w-full max-h-96">
                          <source src={c.assets?.[0]?.url} />
                        </video>
                      )}
                      {c.type === 'PDF' && (
                        <PDFPreview url={c.assets?.[0]?.url} />
                      )}
                      {c.type === 'TEXT' && (
                        <div className="prose" dangerouslySetInnerHTML={{ __html: c.description || '' }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {pagination && (
                <div className="flex items-center justify-between pt-2">
                  <button className="btn btn-outline btn-sm" disabled={!pagination.hasPrevious} onClick={()=>setPage(p=>Math.max(1,p-1))}>Précédent</button>
                  <div className="text-sm">Page {pagination.page} / {pagination.totalPages || 1}</div>
                  <button className="btn btn-outline btn-sm" disabled={!pagination.hasNext} onClick={()=>setPage(p=>p+1)}>Suivant</button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
