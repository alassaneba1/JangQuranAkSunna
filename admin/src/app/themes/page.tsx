"use client"

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { themesApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ThemesPage() {
  const [q, setQ] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [featured, setFeatured] = useState(false)

  const key = useMemo(() => `themes:list:${q}`, [q])
  const { data, isLoading, error, mutate } = useSWR(key, async () => {
    return themesApi.getThemes({ q: q || undefined })
  })

  const create = async () => {
    if (!name.trim()) return
    await themesApi.createTheme({ name, slug: slug || undefined, isFeatured: featured })
    setName(''); setSlug(''); setFeatured(false)
    mutate()
  }

  const toggleActive = async (t: any) => {
    await themesApi.updateTheme(t.id, { isActive: !t.isActive })
    mutate()
  }
  const remove = async (t: any) => {
    await themesApi.deleteTheme(t.id)
    mutate()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Thèmes</CardTitle>
          <CardDescription>Gérez la taxonomie des thèmes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Rechercher…" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="border rounded-md p-3 mb-6 flex flex-wrap gap-2 items-center">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm" />
            <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="Slug (optionnel)" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} /> Mis en avant</label>
            <Button onClick={create}>Ajouter</Button>
          </div>

          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur</div>}
          {Array.isArray(data) && (
            <div className="space-y-2">
              {data.length === 0 && <div>Aucun thème</div>}
              {data.map((t:any) => (
                <div key={t.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{t.name}</div>
                    <Badge variant="outline">{t.slug}</Badge>
                    {t.isFeatured && <Badge>Featured</Badge>}
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
