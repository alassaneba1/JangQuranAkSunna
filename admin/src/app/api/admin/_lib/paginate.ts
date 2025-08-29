export type Pagination = { page: number; size: number; total: number; totalPages: number; hasNext: boolean; hasPrevious: boolean }
export type PaginatedResponse<T> = { data: T[]; pagination: Pagination }

export function buildPagination<T>(items: T[], pageParam?: string | null, sizeParam?: string | null): PaginatedResponse<T> {
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const size = Math.max(1, Math.min(100, parseInt(sizeParam || '10', 10) || 10))
  const start = (page - 1) * size
  const sliced = items.slice(start, start + size)
  const total = items.length
  const totalPages = Math.ceil(total / size)
  return {
    data: sliced,
    pagination: {
      page,
      size,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  }
}
