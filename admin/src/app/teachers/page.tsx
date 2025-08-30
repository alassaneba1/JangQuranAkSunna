"use client"

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { teachersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TeachersPage() {
  const [q, setQ] = useState('')
  const [verified, setVerified] = useState<'all' | 'true' | 'false'>('all')
  const [lang, setLang] = useState<'ALL'|'fr'|'wo'|'ar'>('ALL')
  const [page, setPage] = useState(1)
  const size = 10

  const key = useMemo(() => `teachers:list:${page}:${size}:${q}:${verified}:${lang}`,[page,size,q,verified,lang])
  const fetcher = async () => teachersApi.getTeachers({ page, size, q: q || undefined, verified: verified === 'all' ? undefined : verified, lang: lang==='ALL'?undefined:lang })
  const { data, error, isLoading } = useSWR(key, fetcher)

  const pagination = data?.pagination

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Enseignants</CardTitle>
          <CardDescription>Recherche et filtrage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <input className="form-input md:flex-1" placeholder="Rechercher un enseignant" value={q} onChange={e=>{setPage(1);setQ(e.target.value)}} />
            <select className="form-select w-full md:w-48" value={verified} onChange={e=>{setPage(1);setVerified(e.target.value as any)}}>
              <option value="all">Tous</option>
              <option value="true">Vérifiés</option>
              <option value="false">Non vérifiés</option>
            </select>
          </div>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun enseignant trouvé</div>}
              {data.data.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between border-b py-2">
                  <div>
                    <div className="font-medium">{t.displayName || t.user?.name || `ID ${t.id}`}</div>
                    {t.languages?.length ? (
                      <div className="text-sm text-gray-500">{t.languages.join(', ')}</div>
                    ) : null}
                  </div>
                  <Badge variant={t.verified ? 'success' : 'warning'}>
                    {t.verified ? 'Vérifié' : 'En attente'}
                  </Badge>
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
