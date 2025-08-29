import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, PaginatedResponse, ApiError } from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage or session
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Add request timestamp
    config.headers['X-Request-Time'] = new Date().toISOString()
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden:', error.response.data)
    }
    
    if (error.response?.status >= 500) {
      // Server error - show generic message
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// Generic API functions
export const apiRequest = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, { params })
    return response.data.data
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data)
    return response.data.data
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data)
    return response.data.data
  },
  
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data)
    return response.data.data
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url)
    return response.data.data
  },
  
  getPaginated: async <T>(url: string, params?: any): Promise<PaginatedResponse<T>> => {
    const response = await api.get<PaginatedResponse<T>>(url, { params })
    return response.data
  },
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe })
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
  
  getCurrentUser: async () => {
    return apiRequest.get('/me')
  },
  
  updateProfile: async (data: any) => {
    return apiRequest.patch('/me', data)
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest.post('/auth/change-password', { currentPassword, newPassword })
  },
}

// Users API
export const usersApi = {
  getUsers: async (params?: any) => {
    return apiRequest.getPaginated('/admin/users', params)
  },
  
  getUser: async (id: number) => {
    return apiRequest.get(`/admin/users/${id}`)
  },
  
  createUser: async (data: any) => {
    return apiRequest.post('/admin/users', data)
  },
  
  updateUser: async (id: number, data: any) => {
    return apiRequest.put(`/admin/users/${id}`, data)
  },
  
  deleteUser: async (id: number) => {
    return apiRequest.delete(`/admin/users/${id}`)
  },
  
  suspendUser: async (id: number, reason: string) => {
    return apiRequest.post(`/admin/users/${id}/suspend`, { reason })
  },
  
  unsuspendUser: async (id: number) => {
    return apiRequest.post(`/admin/users/${id}/unsuspend`)
  },
}

// Teachers API
export const teachersApi = {
  getTeachers: async (params?: any) => {
    return apiRequest.getPaginated('/admin/teachers', params)
  },
  
  getTeacher: async (id: number) => {
    return apiRequest.get(`/admin/teachers/${id}`)
  },
  
  createTeacher: async (data: any) => {
    return apiRequest.post('/admin/teachers', data)
  },
  
  updateTeacher: async (id: number, data: any) => {
    return apiRequest.put(`/admin/teachers/${id}`, data)
  },
  
  deleteTeacher: async (id: number) => {
    return apiRequest.delete(`/admin/teachers/${id}`)
  },
  
  verifyTeacher: async (id: number, notes?: string) => {
    return apiRequest.post(`/admin/teachers/${id}/verify`, { notes })
  },
  
  rejectTeacher: async (id: number, reason: string) => {
    return apiRequest.post(`/admin/teachers/${id}/reject`, { reason })
  },
}

// Mosques API
export const mosquesApi = {
  getMosques: async (params?: any) => {
    return apiRequest.getPaginated('/admin/mosques', params)
  },
  
  getMosque: async (id: number) => {
    return apiRequest.get(`/admin/mosques/${id}`)
  },
  
  createMosque: async (data: any) => {
    return apiRequest.post('/admin/mosques', data)
  },
  
  updateMosque: async (id: number, data: any) => {
    return apiRequest.put(`/admin/mosques/${id}`, data)
  },
  
  deleteMosque: async (id: number) => {
    return apiRequest.delete(`/admin/mosques/${id}`)
  },
  
  verifyMosque: async (id: number) => {
    return apiRequest.post(`/admin/mosques/${id}/verify`)
  },
}

// Content API
export const contentApi = {
  getContents: async (params?: any) => {
    return apiRequest.getPaginated('/admin/contents', params)
  },
  
  getContent: async (id: number) => {
    return apiRequest.get(`/admin/contents/${id}`)
  },
  
  createContent: async (data: any) => {
    return apiRequest.post('/admin/contents', data)
  },
  
  updateContent: async (id: number, data: any) => {
    return apiRequest.put(`/admin/contents/${id}`, data)
  },
  
  deleteContent: async (id: number) => {
    return apiRequest.delete(`/admin/contents/${id}`)
  },
  
  publishContent: async (id: number) => {
    return apiRequest.post(`/admin/contents/${id}/publish`)
  },
  
  unpublishContent: async (id: number) => {
    return apiRequest.post(`/admin/contents/${id}/unpublish`)
  },
  
  approveContent: async (id: number) => {
    return apiRequest.post(`/admin/contents/${id}/approve`)
  },
  
  rejectContent: async (id: number, reason: string) => {
    return apiRequest.post(`/admin/contents/${id}/reject`, { reason })
  },
  
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    
    return response.data
  },
}

