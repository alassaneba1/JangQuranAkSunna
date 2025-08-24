package org.jangquranaksunna.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entité Content représentant un contenu (audio, vidéo, texte, PDF) sur la plateforme
 */
@Entity
@Table(name = "contents", indexes = {
    @Index(name = "idx_contents_type", columnList = "type"),
    @Index(name = "idx_contents_status", columnList = "status"),
    @Index(name = "idx_contents_published_at", columnList = "published_at"),
    @Index(name = "idx_contents_teacher", columnList = "teacher_id"),
    @Index(name = "idx_contents_series", columnList = "series_id"),
    @Index(name = "idx_contents_lang", columnList = "lang"),
    @Index(name = "idx_contents_views", columnList = "views_count"),
    @Index(name = "idx_contents_downloads", columnList = "downloads_count")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType type;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mosque_id")
    private Mosque mosque;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "series_order")
    private Integer seriesOrder;

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String lang = "fr";

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type")
    private SourceType sourceType;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @Column(name = "source_metadata", columnDefinition = "TEXT")
    private String sourceMetadata;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "waveform_data", columnDefinition = "TEXT")
    private String waveformData;

    // Statistiques
    @Column(name = "views_count")
    @Builder.Default
    private Long viewsCount = 0L;

    @Column(name = "downloads_count")
    @Builder.Default
    private Long downloadsCount = 0L;

    @Column(name = "likes_count")
    @Builder.Default
    private Long likesCount = 0L;

    @Column(name = "favorites_count")
    @Builder.Default
    private Long favoritesCount = 0L;

    @Column(name = "reports_count")
    @Builder.Default
    private Long reportsCount = 0L;

    // Paramètres de téléchargement
    @Column(name = "download_enabled")
    @Builder.Default
    private Boolean downloadEnabled = true;

    @Column(name = "download_requires_auth")
    @Builder.Default
    private Boolean downloadRequiresAuth = false;

    @Column(name = "offline_expiration_days")
    private Integer offlineExpirationDays;

    // Hashes pour déduplication
    @Column(name = "content_hash", length = 64)
    private String contentHash;

    @Column(name = "perceptual_hash", length = 32)
    private String perceptualHash;

    // Références Coran/Hadith
    @Column(name = "quran_references", columnDefinition = "TEXT")
    private String quranReferences;

    @Column(name = "hadith_references", columnDefinition = "TEXT")
    private String hadithReferences;

    // Métadonnées de transcription/traduction
    @Column(name = "has_transcript")
    @Builder.Default
    private Boolean hasTranscript = false;

    @Column(name = "transcript_lang", length = 10)
    private String transcriptLang;

    @Column(name = "has_translation")
    @Builder.Default
    private Boolean hasTranslation = false;

    @Column(name = "translation_lang", length = 10)
    private String translationLang;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentAsset> assets;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentChapter> chapters;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentTag> tags;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserFavorite> favorites;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserProgress> userProgress;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentReport> reports;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentRating> ratings;

    // Enums
    public enum ContentType {
        AUDIO,    // Fichier audio (MP3, AAC, etc.)
        VIDEO,    // Fichier vidéo (MP4, WebM, etc.)
        TEXT,     // Article/texte
        PDF,      // Document PDF
        EBOOK     // Livre électronique
    }

    public enum ContentStatus {
        DRAFT,           // Brouillon
        PENDING_REVIEW,  // En attente de modération
        APPROVED,        // Approuvé, prêt à publier
        PUBLISHED,       // Publié
        REJECTED,        // Rejeté par la modération
        ARCHIVED,        // Archivé
        FLAGGED,         // Signalé, nécessite révision
        PRIVATE          // Privé (visible uniquement par l'auteur)
    }

    public enum SourceType {
        UPLOAD,      // Upload direct
        YOUTUBE,     // Import depuis YouTube
        TELEGRAM,    // Import depuis Telegram
        URL,         // Import depuis URL
        API,         // Import via API
        MIGRATION    // Migration de données
    }

    // Helper methods
    public void incrementViews() {
        this.viewsCount = (this.viewsCount == null ? 0 : this.viewsCount) + 1;
    }

    public void incrementDownloads() {
        this.downloadsCount = (this.downloadsCount == null ? 0 : this.downloadsCount) + 1;
    }

    public void incrementLikes() {
        this.likesCount = (this.likesCount == null ? 0 : this.likesCount) + 1;
    }

    public void decrementLikes() {
        this.likesCount = Math.max(0, (this.likesCount == null ? 0 : this.likesCount) - 1);
    }

    public void incrementFavorites() {
        this.favoritesCount = (this.favoritesCount == null ? 0 : this.favoritesCount) + 1;
    }

    public void decrementFavorites() {
        this.favoritesCount = Math.max(0, (this.favoritesCount == null ? 0 : this.favoritesCount) - 1);
    }

    public void incrementReports() {
        this.reportsCount = (this.reportsCount == null ? 0 : this.reportsCount) + 1;
    }

    public boolean isPublished() {
        return status == ContentStatus.PUBLISHED && publishedAt != null;
    }

    public boolean canBeDownloaded() {
        return downloadEnabled && isPublished();
    }

    public boolean requiresAuth() {
        return downloadRequiresAuth;
    }

    public boolean isVideo() {
        return type == ContentType.VIDEO;
    }

    public boolean isAudio() {
        return type == ContentType.AUDIO;
    }

    public boolean isPdf() {
        return type == ContentType.PDF || type == ContentType.EBOOK;
    }

    public boolean isText() {
        return type == ContentType.TEXT;
    }

    public String getDurationFormatted() {
        if (durationSeconds == null || durationSeconds <= 0) {
            return "00:00";
        }
        
        int hours = durationSeconds / 3600;
        int minutes = (durationSeconds % 3600) / 60;
        int seconds = durationSeconds % 60;
        
        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }
}
