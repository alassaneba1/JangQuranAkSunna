"use client"

import useSWR from 'swr'
import { useState } from 'react'
import { mosquesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const fetcher = async () => {
  const res = await mosquesApi.getMosques({ page: 1, size: 10 })
  return res
}

export default function MosquesPage() {
  const { data, error, isLoading, mutate } = useSWR('mosques:list:1:10', fetcher)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Sénégal')
  const [submitting, setSubmitting] = useState(false)

  const onCreate = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await mosquesApi.createMosque({ name, city, country })
      setName('')
      setCity('')
      setCountry('Sénégal')
      await mutate()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mosquées</CardTitle>
          <CardDescription>Liste des mosquées (10 premières)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="form-input" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
            <input className="form-input" placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} />
            <input className="form-input" placeholder="Pays" value={country} onChange={e => setCountry(e.target.value)} />
            <Button onClick={onCreate} disabled={submitting}>Ajouter</Button>
          </div>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucune mosquée trouvée</div>}
              {data.data.map((m: any) => (
                <div key={m.id} className="border-b py-2">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.city}{m.country ? `, ${m.country}` : ''}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