// Series API
export const seriesApi = {
  getSeries: async (params?: any) => {
    return apiRequest.getPaginated('/admin/series', params)
  },
  
  getSeriesById: async (id: number) => {
    return apiRequest.get(`/admin/series/${id}`)
  },
  
  createSeries: async (data: any) => {
    return apiRequest.post('/admin/series', data)
  },
  
  updateSeries: async (id: number, data: any) => {
    return apiRequest.put(`/admin/series/${id}`, data)
  },
  
  deleteSeries: async (id: number) => {
    return apiRequest.delete(`/admin/series/${id}`)
  },
  
  publishSeries: async (id: number) => {
    return apiRequest.post(`/admin/series/${id}/publish`)
  },
}

// Themes API
export const themesApi = {
  getThemes: async (params?: any) => {
    return apiRequest.get('/admin/themes', params)
  },
  
  getTheme: async (id: number) => {
    return apiRequest.get(`/admin/themes/${id}`)
  },
  
  createTheme: async (data: any) => {
    return apiRequest.post('/admin/themes', data)
  },
  
  updateTheme: async (id: number, data: any) => {
    return apiRequest.put(`/admin/themes/${id}`, data)
  },
  
  deleteTheme: async (id: number) => {
    return apiRequest.delete(`/admin/themes/${id}`)
  },
}

// Tags API
export const tagsApi = {
  getTags: async (params?: any) => {
    return apiRequest.get('/admin/tags', params)
  },
  
  getTag: async (id: number) => {
    return apiRequest.get(`/admin/tags/${id}`)
  },
  
  createTag: async (data: any) => {
    return apiRequest.post('/admin/tags', data)
  },
  
  updateTag: async (id: number, data: any) => {
    return apiRequest.put(`/admin/tags/${id}`, data)
  },
  
  deleteTag: async (id: number) => {
    return apiRequest.delete(`/admin/tags/${id}`)
  },
}

// Reports API
export const reportsApi = {
  getReports: async (params?: any) => {
    return apiRequest.getPaginated('/admin/reports', params)
  },
  
  getReport: async (id: number) => {
    return apiRequest.get(`/admin/reports/${id}`)
  },
  
  resolveReport: async (id: number, action: string, notes?: string) => {
    return apiRequest.post(`/admin/reports/${id}/resolve`, { action, notes })
  },
  
  rejectReport: async (id: number, notes?: string) => {
    return apiRequest.post(`/admin/reports/${id}/reject`, { notes })
  },
}

// Donations API
export const donationsApi = {
  getDonations: async (params?: any) => {
    return apiRequest.getPaginated('/admin/donations', params)
  },
  
  getDonation: async (id: number) => {
    return apiRequest.get(`/admin/donations/${id}`)
  },
  
  refundDonation: async (id: number, reason: string) => {
    return apiRequest.post(`/admin/donations/${id}/refund`, { reason })
  },
  
  getDonationStats: async (params?: any) => {
    return apiRequest.get('/admin/donations/stats', params)
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return apiRequest.get('/admin/dashboard/stats')
  },
  
  getActivity: async (params?: any) => {
    return apiRequest.get('/admin/dashboard/activity', params)
  },
  
  getTopContent: async (params?: any) => {
    return apiRequest.get('/admin/dashboard/top-content', params)
  },
}

// Import/Export API
export const importExportApi = {
  importFromYoutube: async (channelId: string, options?: any) => {
    return apiRequest.post('/admin/import/youtube', { channelId, ...options })
  },
  
  importFromTelegram: async (data: any) => {
    return apiRequest.post('/admin/import/telegram', data)
  },
  
  exportData: async (type: string, filters?: any) => {
    const response = await api.post('/admin/export', { type, filters }, {
      responseType: 'blob',
    })
    return response.data
  },
  
  getImportJobs: async () => {
    return apiRequest.get('/admin/import/jobs')
  },
  
  getImportJob: async (id: string) => {
    return apiRequest.get(`/admin/import/jobs/${id}`)
  },
}

// System API
export const systemApi = {
  getHealth: async () => {
    return apiRequest.get('/health')
  },
  
  getMetrics: async () => {
    return apiRequest.get('/metrics')
  },
  
  reindexSearch: async () => {
    return apiRequest.post('/admin/system/reindex')
  },
  
  clearCache: async () => {
    return apiRequest.post('/admin/system/clear-cache')
  },
  
  getSystemInfo: async () => {
    return apiRequest.get('/admin/system/info')
  },
}

export default api
