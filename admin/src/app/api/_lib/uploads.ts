import { randomBytes } from 'crypto'

export type StoredFile = {
  id: string
  buffer: Buffer
  mime: string
  filename: string
  size: number
  createdAt: number
}

const store = new Map<string, StoredFile>()

export function saveFile(buffer: Buffer, mime: string, filename: string): StoredFile {
  const id = randomBytes(16).toString('hex')
  const item: StoredFile = { id, buffer, mime, filename, size: buffer.length, createdAt: Date.now() }
  store.set(id, item)
  return item
}

export function getFile(id: string): StoredFile | null {
  return store.get(id) || null
}

export function buildUrl(id: string) {
  return `/api/upload/${id}`
}
