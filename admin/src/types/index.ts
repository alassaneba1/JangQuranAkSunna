// Base API types for JangQuranAkSunna Admin

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  roles: UserRole[];
  lang: string;
  country?: string;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  profilePictureUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  TEACHER = 'TEACHER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export interface Teacher {
  id: number;
  user?: User;
  displayName: string;
  bio?: string;
  languages: string[];
  specializations: string[];
  links: string[];
  verified: boolean;
  status: TeacherStatus;
  verificationNotes?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  birthYear?: number;
  nationality?: string;
  educationBackground?: string;
  currentPosition?: string;
  socialMediaYoutube?: string;
  socialMediaTelegram?: string;
  socialMediaFacebook?: string;
  socialMediaTwitter?: string;
  socialMediaInstagram?: string;
  websiteUrl?: string;
  followersCount: number;
  totalContentCount: number;
  totalViews: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export enum TeacherStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export interface Mosque {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  websiteUrl?: string;
  facebookPage?: string;
  instagramPage?: string;
  twitterPage?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  foundedYear?: number;
  capacity?: number;
  imamName?: string;
  architecturalStyle?: string;
  verified: boolean;
  status: MosqueStatus;
  followersCount: number;
  contentCount: number;
  eventsCount: number;
  prayerTimes?: string;
  services: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export enum MosqueStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface Theme {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: Theme;
  children?: Theme[];
  displayOrder: number;
  iconName?: string;
  colorCode?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  contentCount: number;
  seriesCount: number;
  translations?: ThemeTranslation[];
  aliases?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ThemeTranslation {
  language: string;
  translatedName: string;
  translatedDescription?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: TagType;
  colorCode?: string;
  isFeatured: boolean;
  isActive: boolean;
  usageCount: number;
  aliases?: string[];
  createdAt: string;
  updatedAt: string;
}

export enum TagType {
  CONTENT = 'CONTENT',
  TOPIC = 'TOPIC',
  DIFFICULTY = 'DIFFICULTY',
  LANGUAGE = 'LANGUAGE',
  FORMAT = 'FORMAT',
  AUDIENCE = 'AUDIENCE',
  OCCASION = 'OCCASION',
  SCHOLARLY = 'SCHOLARLY',
  PRACTICAL = 'PRACTICAL',
  HISTORICAL = 'HISTORICAL',
  MODERN = 'MODERN',
}

export interface Series {
  id: number;
  title: string;
  description?: string;
  teacher: Teacher;
  mosque?: Mosque;
  lang: string;
  status: SeriesStatus;
  coverImageUrl?: string;
  isFeatured: boolean;
  isComplete: boolean;
  contentCount: number;
  totalDurationSeconds: number;
  viewsCount: number;
  followersCount: number;
  publishedAt?: string;
  themes: Theme[];
  createdAt: string;
  updatedAt: string;
}

export enum SeriesStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  PRIVATE = 'PRIVATE',
}

export interface Content {
  id: number;
  type: ContentType;
  title: string;
  description?: string;
  teacher: Teacher;
  mosque?: Mosque;
  series?: Series;
  seriesOrder?: number;
  lang: string;
  durationSeconds?: number;
  status: ContentStatus;
  publishedAt?: string;
  sourceType?: SourceType;
  sourceUrl?: string;
  sourceMetadata?: string;
  thumbnailUrl?: string;
  waveformData?: string;
  viewsCount: number;
  downloadsCount: number;
  likesCount: number;
  favoritesCount: number;
  reportsCount: number;
  downloadEnabled: boolean;
  downloadRequiresAuth: boolean;
  offlineExpirationDays?: number;
  contentHash?: string;
  perceptualHash?: string;
  quranReferences?: string;
  hadithReferences?: string;
  hasTranscript: boolean;
  transcriptLang?: string;
  hasTranslation: boolean;
  translationLang?: string;
  assets?: ContentAsset[];
  chapters?: ContentChapter[];
  tags?: ContentTag[];
  createdAt: string;
  updatedAt: string;
}

export enum ContentType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  PDF = 'PDF',
  EBOOK = 'EBOOK',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
  FLAGGED = 'FLAGGED',
  PRIVATE = 'PRIVATE',
}

export enum SourceType {
  UPLOAD = 'UPLOAD',
  YOUTUBE = 'YOUTUBE',
  TELEGRAM = 'TELEGRAM',
  URL = 'URL',
  API = 'API',
  MIGRATION = 'MIGRATION',
}

export interface ContentAsset {
  id: number;
  contentId: number;
  kind: AssetKind;
  url: string;
  format?: string;
  fileSize?: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  bitrate?: number;
  qualityLevel?: string;
  checksum?: string;
  mimeType?: string;
  encoding?: string;
  isEncrypted: boolean;
  encryptionKeyId?: string;
  language?: string;
  isDefault: boolean;
  processingStatus: ProcessingStatus;
  processingError?: string;
  processingProgress?: number;
  createdAt: string;
  updatedAt: string;
}

