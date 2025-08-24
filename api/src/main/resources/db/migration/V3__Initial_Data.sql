-- JangQuranAkSunna Initial Data V3.0
-- Seeding initial themes, tags, and sample data

-- Insert root themes (Islamic knowledge categories)
INSERT INTO themes (name, slug, description, parent_id, display_order, icon_name, color_code, is_featured, is_active) VALUES
('Coran', 'coran', 'Étude et récitation du Saint Coran', NULL, 1, 'book-open', '#10B981', true, true),
('Tafsir', 'tafsir', 'Exégèse et interprétation du Coran', NULL, 2, 'search', '#3B82F6', true, true),
('Hadith', 'hadith', 'Traditions prophétiques authentiques', NULL, 3, 'scroll', '#8B5CF6', true, true),
('Fiqh', 'fiqh', 'Jurisprudence islamique', NULL, 4, 'scale', '#F59E0B', true, true),
('Aqida', 'aqida', 'Croyance et dogme islamique', NULL, 5, 'heart', '#EF4444', true, true),
('Sîra', 'sira', 'Biographie du Prophète (ﷺ)', NULL, 6, 'user', '#06B6D4', true, true),
('Adab', 'adab', 'Éthique et comportement islamique', NULL, 7, 'users', '#84CC16', true, true),
('Dhikr et Dua', 'dhikr-dua', 'Invocations et rappel d''Allah', NULL, 8, 'moon', '#6366F1', true, true),
('Histoire Islamique', 'histoire-islamique', 'Histoire de l''Islam et des musulmans', NULL, 9, 'clock', '#F97316', true, true),
('Langue Arabe', 'langue-arabe', 'Apprentissage de la langue arabe', NULL, 10, 'globe', '#14B8A6', true, true);

-- Insert sub-themes for Coran
INSERT INTO themes (name, slug, description, parent_id, display_order, is_active) VALUES
('Récitation', 'recitation', 'Apprentissage de la récitation coranique', 1, 1, true),
('Mémorisation', 'memorisation', 'Techniques de mémorisation du Coran', 1, 2, true),
('Règles de Tajwid', 'tajwid', 'Règles de prononciation coranique', 1, 3, true),
('Sciences Coraniques', 'sciences-coraniques', 'Sciences liées au Coran', 1, 4, true);

-- Insert sub-themes for Fiqh
INSERT INTO themes (name, slug, description, parent_id, display_order, is_active) VALUES
('Purification', 'purification', 'Règles de purification et ablutions', 4, 1, true),
('Prière', 'priere', 'Jurisprudence de la prière', 4, 2, true),
('Jeûne', 'jeune', 'Règles du jeûne', 4, 3, true),
('Zakat', 'zakat', 'Aumône obligatoire', 4, 4, true),
('Hajj', 'hajj', 'Pèlerinage à La Mecque', 4, 5, true),
('Mariage', 'mariage', 'Règles du mariage en Islam', 4, 6, true),
('Commerce', 'commerce', 'Transactions commerciales islamiques', 4, 7, true);

-- Insert sub-themes for Hadith
INSERT INTO themes (name, slug, description, parent_id, display_order, is_active) VALUES
('Sahih Bukhari', 'sahih-bukhari', 'Recueil de Bukhari', 3, 1, true),
('Sahih Muslim', 'sahih-muslim', 'Recueil de Muslim', 3, 2, true),
('Sunan Abu Dawud', 'sunan-abu-dawud', 'Recueil d''Abu Dawud', 3, 3, true),
('Sunan Tirmidhi', 'sunan-tirmidhi', 'Recueil de Tirmidhi', 3, 4, true),
('Riyadh as-Salihin', 'riyadh-salihin', 'Les Jardins de la Piété', 3, 5, true);

-- Insert content type tags
INSERT INTO tags (name, slug, description, type, color_code, is_featured, is_active) VALUES
('Débutant', 'debutant', 'Contenu pour débutants', 'DIFFICULTY', '#10B981', true, true),
('Intermédiaire', 'intermediaire', 'Contenu niveau intermédiaire', 'DIFFICULTY', '#F59E0B', true, true),
('Avancé', 'avance', 'Contenu niveau avancé', 'DIFFICULTY', '#EF4444', true, true),
('Enfants', 'enfants', 'Contenu adapté aux enfants', 'AUDIENCE', '#8B5CF6', true, true),
('Jeunes', 'jeunes', 'Contenu pour les jeunes', 'AUDIENCE', '#06B6D4', true, true),
('Adultes', 'adultes', 'Contenu pour adultes', 'AUDIENCE', '#6366F1', true, true),
('Ramadan', 'ramadan', 'Contenu spécial Ramadan', 'OCCASION', '#84CC16', true, true),
('Hajj', 'hajj-tag', 'Contenu lié au Hajj', 'OCCASION', '#F97316', true, true),
('Aïd', 'aid', 'Contenu pour les fêtes d''Aïd', 'OCCASION', '#EC4899', true, true),
('Conférence', 'conference', 'Format conférence', 'FORMAT', '#64748B', true, true),
('Cours', 'cours', 'Format cours structuré', 'FORMAT', '#0EA5E9', true, true),
('Débat', 'debat', 'Format débat/discussion', 'FORMAT', '#DC2626', false, true),
('Questions-Réponses', 'questions-reponses', 'Format Q&R', 'FORMAT', '#7C3AED', true, true),
('Prêche', 'preche', 'Prêche du vendredi ou autre', 'FORMAT', '#059669', true, true);

