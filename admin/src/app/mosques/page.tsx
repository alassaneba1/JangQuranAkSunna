"use client"

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { mosquesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function MosquesPage() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('ALL')
  const [country, setCountry] = useState('ALL')
  const [page, setPage] = useState(1)
  const size = 10
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', country: '' })

  const key = useMemo(() => `mosques:list:${page}:${size}:${q}:${city}:${country}`,[page,size,q,city,country])
  const fetcher = async () => mosquesApi.getMosques({ page, size, q: q || undefined, city: city==='ALL'?undefined:city, country: country==='ALL'?undefined:country })
  const { data, error, isLoading, mutate } = useSWR(key, fetcher)

  const create = async () => {
    setCreating(true)
    try {
      await mosquesApi.createMosque(form)
      setForm({ name: '', city: '', country: '' })
      setShowCreate(false)
      mutate()
    } finally { setCreating(false) }
  }

  const cities = data?.meta?.cities || []
  const countries = data?.meta?.countries || []
  const pagination = data?.pagination

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mosquées</CardTitle>
          <CardDescription>Liste, filtres et création rapide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <input className="form-input md:flex-1" placeholder="Rechercher une mosquée" value={q} onChange={e=>{setPage(1);setQ(e.target.value)}} />
            <select className="form-select w-full md:w-40" value={city} onChange={e=>{setPage(1);setCity(e.target.value)}}>
              <option value="ALL">Toutes villes</option>
              {cities.map((c:string)=>(<option key={c} value={c}>{c}</option>))}
            </select>
            <select className="form-select w-full md:w-40" value={country} onChange={e=>{setPage(1);setCountry(e.target.value)}}>
              <option value="ALL">Tous pays</option>
              {countries.map((c:string)=>(<option key={c} value={c}>{c}</option>))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(s=>!s)}>{showCreate?'Fermer':'Nouvelle mosquée'}</button>
          </div>

          {showCreate && (
            <div className="border rounded p-3 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="form-input" placeholder="Nom" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input className="form-input" placeholder="Ville" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
              <input className="form-input" placeholder="Pays" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} />
              <div className="md:col-span-3 flex justify-end">
                <button className="btn btn-primary btn-sm" onClick={create} disabled={creating || !form.name}>Créer</button>
              </div>
            </div>
          )}

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
