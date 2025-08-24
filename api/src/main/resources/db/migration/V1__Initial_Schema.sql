-- JangQuranAkSunna Database Schema V1.0
-- Initial migration creating all tables for the Islamic teaching platform

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    lang VARCHAR(10) NOT NULL DEFAULT 'fr',
    country VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    two_factor_secret VARCHAR(255),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    profile_picture_url VARCHAR(500),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Mosques table
CREATE TABLE mosques (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    phone_number VARCHAR(50),
    email VARCHAR(255),
    website_url VARCHAR(500),
    facebook_page VARCHAR(500),
    instagram_page VARCHAR(500),
    twitter_page VARCHAR(500),
    image_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    founded_year INTEGER,
    capacity INTEGER,
    imam_name VARCHAR(200),
    architectural_style VARCHAR(100),
    verified BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    followers_count BIGINT NOT NULL DEFAULT 0,
    content_count BIGINT NOT NULL DEFAULT 0,
    events_count BIGINT NOT NULL DEFAULT 0,
    prayer_times TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Mosque services table
CREATE TABLE mosque_services (
    mosque_id BIGINT NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
    service VARCHAR(100) NOT NULL,
    PRIMARY KEY (mosque_id, service)
);

-- Mosque languages table
CREATE TABLE mosque_languages (
    mosque_id BIGINT NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    PRIMARY KEY (mosque_id, language)
);

-- Teachers table
CREATE TABLE teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(200) NOT NULL,
    bio TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    profile_image_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    birth_year INTEGER,
    nationality VARCHAR(100),
    education_background TEXT,
    current_position VARCHAR(200),
    social_media_youtube VARCHAR(500),
    social_media_telegram VARCHAR(500),
    social_media_facebook VARCHAR(500),
    social_media_twitter VARCHAR(500),
    social_media_instagram VARCHAR(500),
    website_url VARCHAR(500),
    followers_count BIGINT NOT NULL DEFAULT 0,
    total_content_count BIGINT NOT NULL DEFAULT 0,
    total_views BIGINT NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Teacher languages table
CREATE TABLE teacher_languages (
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    PRIMARY KEY (teacher_id, language)
);

-- Teacher specializations table
CREATE TABLE teacher_specializations (
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    PRIMARY KEY (teacher_id, specialization)
);

-- Teacher links table
CREATE TABLE teacher_links (
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    link VARCHAR(500) NOT NULL
);

-- Teacher mosques relation table
CREATE TABLE teacher_mosques (
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    mosque_id BIGINT NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, mosque_id)
);

-- Themes table
CREATE TABLE themes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT REFERENCES themes(id) ON DELETE SET NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    icon_name VARCHAR(100),
    color_code VARCHAR(7),
    image_url VARCHAR(500),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    content_count BIGINT NOT NULL DEFAULT 0,
    series_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Theme translations table
CREATE TABLE theme_translations (
    theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    translated_name VARCHAR(200) NOT NULL,
    translated_description TEXT,
    PRIMARY KEY (theme_id, language)
);

-- Theme aliases table
CREATE TABLE theme_aliases (
    theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    alias VARCHAR(200) NOT NULL
);

-- Tags table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'CONTENT',
    color_code VARCHAR(7),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    usage_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tag aliases table
CREATE TABLE tag_aliases (
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    alias VARCHAR(100) NOT NULL
);

-- Series table
CREATE TABLE series (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    mosque_id BIGINT REFERENCES mosques(id) ON DELETE SET NULL,
    lang VARCHAR(10) NOT NULL DEFAULT 'fr',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    cover_image_url VARCHAR(500),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_complete BOOLEAN NOT NULL DEFAULT false,
    content_count INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds BIGINT NOT NULL DEFAULT 0,
    views_count BIGINT NOT NULL DEFAULT 0,
    followers_count BIGINT NOT NULL DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Series themes relation table
CREATE TABLE series_themes (
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    theme_id BIGINT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, theme_id)
);

