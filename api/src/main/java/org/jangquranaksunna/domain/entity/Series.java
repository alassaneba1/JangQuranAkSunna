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
 * Entité Series représentant une série/playlist de contenus
 */
@Entity
@Table(name = "series", indexes = {
    @Index(name = "idx_series_title", columnList = "title"),
    @Index(name = "idx_series_status", columnList = "status"),
    @Index(name = "idx_series_teacher", columnList = "teacher_id"),
    @Index(name = "idx_series_lang", columnList = "lang"),
    @Index(name = "idx_series_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String lang = "fr";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SeriesStatus status = SeriesStatus.DRAFT;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "is_complete")
    @Builder.Default
    private Boolean isComplete = false;

    @Column(name = "content_count")
    @Builder.Default
    private Integer contentCount = 0;

    @Column(name = "total_duration_seconds")
    @Builder.Default
    private Long totalDurationSeconds = 0L;

    @Column(name = "views_count")
    @Builder.Default
    private Long viewsCount = 0L;

    @Column(name = "followers_count")
    @Builder.Default
    private Long followersCount = 0L;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("seriesOrder ASC, publishedAt ASC")
    private Set<Content> contents;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "series_themes",
        joinColumns = @JoinColumn(name = "series_id"),
        inverseJoinColumns = @JoinColumn(name = "theme_id")
    )
    private Set<Theme> themes;

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<SeriesSubscription> subscriptions;

    // Enums
    public enum SeriesStatus {
        DRAFT,           // Brouillon
        PENDING_REVIEW,  // En attente de modération
        PUBLISHED,       // Publié
        ARCHIVED,        // Archivé
        PRIVATE          // Privé
    }

    // Helper methods
    public void incrementContentCount() {
        this.contentCount = (this.contentCount == null ? 0 : this.contentCount) + 1;
    }

    public void decrementContentCount() {
        this.contentCount = Math.max(0, (this.contentCount == null ? 0 : this.contentCount) - 1);
    }

    public void addDuration(Integer seconds) {
        if (seconds != null && seconds > 0) {
            this.totalDurationSeconds = (this.totalDurationSeconds == null ? 0 : this.totalDurationSeconds) + seconds;
        }
    }

    public void subtractDuration(Integer seconds) {
        if (seconds != null && seconds > 0) {
            this.totalDurationSeconds = Math.max(0, (this.totalDurationSeconds == null ? 0 : this.totalDurationSeconds) - seconds);
        }
    }

    public void incrementViews() {
        this.viewsCount = (this.viewsCount == null ? 0 : this.viewsCount) + 1;
    }

    public void incrementFollowers() {
        this.followersCount = (this.followersCount == null ? 0 : this.followersCount) + 1;
    }

    public void decrementFollowers() {
        this.followersCount = Math.max(0, (this.followersCount == null ? 0 : this.followersCount) - 1);
    }

    public boolean isPublished() {
        return status == SeriesStatus.PUBLISHED && publishedAt != null;
    }

    public String getTotalDurationFormatted() {
        if (totalDurationSeconds == null || totalDurationSeconds <= 0) {
            return "00:00";
        }
        
        long hours = totalDurationSeconds / 3600;
        long minutes = (totalDurationSeconds % 3600) / 60;
        long seconds = totalDurationSeconds % 60;
        
        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }
}
