"use client"

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { contentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ContentsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState<'ALL' | 'AUDIO' | 'VIDEO' | 'PDF' | 'TEXT'>('ALL')
  const [lang, setLang] = useState<'ALL' | 'fr' | 'wo' | 'ar'>('ALL')
  const [page, setPage] = useState(1)
  const size = 10
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const key = useMemo(() => `contents:list:${page}:${size}:${q}:${type}:${lang}`,[page,size,q,type,lang])
  const fetcher = async () => contentApi.getContents({ page, size, q: q || undefined, type: type === 'ALL' ? undefined : type, lang: lang === 'ALL' ? undefined : lang })
  const { data, error, isLoading } = useSWR(key, fetcher)

  const pagination = data?.pagination

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contenus</CardTitle>
          <CardDescription>Recherche, filtres et prévisualisation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <input className="form-input md:flex-1" placeholder="Rechercher un contenu" value={q} onChange={e=>{setPage(1);setQ(e.target.value)}} />
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
          </div>
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
                    <button className="btn btn-outline btn-sm" onClick={()=>setExpandedId(expandedId===c.id?null:c.id)}>
                      {expandedId===c.id? 'Fermer' : 'Prévisualiser'}
                    </button>
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
                        <iframe className="w-full h-96 border" src={c.assets?.[0]?.url} />
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