-- Insert sample mosques
INSERT INTO mosques (name, description, city, country, latitude, longitude, verified, status, imam_name) VALUES
('Grande Mosquée de Dakar', 'La plus grande mosquée du Sénégal située au cœur de Dakar', 'Dakar', 'Sénégal', 14.6928, -17.4467, true, 'ACTIVE', 'Imam Mansour Diop'),
('Mosquée Massalikul Jinaan', 'Mosquée moderne inaugurée en 2019 à Dakar', 'Dakar', 'Sénégal', 14.7169, -17.4676, true, 'ACTIVE', 'Imam Ousmane Ba'),
('Mosquée de Touba', 'Centre spirituel de la confrérie mouride', 'Touba', 'Sénégal', 14.8503, -15.8853, true, 'ACTIVE', 'Imam Serigne Mountakha Mbacké'),
('Mosquée de la Divinité', 'Mosquée historique de Saint-Louis', 'Saint-Louis', 'Sénégal', 16.0378, -16.4845, true, 'ACTIVE', 'Imam Abdoulaye Cissé'),
('Mosquée Al-Azhar de Kaolack', 'Grande mosquée de Kaolack', 'Kaolack', 'Sénégal', 14.1522, -16.0772, true, 'ACTIVE', 'Imam Thierno Ba'),
('Grande Mosquée de Paris', 'Mosquée historique de Paris', 'Paris', 'France', 48.8418, 2.3558, true, 'ACTIVE', 'Imam Chems-Eddine Hafiz'),
('Mosquée Hassan II', 'Célèbre mosquée de Casablanca', 'Casablanca', 'Maroc', 33.6084, -7.6326, true, 'ACTIVE', 'Imam Ahmed Koussoum'),
('Grande Mosquée de Lyon', 'Centre islamique de Lyon', 'Lyon', 'France', 45.7485, 4.8467, true, 'ACTIVE', 'Imam Kamel Kabtane');

-- Insert theme translations for Arabic
INSERT INTO theme_translations (theme_id, language, translated_name, translated_description) VALUES
(1, 'ar', 'القرآن', 'دراسة وتلاوة القرآن الكريم'),
(2, 'ar', 'التفسير', 'تفسير وشرح القرآن الكريم'),
(3, 'ar', 'الحديث', 'الأحاديث النبوية الصحيحة'),
(4, 'ar', 'الفقه', 'الفقه الإسلامي'),
(5, 'ar', 'العقيدة', 'العقيدة والإيمان الإسلامي'),
(6, 'ar', 'السيرة', 'سيرة النبي محمد صلى الله عليه وسلم'),
(7, 'ar', 'الأدب', 'الآداب والأخلاق الإسلامية'),
(8, 'ar', 'الذكر والدعاء', 'الأذكار والأدعية'),
(9, 'ar', 'التاريخ الإسلامي', 'تاريخ الإسلام والمسلمين'),
(10, 'ar', 'اللغة العربية', 'تعلم اللغة العربية');

-- Insert theme translations for Wolof
INSERT INTO theme_translations (theme_id, language, translated_name) VALUES
(1, 'wo', 'Alxuraan'),
(2, 'wo', 'Tafsiir'),
(3, 'wo', 'Adiis'),
(4, 'wo', 'Fiqh'),
(5, 'wo', 'Agiida'),
(6, 'wo', 'Siira'),
(7, 'wo', 'Adab'),
(8, 'wo', 'Sikkar ak Dua');

-- Insert theme translations for Pulaar
INSERT INTO theme_translations (theme_id, language, translated_name) VALUES
(1, 'pul', 'Alxuraan'),
(2, 'pul', 'Tafsiir'),
(3, 'pul', 'Adiisu'),
(4, 'pul', 'Fiqhu'),
(5, 'pul', 'Agiida'),
(6, 'pul', 'Siira'),
(7, 'pul', 'Adabu'),
(8, 'pul', 'Sikkar e Dua');

-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO users (email, password_hash, name, lang, status, email_verified, created_at) VALUES
('admin@jangquranaksunna.org', '$2a$10$DYfCz6IYEVBpVH6D5XcOXe7DVLkV8K8I8VJ8K8YLbK8K8ZLcYGkRG', 'Administrateur Principal', 'fr', 'ACTIVE', true, CURRENT_TIMESTAMP);

-- Insert admin roles
INSERT INTO user_roles (user_id, role) VALUES
(1, 'USER'),
(1, 'ADMIN');

-- Update statistics
UPDATE themes SET content_count = 0, series_count = 0;
UPDATE tags SET usage_count = 0;