-- Contents table
CREATE TABLE contents (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    mosque_id BIGINT REFERENCES mosques(id) ON DELETE SET NULL,
    series_id BIGINT REFERENCES series(id) ON DELETE SET NULL,
    series_order INTEGER,
    lang VARCHAR(10) NOT NULL DEFAULT 'fr',
    duration_seconds INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP,
    source_type VARCHAR(50),
    source_url VARCHAR(1000),
    source_metadata TEXT,
    thumbnail_url VARCHAR(500),
    waveform_data TEXT,
    views_count BIGINT NOT NULL DEFAULT 0,
    downloads_count BIGINT NOT NULL DEFAULT 0,
    likes_count BIGINT NOT NULL DEFAULT 0,
    favorites_count BIGINT NOT NULL DEFAULT 0,
    reports_count BIGINT NOT NULL DEFAULT 0,
    download_enabled BOOLEAN NOT NULL DEFAULT true,
    download_requires_auth BOOLEAN NOT NULL DEFAULT false,
    offline_expiration_days INTEGER,
    content_hash VARCHAR(64),
    perceptual_hash VARCHAR(32),
    quran_references TEXT,
    hadith_references TEXT,
    has_transcript BOOLEAN NOT NULL DEFAULT false,
    transcript_lang VARCHAR(10),
    has_translation BOOLEAN NOT NULL DEFAULT false,
    translation_lang VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content assets table
CREATE TABLE content_assets (
    id BIGSERIAL PRIMARY KEY,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    kind VARCHAR(50) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    format VARCHAR(50),
    file_size BIGINT,
    duration_seconds INTEGER,
    width INTEGER,
    height INTEGER,
    bitrate INTEGER,
    quality_level VARCHAR(20),
    checksum VARCHAR(64),
    mime_type VARCHAR(100),
    encoding VARCHAR(50),
    is_encrypted BOOLEAN NOT NULL DEFAULT false,
    encryption_key_id VARCHAR(100),
    language VARCHAR(10),
    is_default BOOLEAN NOT NULL DEFAULT false,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    processing_error TEXT,
    processing_progress INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content chapters table
CREATE TABLE content_chapters (
    id BIGSERIAL PRIMARY KEY,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    start_ms BIGINT NOT NULL,
    end_ms BIGINT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    chapter_order INTEGER,
    quran_ref VARCHAR(200),
    hadith_ref VARCHAR(200),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content tags relation table
CREATE TABLE content_tags (
    id BIGSERIAL PRIMARY KEY,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    theme_id BIGINT REFERENCES themes(id) ON DELETE SET NULL,
    relevance_score DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    added_by_user_id BIGINT,
    source VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    confidence_score DECIMAL(3, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (content_id, tag_id)
);

-- User favorites table
CREATE TABLE user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, content_id)
);

-- User progress table
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    series_id BIGINT REFERENCES series(id) ON DELETE SET NULL,
    progress_seconds INTEGER NOT NULL DEFAULT 0,
    total_seconds INTEGER,
    progress_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP,
    watch_count INTEGER NOT NULL DEFAULT 1,
    last_position_seconds INTEGER NOT NULL DEFAULT 0,
    device_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, content_id)
);

-- Teacher followers table
CREATE TABLE teacher_followers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, teacher_id)
);

-- Series subscriptions table
CREATE TABLE series_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, series_id)
);

-- Mosque followers table
CREATE TABLE mosque_followers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mosque_id BIGINT NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, mosque_id)
);

-- Content reports table
CREATE TABLE content_reports (
    id BIGSERIAL PRIMARY KEY,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL,
    note TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reporter_email VARCHAR(255),
    reporter_name VARCHAR(200),
    reviewed_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    moderator_action VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content ratings table
CREATE TABLE content_ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    is_helpful BOOLEAN NOT NULL DEFAULT true,
    helpful_votes INTEGER NOT NULL DEFAULT 0,
    unhelpful_votes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, content_id)
);

-- Donations table
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'XOF',
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_provider_id VARCHAR(100),
    payment_intent_id VARCHAR(100),
    transaction_id VARCHAR(100),
    receipt_no VARCHAR(50) UNIQUE,
    donor_name VARCHAR(200),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(50),
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_frequency VARCHAR(50),
    dedication_message TEXT,
    dedication_to VARCHAR(200),
    type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    target_content_id BIGINT REFERENCES contents(id) ON DELETE SET NULL,
    target_teacher_id BIGINT REFERENCES teachers(id) ON DELETE SET NULL,
    target_mosque_id BIGINT REFERENCES mosques(id) ON DELETE SET NULL,
    platform_fee DECIMAL(10, 2),
    payment_fee DECIMAL(10, 2),
    net_amount DECIMAL(10, 2),
    processed_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason TEXT,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    receipt_sent_at TIMESTAMP,
    thank_you_sent_at TIMESTAMP,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
