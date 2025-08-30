"use client"

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { tagsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TagType } from '@/types'

export default function TagsPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tType, setTType] = useState<string>(TagType.TOPIC)

  const key = useMemo(() => `tags:list:${q}:${type}`, [q,type])
  const { data, isLoading, error, mutate } = useSWR(key, async () => {
    return tagsApi.getTags({ q: q || undefined, type: type || undefined })
  })

  const create = async () => {
    if (!name.trim()) return
    await tagsApi.createTag({ name, slug: slug || undefined, type: tType })
    setName(''); setSlug(''); setTType(TagType.TOPIC)
    mutate()
  }

  const toggleActive = async (t: any) => {
    await tagsApi.updateTag(t.id, { isActive: !t.isActive })
    mutate()
  }
  const remove = async (t: any) => {
    await tagsApi.deleteTag(t.id)
    mutate()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Gérez la taxonomie des tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Rechercher…" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={type} onChange={(e)=>setType(e.target.value)} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
              <option value="">Type: Tous</option>
              {Object.values(TagType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="border rounded-md p-3 mb-6 flex flex-wrap gap-2 items-center">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm" />
            <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="Slug (optionnel)" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm" />
            <select value={tType} onChange={(e)=>setTType(e.target.value)} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
              {Object.values(TagType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Button onClick={create}>Ajouter</Button>
          </div>

          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur</div>}
          {Array.isArray(data) && (
            <div className="space-y-2">
              {data.length === 0 && <div>Aucun tag</div>}
              {data.map((t:any) => (
                <div key={t.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{t.name}</div>
                    <Badge variant="outline">{t.slug}</Badge>
                    <Badge variant="outline">{t.type}</Badge>
                    <Badge variant={t.isActive ? 'default' : 'outline'}>{t.isActive ? 'ACTIF' : 'INACTIF'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={()=>toggleActive(t)}>{t.isActive ? 'Désactiver' : 'Activer'}</Button>
                    <Button variant="outline" onClick={()=>remove(t)}>Supprimer</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
