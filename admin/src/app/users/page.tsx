"use client"

import useSWR from 'swr'
import { usersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const fetcher = async () => {
  const res = await usersApi.getUsers({ page: 1, size: 10 })
  return res
}

export default function UsersPage() {
  const { data, error, isLoading } = useSWR('users:list:1:10', fetcher)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Liste des utilisateurs (10 premiers)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun utilisateur trouvé</div>}
              {data.data.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between border-b py-2">
                  <div>
                    <div className="font-medium">{u.name || u.email}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </div>
                  <div className="flex gap-2">
                    {u.roles?.map((r: string) => (
                      <Badge key={r} variant="outline">{r}</Badge>
                    ))}
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
