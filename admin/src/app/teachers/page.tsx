"use client"

import useSWR from 'swr'
import { useState } from 'react'
import { teachersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const fetcher = async () => {
  const res = await teachersApi.getTeachers({ page: 1, size: 10 })
  return res
}

export default function TeachersPage() {
  const { data, error, isLoading, mutate } = useSWR('teachers:list:1:10', fetcher)
  const [displayName, setDisplayName] = useState('')
  const [languages, setLanguages] = useState('fr')
  const [verified, setVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onCreate = async () => {
    if (!displayName.trim()) return
    setSubmitting(true)
    try {
      await teachersApi.createTeacher({ displayName, languages: languages.split(',').map(s => s.trim()).filter(Boolean), verified })
      setDisplayName('')
      setLanguages('fr')
      setVerified(false)
      await mutate()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Enseignants</CardTitle>
          <CardDescription>Liste des enseignants (10 premiers)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="form-input" placeholder="Nom d'affichage" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            <input className="form-input" placeholder="Langues (ex: fr,wo)" value={languages} onChange={e => setLanguages(e.target.value)} />
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" className="rounded" checked={verified} onChange={e => setVerified(e.target.checked)} />
              <span>Vérifié</span>
            </label>
            <Button onClick={onCreate} disabled={submitting}>Ajouter</Button>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
