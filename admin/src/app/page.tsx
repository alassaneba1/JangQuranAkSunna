'use client'

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building,
  Video,
  TrendingUp,
  AlertCircle,
  Download,
  Heart,
  Eye,
  Calendar
} from 'lucide-react'

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)} FCFA`
}

const getRelativeTime = (date: string): string => {
  const now = new Date()
  const checkDate = new Date(date)
  const diffMs = now.getTime() - checkDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  
  return checkDate.toLocaleDateString('fr-FR')
}

// Mock data for demonstration
const mockStats = {
  totalContents: 1247,
  totalTeachers: 85,
  totalMosques: 23,
  totalUsers: 15678,
  totalViews: 234567,
  totalDownloads: 45678,
  totalDonations: 1234567,
  pendingReports: 12,
  contentsByType: [
    { type: 'AUDIO', count: 856 },
    { type: 'VIDEO', count: 312 },
    { type: 'PDF', count: 67 },
    { type: 'TEXT', count: 12 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'content_published',
      message: 'Nouveau cours publié par Imam Mansour Diop',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: '2', 
      type: 'teacher_verified',
      message: 'Enseignant Cheikh Ahmed Ba vérifié',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: '3',
      type: 'donation_received',
      message: 'Don de 50,000 FCFA reçu',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    }
  ]
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconColor = 'text-blue-500' 
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
  iconColor?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</div>
      {trend && (
        <p className="text-xs text-gray-500">
          <span className="text-green-500">+{trend}</span> depuis le mois dernier
        </p>
      )}
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // In real app, fetch dashboard stats here
    // dashboardApi.getStats().then(setStats)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <Image src="https://cdn.builder.io/api/v1/image/assets%2Fed31a7480dc3437884fa527b0613263d%2F9899c54da1084b57874bf07e673f757f?format=webp&width=80" alt="JangQuranAkSunna" width={40} height={40} priority />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">JangQuranAkSunna</h1>
                <p className="text-sm text-gray-500">Interface d'administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600" suppressHydrationWarning>
                <Calendar className="w-3 h-3 mr-1" />
                {mounted ? new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </Badge>
              <Button className="flex items-center gap-2">
                <Image src="https://cdn.builder.io/api/v1/image/assets%2Fed31a7480dc3437884fa527b0613263d%2F9899c54da1084b57874bf07e673f757f?format=webp&width=40" alt="Logo" width={16} height={16} />
                Voir l'application
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h2>
          <p className="text-gray-600">
            Vue d'ensemble de la plateforme JangQuranAkSunna
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Contenus"
            value={stats.totalContents}
            icon={Video}
            trend="12%"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Enseignants"
            value={stats.totalTeachers}
            icon={Users}
            trend="8%"
            iconColor="text-green-500"
          />
          <StatCard
            title="Mosquées"
            value={stats.totalMosques}
            icon={Building}
            trend="5%"
            iconColor="text-purple-500"
          />
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            trend="23%"
            iconColor="text-orange-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Vues totales"
            value={stats.totalViews}
            icon={Eye}
            trend="18%"
            iconColor="text-indigo-500"
          />
          <StatCard
            title="Téléchargements"
            value={stats.totalDownloads}
            icon={Download}
            trend="25%"
            iconColor="text-pink-500"
          />
          <StatCard
            title="Donations"
            value={formatCurrency(stats.totalDonations)}
            icon={Heart}
            trend="15%"
            iconColor="text-red-500"
          />
          <StatCard
            title="Signalements"
            value={stats.pendingReports}
            icon={AlertCircle}
            iconColor="text-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Types Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des contenus</CardTitle>
              <CardDescription>
                Types de contenu sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.contentsByType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <span className="text-sm text-gray-600">{formatNumber(item.count)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500" suppressHydrationWarning>
                        {mounted ? getRelativeTime(activity.timestamp) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accès rapide aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <Video className="w-6 h-6 mb-2" />
                  Nouveau contenu
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Gérer enseignants
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Building className="w-6 h-6 mb-2" />
                  Gérer mosquées
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  Signalements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
