-- JangQuranAkSunna Database Indexes and Constraints V2.0
-- Adding performance indexes and additional constraints

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_lang ON users(lang);
CREATE INDEX idx_users_oauth_provider ON users(oauth_provider);

-- Mosques indexes
CREATE INDEX idx_mosques_name ON mosques(name);
CREATE INDEX idx_mosques_city ON mosques(city);
CREATE INDEX idx_mosques_country ON mosques(country);
CREATE INDEX idx_mosques_verified ON mosques(verified);
CREATE INDEX idx_mosques_status ON mosques(status);
CREATE INDEX idx_mosques_location ON mosques(latitude, longitude);

-- Teachers indexes
CREATE INDEX idx_teachers_display_name ON teachers(display_name);
CREATE INDEX idx_teachers_verified ON teachers(verified);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_teachers_followers_count ON teachers(followers_count);
CREATE INDEX idx_teachers_total_views ON teachers(total_views);

-- Themes indexes
CREATE INDEX idx_themes_name ON themes(name);
CREATE INDEX idx_themes_parent ON themes(parent_id);
CREATE INDEX idx_themes_slug ON themes(slug);
CREATE INDEX idx_themes_display_order ON themes(display_order);
CREATE INDEX idx_themes_is_featured ON themes(is_featured);
CREATE INDEX idx_themes_is_active ON themes(is_active);

-- Tags indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_type ON tags(type);
CREATE INDEX idx_tags_usage_count ON tags(usage_count);
CREATE INDEX idx_tags_is_featured ON tags(is_featured);
CREATE INDEX idx_tags_is_active ON tags(is_active);

-- Series indexes
CREATE INDEX idx_series_title ON series(title);
CREATE INDEX idx_series_status ON series(status);
CREATE INDEX idx_series_teacher ON series(teacher_id);
CREATE INDEX idx_series_mosque ON series(mosque_id);
CREATE INDEX idx_series_lang ON series(lang);
CREATE INDEX idx_series_created_at ON series(created_at);
CREATE INDEX idx_series_published_at ON series(published_at);
CREATE INDEX idx_series_is_featured ON series(is_featured);
CREATE INDEX idx_series_views_count ON series(views_count);

-- Contents indexes
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_published_at ON contents(published_at);
CREATE INDEX idx_contents_teacher ON contents(teacher_id);
CREATE INDEX idx_contents_mosque ON contents(mosque_id);
CREATE INDEX idx_contents_series ON contents(series_id);
CREATE INDEX idx_contents_lang ON contents(lang);
CREATE INDEX idx_contents_views ON contents(views_count);
CREATE INDEX idx_contents_downloads ON contents(downloads_count);
CREATE INDEX idx_contents_likes ON contents(likes_count);
CREATE INDEX idx_contents_favorites ON contents(favorites_count);
CREATE INDEX idx_contents_created_at ON contents(created_at);
CREATE INDEX idx_contents_title ON contents USING gin(to_tsvector('french', title));
CREATE INDEX idx_contents_description ON contents USING gin(to_tsvector('french', description));
CREATE INDEX idx_contents_hash ON contents(content_hash);
CREATE INDEX idx_contents_source_type ON contents(source_type);

-- Content assets indexes
CREATE INDEX idx_content_assets_content ON content_assets(content_id);
CREATE INDEX idx_content_assets_kind ON content_assets(kind);
CREATE INDEX idx_content_assets_format ON content_assets(format);
CREATE INDEX idx_content_assets_processing_status ON content_assets(processing_status);
CREATE INDEX idx_content_assets_quality_level ON content_assets(quality_level);

-- Content chapters indexes
CREATE INDEX idx_content_chapters_content ON content_chapters(content_id);
CREATE INDEX idx_content_chapters_start_ms ON content_chapters(start_ms);
CREATE INDEX idx_content_chapters_order ON content_chapters(chapter_order);

-- Content tags indexes
CREATE INDEX idx_content_tags_content ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag ON content_tags(tag_id);
CREATE INDEX idx_content_tags_theme ON content_tags(theme_id);
CREATE INDEX idx_content_tags_relevance ON content_tags(relevance_score);
CREATE INDEX idx_content_tags_source ON content_tags(source);

-- User favorites indexes
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_content ON user_favorites(content_id);
CREATE INDEX idx_user_favorites_created_at ON user_favorites(created_at);

-- User progress indexes
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_series ON user_progress(series_id);
CREATE INDEX idx_user_progress_updated_at ON user_progress(updated_at);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);
CREATE INDEX idx_user_progress_percentage ON user_progress(progress_percentage);

-- Teacher followers indexes
CREATE INDEX idx_teacher_followers_user ON teacher_followers(user_id);
CREATE INDEX idx_teacher_followers_teacher ON teacher_followers(teacher_id);
CREATE INDEX idx_teacher_followers_created_at ON teacher_followers(created_at);

-- Series subscriptions indexes
CREATE INDEX idx_series_subscriptions_user ON series_subscriptions(user_id);
CREATE INDEX idx_series_subscriptions_series ON series_subscriptions(series_id);
CREATE INDEX idx_series_subscriptions_created_at ON series_subscriptions(created_at);

-- Mosque followers indexes
CREATE INDEX idx_mosque_followers_user ON mosque_followers(user_id);
CREATE INDEX idx_mosque_followers_mosque ON mosque_followers(mosque_id);
CREATE INDEX idx_mosque_followers_created_at ON mosque_followers(created_at);

-- Content reports indexes
CREATE INDEX idx_content_reports_content ON content_reports(content_id);
CREATE INDEX idx_content_reports_user ON content_reports(user_id);
CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_reason ON content_reports(reason);
CREATE INDEX idx_content_reports_created_at ON content_reports(created_at);

-- Content ratings indexes
CREATE INDEX idx_content_ratings_content ON content_ratings(content_id);
CREATE INDEX idx_content_ratings_user ON content_ratings(user_id);
CREATE INDEX idx_content_ratings_rating ON content_ratings(rating);
CREATE INDEX idx_content_ratings_created_at ON content_ratings(created_at);
CREATE INDEX idx_content_ratings_helpful ON content_ratings(helpful_votes);

-- Donations indexes
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_method ON donations(payment_method);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_receipt_no ON donations(receipt_no);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_amount ON donations(amount);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mosques_updated_at BEFORE UPDATE ON mosques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at BEFORE UPDATE ON series
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_assets_updated_at BEFORE UPDATE ON content_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_chapters_updated_at BEFORE UPDATE ON content_chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_reports_updated_at BEFORE UPDATE ON content_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_ratings_updated_at BEFORE UPDATE ON content_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
