import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JangQuranAkSunna - Administration',
  description: 'Interface d\'administration pour la plateforme d\'enseignement islamique JangQuranAkSunna',
  keywords: ['islam', 'enseignement', 'coran', 'hadith', 'administration'],
  authors: [{ name: 'JangQuranAkSunna Team' }],
  robots: 'noindex, nofollow', // Admin interface should not be indexed
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div id="root">
          {children}
        </div>
        <div id="portal" />
      </body>
    </html>
  )
}
