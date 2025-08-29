"use client"

import useSWR from 'swr'
import { teachersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const fetcher = async () => {
  const res = await teachersApi.getTeachers({ page: 1, size: 10 })
  return res
}

export default function TeachersPage() {
  const { data, error, isLoading } = useSWR('teachers:list:1:10', fetcher)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Enseignants</CardTitle>
          <CardDescription>Liste des enseignants (10 premiers)</CardDescription>
        </CardHeader>
        <CardContent>
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