export enum AssetKind {
  MASTER = 'MASTER',
  HLS_MANIFEST = 'HLS_MANIFEST',
  HLS_SEGMENT = 'HLS_SEGMENT',
  DASH_MANIFEST = 'DASH_MANIFEST',
  DASH_SEGMENT = 'DASH_SEGMENT',
  THUMBNAIL = 'THUMBNAIL',
  POSTER = 'POSTER',
  WAVEFORM = 'WAVEFORM',
  SUBTITLE = 'SUBTITLE',
  TRANSCRIPT = 'TRANSCRIPT',
  PDF = 'PDF',
  AUDIO_LOW = 'AUDIO_LOW',
  AUDIO_MEDIUM = 'AUDIO_MEDIUM',
  AUDIO_HIGH = 'AUDIO_HIGH',
  VIDEO_LOW = 'VIDEO_LOW',
  VIDEO_MEDIUM = 'VIDEO_MEDIUM',
  VIDEO_HIGH = 'VIDEO_HIGH',
  SPRITE = 'SPRITE',
  PREVIEW = 'PREVIEW',
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface ContentChapter {
  id: number;
  contentId: number;
  startMs: number;
  endMs?: number;
  title: string;
  description?: string;
  chapterOrder?: number;
  quranReference?: string;
  hadithReference?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentTag {
  id: number;
  content: Content;
  tag: Tag;
  theme?: Theme;
  relevanceScore: number;
  isPrimary: boolean;
  addedByUserId?: number;
  source: TagSource;
  confidenceScore?: number;
  createdAt: string;
}

export enum TagSource {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  IMPORT = 'IMPORT',
  SUGGESTED = 'SUGGESTED',
  COMMUNITY = 'COMMUNITY',
  MODERATOR = 'MODERATOR',
}

export interface Donation {
  id: number;
  user?: User;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  paymentProviderId?: string;
  paymentIntentId?: string;
  transactionId?: string;
  receiptNo?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  dedicationMessage?: string;
  dedicationTo?: string;
  type: DonationType;
  targetContent?: Content;
  targetTeacher?: Teacher;
  targetMosque?: Mosque;
  platformFee?: number;
  paymentFee?: number;
  netAmount?: number;
  processedAt?: string;
  failedAt?: string;
  failureReason?: string;
  refundedAt?: string;
  refundReason?: string;
  receiptSentAt?: string;
  thankYouSentAt?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  ORANGE_MONEY = 'ORANGE_MONEY',
  WAVE = 'WAVE',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
}

export enum DonationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum DonationType {
  GENERAL = 'GENERAL',
  CONTENT = 'CONTENT',
  TEACHER = 'TEACHER',
  MOSQUE = 'MOSQUE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MAINTENANCE = 'MAINTENANCE',
  DEVELOPMENT = 'DEVELOPMENT',
  SPECIAL_PROJECT = 'SPECIAL_PROJECT',
}

export enum RecurringFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface ContentReport {
  id: number;
  content: Content;
  user?: User;
  reason: ReportReason;
  note?: string;
  status: ReportStatus;
  reporterEmail?: string;
  reporterName?: string;
  reviewedBy?: User;
  reviewedAt?: string;
  reviewNotes?: string;
  moderatorAction?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  MISINFORMATION = 'MISINFORMATION',
  HATE_SPEECH = 'HATE_SPEECH',
  SPAM = 'SPAM',
  VIOLENCE = 'VIOLENCE',
  HARASSMENT = 'HARASSMENT',
  FAKE_CONTENT = 'FAKE_CONTENT',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  DUPLICATE_CONTENT = 'DUPLICATE_CONTENT',
  WRONG_CATEGORY = 'WRONG_CATEGORY',
  POOR_QUALITY = 'POOR_QUALITY',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ContentForm {
  title: string;
  description?: string;
  teacherId: number;
  mosqueId?: number;
  seriesId?: number;
  lang: string;
  type: ContentType;
  status: ContentStatus;
  downloadEnabled: boolean;
  downloadRequiresAuth: boolean;
  offlineExpirationDays?: number;
  quranReferences?: string;
  hadithReferences?: string;
  tagIds: number[];
  themeIds: number[];
}

export interface TeacherForm {
  displayName: string;
  bio?: string;
  languages: string[];
  specializations: string[];
  verified: boolean;
  status: TeacherStatus;
  verificationNotes?: string;
  nationality?: string;
  educationBackground?: string;
  currentPosition?: string;
  socialMediaYoutube?: string;
  socialMediaTelegram?: string;
  socialMediaFacebook?: string;
  socialMediaTwitter?: string;
  socialMediaInstagram?: string;
  websiteUrl?: string;
}

export interface MosqueForm {
  name: string;
  description?: string;
  address?: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  websiteUrl?: string;
  facebookPage?: string;
  instagramPage?: string;
  twitterPage?: string;
  foundedYear?: number;
  capacity?: number;
  imamName?: string;
  architecturalStyle?: string;
  verified: boolean;
  status: MosqueStatus;
  services: string[];
  languages: string[];
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  timestamp: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FilterState {
  search?: string;
  status?: string;
  type?: string;
  language?: string;
  teacher?: number;
  mosque?: number;
  theme?: number;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Dashboard statistics
export interface DashboardStats {
  totalContents: number;
  totalTeachers: number;
  totalMosques: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  totalDonations: number;
  pendingReports: number;
  contentsByType: { type: ContentType; count: number }[];
  contentsByStatus: { status: ContentStatus; count: number }[];
  topTeachers: { teacher: Teacher; views: number }[];
  topMosques: { mosque: Mosque; contents: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'content_published' | 'teacher_verified' | 'report_submitted' | 'donation_received';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
