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
 * Entité ContentRating représentant une note/évaluation donnée à un contenu
 */
@Entity
@Table(name = "content_ratings", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"}),
    indexes = {
        @Index(name = "idx_content_ratings_content", columnList = "content_id"),
        @Index(name = "idx_content_ratings_user", columnList = "user_id"),
        @Index(name = "idx_content_ratings_rating", columnList = "rating"),
        @Index(name = "idx_content_ratings_created_at", columnList = "created_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(name = "is_helpful")
    @Builder.Default
    private Boolean isHelpful = true;

    @Column(name = "helpful_votes")
    @Builder.Default
    private Integer helpfulVotes = 0;

    @Column(name = "unhelpful_votes")
    @Builder.Default
    private Integer unhelpfulVotes = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isValidRating() {
        return rating != null && rating >= 1 && rating <= 5;
    }

    public boolean isPositiveRating() {
        return rating != null && rating >= 4;
    }

    public boolean isNegativeRating() {
        return rating != null && rating <= 2;
    }

    public boolean hasReview() {
        return review != null && !review.trim().isEmpty();
    }

    public String getRatingStars() {
        if (rating == null) {
            return "☆☆☆☆☆";
        }
        
        StringBuilder stars = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.append("★");
            } else {
                stars.append("☆");
            }
        }
        return stars.toString();
    }

    public String getRatingDisplayText() {
        if (rating == null) {
            return "Non noté";
        }
        
        return switch (rating) {
            case 1 -> "Très mauvais";
            case 2 -> "Mauvais";
            case 3 -> "Moyen";
            case 4 -> "Bon";
            case 5 -> "Excellent";
            default -> "Non noté";
        };
    }

    public void incrementHelpfulVotes() {
        this.helpfulVotes = (this.helpfulVotes == null ? 0 : this.helpfulVotes) + 1;
    }

    public void incrementUnhelpfulVotes() {
        this.unhelpfulVotes = (this.unhelpfulVotes == null ? 0 : this.unhelpfulVotes) + 1;
    }

    public double getHelpfulnessRatio() {
        int total = (helpfulVotes == null ? 0 : helpfulVotes) + (unhelpfulVotes == null ? 0 : unhelpfulVotes);
        if (total == 0) {
            return 0.0;
        }
        return (double) (helpfulVotes == null ? 0 : helpfulVotes) / total;
    }

    public boolean isHighlyRated() {
        return isPositiveRating() && getHelpfulnessRatio() >= 0.7;
    }
}
