package org.jangquranaksunna.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entité UserFavorite représentant un contenu mis en favori par un utilisateur
 */
@Entity
@Table(name = "user_favorites", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"}),
    indexes = {
        @Index(name = "idx_user_favorites_user", columnList = "user_id"),
        @Index(name = "idx_user_favorites_content", columnList = "content_id"),
        @Index(name = "idx_user_favorites_created_at", columnList = "created_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
