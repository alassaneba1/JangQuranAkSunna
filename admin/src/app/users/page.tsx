"use client"

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { usersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserRole, UserStatus } from '@/types'

export default function UsersPage() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const key = useMemo(() => `users:list:${page}:${size}:${q}:${role}:${status}`,[page,size,q,role,status])
  const { data, error, isLoading, mutate } = useSWR(key, async () => {
    return usersApi.getUsers({ page, size, q: q || undefined, role: role || undefined, status: status || undefined })
  })

  const toggleAdmin = async (u: any) => {
    const hasAdmin = (u.roles || []).includes(UserRole.ADMIN)
    const roles = hasAdmin ? (u.roles || []).filter((r: string) => r !== UserRole.ADMIN) : [...(u.roles || []), UserRole.ADMIN]
    await usersApi.updateUser(u.id, { roles })
    mutate()
  }

  const toggleSuspend = async (u: any) => {
    if (u.status === UserStatus.SUSPENDED) await usersApi.unsuspendUser(u.id)
    else await usersApi.suspendUser(u.id, 'Suspended from admin')
    mutate()
  }

  const total = data?.pagination?.total || 0
  const totalPages = data?.pagination?.totalPages || 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs de la plateforme</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
                placeholder="Rechercher (nom, email)"
                className="h-9 w-56 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
                <option value="">Rôle: Tous</option>
                {Object.values(UserRole).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
                <option value="">Statut: Tous</option>
                {Object.values(UserStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select value={size} onChange={(e) => { setSize(parseInt(e.target.value)); setPage(1) }} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
                {[10,20,50].map(s => <option key={s} value={s}>{s}/page</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-3">
              {data.data.length === 0 && <div>Aucun utilisateur trouvé</div>}
              {data.data.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                      {((u.name || u.email)||'').slice(0,1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{u.name || u.email}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {u.roles?.map((r: string) => (
                        <Badge key={r} variant="outline">{r}</Badge>
                      ))}
                      <Badge variant={u.status === UserStatus.ACTIVE ? 'default' : 'outline'}>{u.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => toggleAdmin(u)}>
                        {(u.roles || []).includes(UserRole.ADMIN) ? 'Retirer ADMIN' : 'Rendre ADMIN'}
                      </Button>
                      <Button variant="outline" onClick={() => toggleSuspend(u)}>
                        {u.status === UserStatus.SUSPENDED ? 'Réactiver' : 'Suspendre'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-600">Total: {total}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))}>Précédent</Button>
                  <div className="text-sm">Page {page} / {totalPages}</div>
                  <Button variant="outline" disabled={page>=totalPages} onClick={() => setPage((p) => p+1)}>Suivant</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
