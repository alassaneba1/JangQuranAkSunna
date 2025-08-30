"use client"

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Tableau de bord' },
  { href: '/contents', label: 'Contenus' },
  { href: '/teachers', label: 'Enseignants' },
  { href: '/mosques', label: 'Mosquées' },
  { href: '/users', label: 'Utilisateurs' },
]

export default function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
    }
    router.replace('/login')
  }

  if (pathname === '/login') return null

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <nav className="flex items-center gap-4 text-sm">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`hover:text-blue-600 ${pathname === l.href ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
