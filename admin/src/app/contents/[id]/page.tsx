'use client'

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import { contentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const fetcher = (id: string) => contentApi.getContent(Number(id))

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const { data, error, isLoading } = useSWR(id ? `content:${id}` : null, () => fetcher(id!))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Détail du contenu</CardTitle>
          <CardDescription>
            <Link href="/contents" className="text-blue-600">← Retour à la liste</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Chargement…</div>}
          {error && <div className="text-red-600">Erreur de chargement</div>}
          {data && (
            <div className="space-y-4">
              <div>
                <div className="text-xl font-semibold">{(data as any).title}</div>
                <div className="text-sm text-gray-500">{(data as any).type} • {(data as any).lang}</div>
              </div>
              <div>
                {((data as any).type === 'AUDIO') && (
                  <audio controls className="w-full" src={(data as any).mediaUrl || ''} />
                )}
                {((data as any).type === 'VIDEO') && (
                  <video controls className="w-full aspect-video bg-black" src={(data as any).mediaUrl || ''} />
                )}
                {((data as any).type === 'PDF') && (
                  <iframe className="w-full h-[80vh]" src={(data as any).mediaUrl || ''} />
                )}
                {((data as any).type === 'TEXT') && (
                  <div className="prose">Ce contenu est de type texte.</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
