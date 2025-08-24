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

/**
 * Entité ContentChapter représentant un chapitre/timecode dans un contenu
 */
@Entity
@Table(name = "content_chapters", indexes = {
    @Index(name = "idx_content_chapters_content", columnList = "content_id"),
    @Index(name = "idx_content_chapters_start_ms", columnList = "start_ms")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentChapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "start_ms", nullable = false)
    private Long startMs;

    @Column(name = "end_ms")
    private Long endMs;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "chapter_order")
    private Integer chapterOrder;

    @Column(name = "quran_ref", length = 200)
    private String quranReference;

    @Column(name = "hadith_ref", length = 200)
    private String hadithReference;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public String getFormattedStartTime() {
        return formatMilliseconds(startMs);
    }

    public String getFormattedEndTime() {
        if (endMs == null) {
            return "";
        }
        return formatMilliseconds(endMs);
    }

    public String getFormattedDuration() {
        if (endMs == null) {
            return "";
        }
        long duration = endMs - startMs;
        return formatMilliseconds(duration);
    }

    private String formatMilliseconds(long ms) {
        long totalSeconds = ms / 1000;
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        } else {
            return String.format("%02d:%02d", minutes, seconds);
        }
    }

    public long getDurationMs() {
        if (endMs == null) {
            return 0;
        }
        return endMs - startMs;
    }
}
