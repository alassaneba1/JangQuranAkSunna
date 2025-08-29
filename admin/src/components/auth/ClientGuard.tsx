"use client"

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
        // Allow login page without check
        if (pathname === '/login') {
          setChecking(false)
          return
        }
        // If token exists, allow; otherwise validate via /me (cookie-based backends)
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
            : null
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
