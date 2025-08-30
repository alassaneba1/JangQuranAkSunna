"use client"

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Tableau de bord' },
  { href: '/contents', label: 'Contenus' },
  { href: '/teachers', label: 'Enseignants' },
  { href: '/mosques', label: 'Mosquées' },
  { href: '/themes', label: 'Thèmes' },
  { href: '/tags', label: 'Tags' },
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

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [sugs, setSugs] = useState<{contentTitles:string[]; teacherNames:string[]}>({contentTitles:[], teacherNames:[]})
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const onClick = (e:any)=>{ if (!boxRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onClick)
    return ()=>document.removeEventListener('click', onClick)
  },[])

  useEffect(()=>{
    const t = setTimeout(async ()=>{
      const token = typeof window!=='undefined' ? (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')) : null
      if (!query) { setSugs({contentTitles:[], teacherNames:[]}); return }
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`, { headers: token? { Authorization: `Bearer ${token}` }: undefined })
      if (res.ok) setSugs(await res.json().then(j=>j.data))
    }, 200)
    return ()=>clearTimeout(t)
  },[query])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    try {
      const history = JSON.parse(localStorage.getItem('search_history') || '[]') as string[]
      const next = [query, ...history.filter(q=>q!==query)].slice(0,5)
      localStorage.setItem('search_history', JSON.stringify(next))
    } catch {}
    router.push(`/contents?q=${encodeURIComponent(query)}`)
    setOpen(false)
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <Image src="https://cdn.builder.io/api/v1/image/assets%2Fed31a7480dc3437884fa527b0613263d%2F9899c54da1084b57874bf07e673f757f?format=webp&width=80" alt="JangQuranAkSunna" width={36} height={36} priority />
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
          <div className="flex items-center gap-3">
            <div className="hidden md:block relative" ref={boxRef}>
              <form onSubmit={submitSearch}>
                <input value={query} onChange={(e)=>{setQuery(e.target.value); setOpen(true)}} placeholder="Rechercher…" className="form-input w-64" />
              </form>
              {open && (sugs.contentTitles.length>0 || sugs.teacherNames.length>0) && (
                <div className="absolute z-10 mt-1 w-72 bg-white border rounded shadow">
                  <div className="p-2 text-xs text-gray-500">Suggestions</div>
                  {sugs.contentTitles.map((t)=> (
                    <button key={t} className="block w-full text-left px-3 py-1 hover:bg-gray-50" onClick={()=>{setQuery(t); router.push(`/contents?q=${encodeURIComponent(t)}`); setOpen(false)}}>{t}</button>
                  ))}
                  {sugs.teacherNames.length>0 && <div className="px-3 py-1 text-xs text-gray-400">Enseignants</div>}
                  {sugs.teacherNames.map((t)=> (
                    <button key={t} className="block w-full text-left px-3 py-1 hover:bg-gray-50" onClick={()=>{setQuery(t); router.push(`/teachers?q=${encodeURIComponent(t)}`); setOpen(false)}}>{t}</button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
