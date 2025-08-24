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
 * Entité UserProgress représentant la progression d'un utilisateur sur un contenu
 */
@Entity
@Table(name = "user_progress", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"}),
    indexes = {
        @Index(name = "idx_user_progress_user", columnList = "user_id"),
        @Index(name = "idx_user_progress_content", columnList = "content_id"),
        @Index(name = "idx_user_progress_updated_at", columnList = "updated_at"),
        @Index(name = "idx_user_progress_completed", columnList = "completed")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "progress_seconds")
    @Builder.Default
    private Integer progressSeconds = 0;

    @Column(name = "total_seconds")
    private Integer totalSeconds;

    @Column(name = "progress_percentage")
    @Builder.Default
    private Double progressPercentage = 0.0;

    @Column(name = "completed")
    @Builder.Default
    private Boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "watch_count")
    @Builder.Default
    private Integer watchCount = 1;

    @Column(name = "last_position_seconds")
    @Builder.Default
    private Integer lastPositionSeconds = 0;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public void updateProgress(Integer currentSeconds, Integer totalDuration) {
        if (currentSeconds == null || totalDuration == null || totalDuration <= 0) {
            return;
        }

        this.progressSeconds = currentSeconds;
        this.totalSeconds = totalDuration;
        this.lastPositionSeconds = currentSeconds;
        this.progressPercentage = (double) currentSeconds / totalDuration * 100.0;

        // Consider completed if progress is >= 90% or within 30 seconds of end
        if (this.progressPercentage >= 90.0 || (totalDuration - currentSeconds) <= 30) {
            if (!this.completed) {
                this.completed = true;
                this.completedAt = LocalDateTime.now();
            }
        }
    }

    public void markCompleted() {
        this.completed = true;
        this.completedAt = LocalDateTime.now();
        this.progressPercentage = 100.0;
        
        if (this.totalSeconds != null) {
            this.progressSeconds = this.totalSeconds;
            this.lastPositionSeconds = this.totalSeconds;
        }
    }

    public void incrementWatchCount() {
        this.watchCount = (this.watchCount == null ? 0 : this.watchCount) + 1;
    }

    public boolean isStarted() {
        return progressSeconds != null && progressSeconds > 0;
    }

    public boolean isHalfway() {
        return progressPercentage != null && progressPercentage >= 50.0;
    }

    public boolean isNearlyComplete() {
        return progressPercentage != null && progressPercentage >= 80.0;
    }

    public String getProgressFormatted() {
        if (progressSeconds == null || totalSeconds == null) {
            return "00:00 / 00:00";
        }

        return formatDuration(progressSeconds) + " / " + formatDuration(totalSeconds);
    }

    private String formatDuration(int seconds) {
        int hours = seconds / 3600;
        int minutes = (seconds % 3600) / 60;
        int secs = seconds % 60;

        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, secs);
        } else {
            return String.format("%02d:%02d", minutes, secs);
        }
    }

    public String getProgressPercentageFormatted() {
        if (progressPercentage == null) {
            return "0%";
        }
        return String.format("%.1f%%", progressPercentage);
    }
}
