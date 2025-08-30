import { Content, ContentStatus, ContentType, Teacher, TeacherStatus, TagType } from '@/types'

import type { Mosque, Theme, Tag } from '@/types'

type Store = { teacherIdSeq: number; contentIdSeq: number; mosqueIdSeq: number; themeIdSeq: number; tagIdSeq: number; TEACHERS: Teacher[]; CONTENTS: Content[]; MOSQUES: Mosque[]; THEMES: Theme[]; TAGS: Tag[] }
const g = globalThis as any
if (!g.__JQS_DB) {
  g.__JQS_DB = { teacherIdSeq: 1, contentIdSeq: 1, mosqueIdSeq: 1, themeIdSeq: 1, tagIdSeq: 1, TEACHERS: [], CONTENTS: [], MOSQUES: [], THEMES: [], TAGS: [] } as Store
}
const store: Store = g.__JQS_DB as Store

function nowISO() { return new Date().toISOString() }

export function seedIfEmpty() {
  if (store.TEACHERS.length === 0) {
    const t1: Teacher = {
      id: store.teacherIdSeq++,
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
      id: store.teacherIdSeq++,
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
    store.TEACHERS.push(t1, t2)
  }
  if (store.MOSQUES.length === 0) {
    store.MOSQUES.push({ id: store.mosqueIdSeq++, name: 'Grande Mosquée de Dakar', city: 'Dakar', country: 'Sénégal', verified: true, status: 'ACTIVE' as any, services: [], languages: ['fr','wo'], followersCount: 0, contentCount: 0, eventsCount: 0, createdAt: nowISO(), updatedAt: nowISO() })
    store.MOSQUES.push({ id: store.mosqueIdSeq++, name: 'Mosquée Al-Falah', city: 'Thiès', country: 'Sénégal', verified: false, status: 'PENDING' as any, services: [], languages: ['fr'], followersCount: 0, contentCount: 0, eventsCount: 0, createdAt: nowISO(), updatedAt: nowISO() })
  }
  if (store.THEMES.length === 0) {
    store.THEMES.push({ id: store.themeIdSeq++, name: 'Tafsir', slug: 'tafsir', description: 'Exégèse', displayOrder: 1, isFeatured: true, isActive: true, contentCount: 0, seriesCount: 0, createdAt: nowISO(), updatedAt: nowISO() } as any)
    store.THEMES.push({ id: store.themeIdSeq++, name: 'Fiqh', slug: 'fiqh', description: 'Jurisprudence', displayOrder: 2, isFeatured: false, isActive: true, contentCount: 0, seriesCount: 0, createdAt: nowISO(), updatedAt: nowISO() } as any)
  }
  if (store.TAGS.length === 0) {
    store.TAGS.push({ id: store.tagIdSeq++, name: 'Ramadan', slug: 'ramadan', description: 'Mois de Ramadan', type: TagType.OCCASION, isFeatured: false, isActive: true, usageCount: 0, createdAt: nowISO(), updatedAt: nowISO() } as any)
    store.TAGS.push({ id: store.tagIdSeq++, name: 'Aqida', slug: 'aqida', description: 'Croyance', type: TagType.TOPIC, isFeatured: false, isActive: true, usageCount: 0, createdAt: nowISO(), updatedAt: nowISO() } as any)
  }
  if (store.CONTENTS.length === 0) {
    const teacher = store.TEACHERS[0]
    const c1: Content = {
      id: store.contentIdSeq++,
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
      id: store.contentIdSeq++,
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
      id: store.contentIdSeq++,
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
    store.CONTENTS.push(c1, c2, c3)
  }
}

export function listTeachers({ page = 1, size = 10, q, verified, lang }: { page?: number; size?: number; q?: string | null; verified?: string | null; lang?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...store.TEACHERS]
  if (term) items = items.filter(t => t.displayName.toLowerCase().includes(term) || (t.bio || '').toLowerCase().includes(term))
  if (verified === 'true') items = items.filter(t => t.verified)
  if (verified === 'false') items = items.filter(t => !t.verified)
  if (lang) items = items.filter(t => t.languages?.includes(lang))
  const total = items.length
  const start = (page - 1) * size
  const data = items.slice(start, start + size)
  return { data, pagination: { page, size, total, totalPages: Math.ceil(total / size), hasNext: page * size < total, hasPrevious: page > 1 } }
}

export function updateTeacher(id: number, patch: Partial<Teacher>) {
  const idx = store.TEACHERS.findIndex(t => t.id === id)
  if (idx === -1) return null
  store.TEACHERS[idx] = { ...store.TEACHERS[idx], ...patch, updatedAt: nowISO() }
  return store.TEACHERS[idx]
}

export function listContents({ page = 1, size = 10, q, type, lang }: { page?: number; size?: number; q?: string | null; type?: string | null; lang?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...store.CONTENTS]
  if (term) items = items.filter(c => c.title.toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term))
  if (type) items = items.filter(c => c.type === (type as ContentType))
  if (lang) items = items.filter(c => c.lang === lang)
  const total = items.length
  const start = (page - 1) * size
  const data = items.slice(start, start + size)
  const facets = {
    byType: ['AUDIO','VIDEO','PDF','TEXT'].map(t => ({ type: t, count: store.CONTENTS.filter(c => (!term || c.title.toLowerCase().includes(term)) && c.type === (t as any)).length })),
    byLang: ['fr','wo','ar'].map(l => ({ lang: l, count: store.CONTENTS.filter(c => (!term || c.title.toLowerCase().includes(term)) && c.lang === l).length })),
  }
  return { data, pagination: { page, size, total, totalPages: Math.ceil(total / size), hasNext: page * size < total, hasPrevious: page > 1 }, facets }
}

export function getContent(id: number) {
  return store.CONTENTS.find(c => c.id === id) || null
}

export function createContent(input: Partial<Content>) {
  seedIfEmpty()
  const teacher = input.teacher || store.TEACHERS[0]
  const c: Content = {
    id: store.contentIdSeq++,
    type: (input.type as any) || ContentType.AUDIO,
    title: input.title || 'Nouveau contenu',
    description: input.description || '',
    teacher: teacher!,
    mosque: input.mosque,
    series: input.series,
    seriesOrder: input.seriesOrder,
    lang: (input.lang as any) || 'fr',
    durationSeconds: input.durationSeconds,
    status: (input.status as any) || ContentStatus.DRAFT,
    publishedAt: input.publishedAt,
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl,
    sourceMetadata: input.sourceMetadata,
    thumbnailUrl: input.thumbnailUrl,
    waveformData: input.waveformData,
    viewsCount: 0,
    downloadsCount: 0,
    likesCount: 0,
    favoritesCount: 0,
    reportsCount: 0,
    downloadEnabled: true,
    downloadRequiresAuth: false,
    offlineExpirationDays: input.offlineExpirationDays,
    contentHash: input.contentHash,
    perceptualHash: input.perceptualHash,
    quranReferences: input.quranReferences,
    hadithReferences: input.hadithReferences,
    hasTranscript: false,
    hasTranslation: false,
    assets: input.assets || [],
    chapters: input.chapters || [],
    tags: input.tags as any,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  store.CONTENTS.unshift(c)
  return c
}

export function updateContent(id: number, patch: Partial<Content>) {
  const idx = store.CONTENTS.findIndex(c => c.id === id)
  if (idx === -1) return null
  store.CONTENTS[idx] = { ...store.CONTENTS[idx], ...patch, updatedAt: nowISO() }
  return store.CONTENTS[idx]
}

export function listMosques({ page = 1, size = 10, q, city, country }: { page?: number; size?: number; q?: string | null; city?: string | null; country?: string | null }) {
  seedIfEmpty()
  let items = [...store.MOSQUES]
  const term = (q || '').toLowerCase().trim()
  if (term) items = items.filter(m => m.name.toLowerCase().includes(term) || (m.city || '').toLowerCase().includes(term) || (m.country || '').toLowerCase().includes(term))
  if (city) items = items.filter(m => m.city === city)
  if (country) items = items.filter(m => m.country === country)
  const total = items.length
  const start = (page - 1) * size
  const data = items.slice(start, start + size)
  const cities = Array.from(new Set(store.MOSQUES.map(m => m.city))).sort()
  const countries = Array.from(new Set(store.MOSQUES.map(m => m.country))).sort()
  return { data, pagination: { page, size, total, totalPages: Math.ceil(total / size), hasNext: page * size < total, hasPrevious: page > 1 }, meta: { cities, countries } }
}

export function createMosque(input: Partial<Mosque>) {
  const m: Mosque = {
    id: store.mosqueIdSeq++,
    name: input.name || 'Nouvelle mosquée',
    description: input.description,
    address: input.address,
    city: input.city || '',
    region: input.region,
    country: input.country || '',
    postalCode: input.postalCode,
    latitude: input.latitude,
    longitude: input.longitude,
    phoneNumber: input.phoneNumber,
    email: input.email,
    websiteUrl: input.websiteUrl,
    facebookPage: input.facebookPage,
    instagramPage: input.instagramPage,
    twitterPage: input.twitterPage,
    imageUrl: input.imageUrl,
    coverImageUrl: input.coverImageUrl,
    foundedYear: input.foundedYear,
    capacity: input.capacity,
    imamName: input.imamName,
    architecturalStyle: input.architecturalStyle,
    verified: !!input.verified,
    status: (input.status as any) || 'ACTIVE',
    followersCount: 0,
    contentCount: 0,
    eventsCount: 0,
    prayerTimes: input.prayerTimes,
    services: input.services || [],
    languages: input.languages || [],
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  store.MOSQUES.unshift(m)
  return m
}

export function updateMosque(id: number, patch: Partial<Mosque>) {
  const idx = store.MOSQUES.findIndex(m => m.id === id)
  if (idx === -1) return null
  store.MOSQUES[idx] = { ...store.MOSQUES[idx], ...patch, updatedAt: nowISO() }
  return store.MOSQUES[idx]
}

export function listThemes({ q }: { q?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...store.THEMES]
  if (term) items = items.filter(t => t.name.toLowerCase().includes(term) || (t.description || '').toLowerCase().includes(term) || t.slug.toLowerCase().includes(term))
  return items
}

export function createTheme(input: Partial<Theme>) {
  const now = nowISO()
  const t: Theme = {
    id: store.themeIdSeq++,
    name: input.name || 'Nouveau thème',
    slug: input.slug || (input.name || 'nouveau-theme').toString().toLowerCase().replace(/\s+/g,'-'),
    description: input.description,
    parent: input.parent,
    children: [],
    displayOrder: typeof input.displayOrder === 'number' ? input.displayOrder : store.THEMES.length + 1,
    iconName: input.iconName,
    colorCode: input.colorCode,
    imageUrl: input.imageUrl,
    isFeatured: !!input.isFeatured,
    isActive: input.isActive !== false,
    contentCount: 0,
    seriesCount: 0,
    translations: input.translations,
    aliases: input.aliases,
    createdAt: now,
    updatedAt: now,
  }
  store.THEMES.unshift(t)
  return t
}

export function updateTheme(id: number, patch: Partial<Theme>) {
  const idx = store.THEMES.findIndex(t => t.id === id)
  if (idx === -1) return null
  store.THEMES[idx] = { ...store.THEMES[idx], ...patch, updatedAt: nowISO() }
  return store.THEMES[idx]
}

export function deleteTheme(id: number) {
  const before = store.THEMES.length
  store.THEMES = store.THEMES.filter(t => t.id !== id)
  return store.THEMES.length < before
}

export function listTags({ q, type }: { q?: string | null; type?: string | null }) {
  seedIfEmpty()
  const term = (q || '').toLowerCase().trim()
  let items = [...store.TAGS]
  if (term) items = items.filter(t => t.name.toLowerCase().includes(term) || (t.description || '').toLowerCase().includes(term) || t.slug.toLowerCase().includes(term))
  if (type) items = items.filter(t => (t as any).type === type)
  return items
}

export function createTag(input: Partial<Tag>) {
  const now = nowISO()
  const t: Tag = {
    id: store.tagIdSeq++,
    name: input.name || 'Nouveau tag',
    slug: input.slug || (input.name || 'nouveau-tag').toString().toLowerCase().replace(/\s+/g,'-'),
    description: input.description,
    type: (input.type as any) || TagType.TOPIC,
    colorCode: input.colorCode,
    isFeatured: !!input.isFeatured,
    isActive: input.isActive !== false,
    usageCount: 0,
    aliases: input.aliases,
    createdAt: now,
    updatedAt: now,
  }
  store.TAGS.unshift(t)
  return t
}

export function updateTag(id: number, patch: Partial<Tag>) {
  const idx = store.TAGS.findIndex(t => t.id === id)
  if (idx === -1) return null
  store.TAGS[idx] = { ...store.TAGS[idx], ...patch, updatedAt: nowISO() }
  return store.TAGS[idx]
}

export function deleteTag(id: number) {
  const before = store.TAGS.length
  store.TAGS = store.TAGS.filter(t => t.id !== id)
  return store.TAGS.length < before
}
