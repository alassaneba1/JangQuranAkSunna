import { Content, ContentStatus, ContentType, Teacher, TeacherStatus } from '@/types'

let teacherIdSeq = 1
let contentIdSeq = 1

const TEACHERS: Teacher[] = []
const CONTENTS: Content[] = []

function nowISO() { return new Date().toISOString() }

export function seedIfEmpty() {
  if (TEACHERS.length === 0) {
    const t1: Teacher = {
      id: teacherIdSeq++,
      displayName: 'Imam Mansour Diop',
      bio: 'Enseignant en tafsir et fiqh',
      languages: ['fr', 'wo'],
      specializations: ['Tafsir', 'Fiqh'],
      links: [],
      verified: true,
      status: TeacherStatus.VERIFIED,
      followersCount: 1240,
      totalContentCount: 0,
      totalViews: 0,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    const t2: Teacher = {
      id: teacherIdSeq++,
      displayName: 'Cheikh Ahmed Ba',
      bio: 'Cours de Aqida et Sira',
      languages: ['fr', 'ar'],
      specializations: ['Aqida', 'Sira'],
      links: [],
      verified: false,
      status: TeacherStatus.PENDING,
      followersCount: 320,
      totalContentCount: 0,
      totalViews: 0,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    TEACHERS.push(t1, t2)
  }
  if (CONTENTS.length === 0) {
    const teacher = TEACHERS[0]
    const c1: Content = {
      id: contentIdSeq++,
      type: ContentType.AUDIO,
      title: 'Introduction au Tafsir',
      description: 'Cours audio sur les bases du tafsir',
      teacher,
      lang: 'fr',
      status: ContentStatus.PUBLISHED,
      viewsCount: 1500,
      downloadsCount: 250,
      likesCount: 80,
      favoritesCount: 45,
      reportsCount: 0,
      downloadEnabled: true,
      downloadRequiresAuth: false,
      hasTranscript: false,
      hasTranslation: false,
      assets: [{
        id: 1,
        contentId: 0,
        kind: 'AUDIO_HIGH' as any,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        isEncrypted: false,
        isDefault: true,
        processingStatus: 'COMPLETED' as any,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      }],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    const c2: Content = {
      id: contentIdSeq++,
      type: ContentType.VIDEO,
      title: 'Fiqh de la prière',
      description: 'Vidéo explicative',
      teacher,
      lang: 'wo',
      status: ContentStatus.PUBLISHED,
      viewsCount: 2200,
      downloadsCount: 120,
      likesCount: 140,
      favoritesCount: 70,
      reportsCount: 1,
      downloadEnabled: true,
      downloadRequiresAuth: false,
      hasTranscript: false,
      hasTranslation: false,
      assets: [{
        id: 2,
        contentId: 0,
        kind: 'VIDEO_HIGH' as any,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        isEncrypted: false,
        isDefault: true,
        processingStatus: 'COMPLETED' as any,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      }],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    const c3: Content = {
      id: contentIdSeq++,
      type: ContentType.PDF,
      title: 'Guide du Ramadan',
      description: 'Document PDF',
      teacher,
      lang: 'fr',
      status: ContentStatus.PUBLISHED,
      viewsCount: 300,
      downloadsCount: 80,
      likesCount: 25,
      favoritesCount: 10,
      reportsCount: 0,
      downloadEnabled: true,
      downloadRequiresAuth: false,
      hasTranscript: false,
      hasTranslation: false,
      assets: [{
        id: 3,
        contentId: 0,
        kind: 'PDF' as any,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isEncrypted: false,
        isDefault: true,
        processingStatus: 'COMPLETED' as any,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      }],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    CONTENTS.push(c1, c2, c3)
  }
}

export function listTeachers({ page = 1, size = 10, q, verified }: { page?: number; size?: number; q?: string | null; verified?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...TEACHERS]
  if (term) items = items.filter(t => t.displayName.toLowerCase().includes(term) || (t.bio || '').toLowerCase().includes(term))
  if (verified === 'true') items = items.filter(t => t.verified)
  if (verified === 'false') items = items.filter(t => !t.verified)
  const total = items.length
  const start = (page - 1) * size
  const data = items.slice(start, start + size)
  return { data, pagination: { page, size, total, totalPages: Math.ceil(total / size), hasNext: page * size < total, hasPrevious: page > 1 } }
}

export function updateTeacher(id: number, patch: Partial<Teacher>) {
  const idx = TEACHERS.findIndex(t => t.id === id)
  if (idx === -1) return null
  TEACHERS[idx] = { ...TEACHERS[idx], ...patch, updatedAt: nowISO() }
  return TEACHERS[idx]
}

export function listContents({ page = 1, size = 10, q, type, lang }: { page?: number; size?: number; q?: string | null; type?: string | null; lang?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...CONTENTS]
  if (term) items = items.filter(c => c.title.toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term))
  if (type) items = items.filter(c => c.type === (type as ContentType))
  if (lang) items = items.filter(c => c.lang === lang)
  const total = items.length
  const start = (page - 1) * size
  const data = items.slice(start, start + size)
  return { data, pagination: { page, size, total, totalPages: Math.ceil(total / size), hasNext: page * size < total, hasPrevious: page > 1 } }
}

export function getContent(id: number) {
  return CONTENTS.find(c => c.id === id) || null
}
