import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

export type StoredFile = {
  id: string
  buffer?: Buffer
  mime: string
  filename: string
  size: number
  createdAt: number
}

const g = globalThis as any
if (!g.__JQS_UPLOAD_STORE) {
  g.__JQS_UPLOAD_STORE = new Map<string, StoredFile>()
}
const memStore: Map<string, StoredFile> = g.__JQS_UPLOAD_STORE

const UPLOAD_DIR = path.join(process.cwd(), '.uploads')

async function ensureDir() {
  try { await fs.mkdir(UPLOAD_DIR, { recursive: true }) } catch {}
}

export async function saveFile(buffer: Buffer, mime: string, filename: string): Promise<StoredFile> {
  await ensureDir()
  const id = randomBytes(16).toString('hex')
  const filePath = path.join(UPLOAD_DIR, id)
  const metaPath = path.join(UPLOAD_DIR, `${id}.json`)
  await fs.writeFile(filePath, buffer)
  const item: StoredFile = { id, mime, filename, size: buffer.length, createdAt: Date.now() }
  await fs.writeFile(metaPath, JSON.stringify({ mime, filename, size: buffer.length, createdAt: item.createdAt }))
  memStore.set(id, item)
  return item
}

export async function getFile(id: string): Promise<{ meta: StoredFile; buffer: Buffer } | null> {
  const metaPath = path.join(UPLOAD_DIR, `${id}.json`)
  const filePath = path.join(UPLOAD_DIR, id)
  try {
    const [metaRaw, buf] = await Promise.all([fs.readFile(metaPath, 'utf-8'), fs.readFile(filePath)])
    const metaJson = JSON.parse(metaRaw)
    const meta: StoredFile = { id, ...metaJson }
    return { meta, buffer: buf }
  } catch {
    const m = memStore.get(id)
    if (!m) return null
    return { meta: m, buffer: Buffer.alloc(0) }
  }
}

export function buildUrl(id: string) {
  return `/api/upload/${id}`
}
