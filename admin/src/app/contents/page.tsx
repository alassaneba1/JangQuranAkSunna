"use client"

import useSWR from 'swr'
import { useState } from 'react'
import { contentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const fetcher = async () => {
  const res = await contentApi.getContents({ page: 1, size: 10 })
  return res
}

export default function ContentsPage() {
  const { data, error, isLoading, mutate } = useSWR('contents:list:1:10', fetcher)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('AUDIO')
  const [lang, setLang] = useState('fr')
  const [submitting, setSubmitting] = useState(false)

  const onCreate = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await contentApi.createContent({ title, type, lang })
      setTitle('')
      setType('AUDIO')
      setLang('fr')
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
          <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
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
            <div />
            <Button onClick={onCreate} disabled={submitting}>Ajouter</Button>
          </div>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun contenu trouvé</div>}
              {data.data.map((c: any) => (
                <div key={c.id} className="border-b py-2">
                  <div className="font-medium">{c.title || `Contenu #${c.id}`}</div>
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
