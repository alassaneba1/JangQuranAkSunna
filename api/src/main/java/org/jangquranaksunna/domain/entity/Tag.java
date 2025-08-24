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
 * Entité Tag représentant un tag/étiquette pour catégoriser le contenu
 */
@Entity
@Table(name = "tags", indexes = {
    @Index(name = "idx_tags_name", columnList = "name"),
    @Index(name = "idx_tags_slug", columnList = "slug"),
    @Index(name = "idx_tags_type", columnList = "type"),
    @Index(name = "idx_tags_usage_count", columnList = "usage_count")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TagType type = TagType.CONTENT;

    @Column(name = "color_code", length = 7)
    private String colorCode;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "usage_count")
    @Builder.Default
    private Long usageCount = 0L;

    // Synonymes et alias pour améliorer la recherche
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tag_aliases", joinColumns = @JoinColumn(name = "tag_id"))
    @Column(name = "alias", length = 100)
    private Set<String> aliases;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentTag> contentTags;

    // Enums
    public enum TagType {
        CONTENT,        // Tag général de contenu
        TOPIC,          // Sujet spécifique (ex: mariage, hajj, ramadan)
        DIFFICULTY,     // Niveau de difficulté (débutant, intermédiaire, avancé)
        LANGUAGE,       // Langue du contenu
        FORMAT,         // Format spécifique (cours, conférence, débat, etc.)
        AUDIENCE,       // Audience cible (enfants, jeunes, adultes, etc.)
        OCCASION,       // Occasion spéciale (Ramadan, Hajj, Aïd, etc.)
        SCHOLARLY,      // Tag académique/savant
        PRACTICAL,      // Application pratique
        HISTORICAL,     // Contexte historique
        MODERN          // Application moderne/contemporaine
    }

    // Helper methods
    public void incrementUsageCount() {
        this.usageCount = (this.usageCount == null ? 0 : this.usageCount) + 1;
    }

    public void decrementUsageCount() {
        this.usageCount = Math.max(0, (this.usageCount == null ? 0 : this.usageCount) - 1);
    }

    public boolean isPopular() {
        return usageCount != null && usageCount >= 10;
    }

    public boolean isTrending() {
        return usageCount != null && usageCount >= 50;
    }

    // Method to generate slug from name
    public static String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "";
        }
        
        return name.toLowerCase()
            .replaceAll("[àáâäã]", "a")
            .replaceAll("[èéêë]", "e")
            .replaceAll("[ìíîï]", "i")
            .replaceAll("[òóôöõ]", "o")
            .replaceAll("[ùúûü]", "u")
            .replaceAll("[ç]", "c")
            .replaceAll("[ñ]", "n")
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }
}
