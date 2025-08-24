import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(dateObj)
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

export function formatCurrency(amount: number, currency = 'XOF'): string {
  if (currency === 'XOF' || currency === 'CFA') {
    return `${formatNumber(amount)} FCFA`
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    fr: 'Français',
    ar: 'العربية',
    wo: 'Wolof',
    pul: 'Pulaar',
    en: 'English',
  }
  
  return languages[code] || code.toUpperCase()
}

export function getContentTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    AUDIO: '🎵',
    VIDEO: '🎥',
    TEXT: '📝',
    PDF: '📄',
    EBOOK: '📚',
  }
  
  return icons[type] || '📄'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'text-green-600 bg-green-100',
    PUBLISHED: 'text-green-600 bg-green-100',
    VERIFIED: 'text-green-600 bg-green-100',
    COMPLETED: 'text-green-600 bg-green-100',
    
    PENDING: 'text-yellow-600 bg-yellow-100',
    PENDING_REVIEW: 'text-yellow-600 bg-yellow-100',
    UNDER_REVIEW: 'text-yellow-600 bg-yellow-100',
    PROCESSING: 'text-yellow-600 bg-yellow-100',
    
    DRAFT: 'text-gray-600 bg-gray-100',
    INACTIVE: 'text-gray-600 bg-gray-100',
    
    SUSPENDED: 'text-red-600 bg-red-100',
    BANNED: 'text-red-600 bg-red-100',
    REJECTED: 'text-red-600 bg-red-100',
    FAILED: 'text-red-600 bg-red-100',
    
    ARCHIVED: 'text-orange-600 bg-orange-100',
    PRIVATE: 'text-blue-600 bg-blue-100',
  }
  
  return colors[status] || 'text-gray-600 bg-gray-100'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Actif',
    INACTIVE: 'Inactif',
    PENDING: 'En attente',
    SUSPENDED: 'Suspendu',
    BANNED: 'Banni',
    VERIFIED: 'Vérifié',
    REJECTED: 'Rejeté',
    
    DRAFT: 'Brouillon',
    PENDING_REVIEW: 'En attente de révision',
    PUBLISHED: 'Publié',
    ARCHIVED: 'Archivé',
    FLAGGED: 'Signalé',
    PRIVATE: 'Privé',
    
    PENDING_VERIFICATION: 'En attente de vérification',
    UNDER_REVIEW: 'En révision',
    RESOLVED: 'Résolu',
    ESCALATED: 'Escaladé',
    
    PROCESSING: 'En cours',
    COMPLETED: 'Terminé',
    FAILED: 'Échec',
    CANCELLED: 'Annulé',
    
    REFUNDED: 'Remboursé',
    DISPUTED: 'Litige',
  }
  
  return labels[status] || status
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = function () {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    
    document.body.prepend(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
    } catch (error) {
      console.error('Failed to copy text: ', error)
    } finally {
      textArea.remove()
    }
    
    return Promise.resolve()
  }
}

export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a')
  link.href = url
  if (filename) {
    link.download = filename
  }
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i
  return isValidUrl(url) && imageExtensions.test(url)
}

export function isValidVideoUrl(url: string): boolean {
  const videoExtensions = /\.(mp4|webm|ogg|avi|mov)$/i
  return isValidUrl(url) && videoExtensions.test(url)
}

export function isValidAudioUrl(url: string): boolean {
  const audioExtensions = /\.(mp3|wav|ogg|aac|flac)$/i
  return isValidUrl(url) && audioExtensions.test(url)
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getMimeType(filename: string): string {
  const extension = getFileExtension(filename)
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    flac: 'audio/flac',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
  }
  
  return mimeTypes[extension] || 'application/octet-stream'
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Date utilities
export function isToday(date: string | Date): boolean {
  const today = new Date()
  const checkDate = typeof date === 'string' ? new Date(date) : date
  
  return checkDate.toDateString() === today.toDateString()
}

export function isYesterday(date: string | Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const checkDate = typeof date === 'string' ? new Date(date) : date
  
  return checkDate.toDateString() === yesterday.toDateString()
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const checkDate = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - checkDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  
  return formatDate(checkDate, { 
    year: diffDays > 365 ? 'numeric' : undefined,
    month: 'short', 
    day: 'numeric' 
  })
}
