"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  rememberMe: z.boolean().optional().default(false),
})

type FormData = z.infer<typeof schema>

function extractToken(data: any): string | null {
  if (!data) return null
  const candidates = [
    data.token,
    data.accessToken,
    data.jwt,
    data.data?.token,
    data.data?.accessToken,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 10) return c
  }
  return null
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: true },
  })

  const onSubmit = async (values: FormData) => {
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.login(values.email, values.password, values.rememberMe)
      const token = extractToken(res)
      if (token) {
        if (values.rememberMe) localStorage.setItem('auth_token', token)
        else sessionStorage.setItem('auth_token', token)
      }
      router.replace('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Échec de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à l'interface d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="form-input" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input type="password" className="form-input" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="rounded" {...register('rememberMe')} />
                <span className="text-sm">Se souvenir de moi</span>
              </label>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
