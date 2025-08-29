"use client"

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
            : null

        // Optional dev bypass
        if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
          if (!cancelled) setChecking(false)
          return
        }

        if (pathname === '/login') {
          // If already authenticated, redirect away from login
          if (token) {
            if (!cancelled) router.replace('/')
            return
          }
          try {
            await authApi.getCurrentUser()
            if (!cancelled) router.replace('/')
            return
          } catch {
            if (!cancelled) setChecking(false)
            return
          }
        }

        // For protected pages: if token missing, try /me; else allow
        if (!token) {
          await authApi.getCurrentUser()
        }
        if (!cancelled) setChecking(false)
      } catch (e) {
        if (!cancelled) {
          setChecking(false)
          router.replace('/login')
        }
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [pathname, router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner h-8 w-8 border-2 border-gray-300 border-t-primary rounded-full" />
      </div>
    )
  }

  return <>{children}</>
}
