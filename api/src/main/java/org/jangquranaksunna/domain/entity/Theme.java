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
 * Entité Theme représentant un thème/catégorie de contenu
 * Supporte une hiérarchie avec thèmes parents et enfants
 */
@Entity
@Table(name = "themes", indexes = {
    @Index(name = "idx_themes_name", columnList = "name"),
    @Index(name = "idx_themes_parent", columnList = "parent_id"),
    @Index(name = "idx_themes_slug", columnList = "slug"),
    @Index(name = "idx_themes_display_order", columnList = "display_order")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Theme parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC, name ASC")
    private Set<Theme> children;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "icon_name", length = 100)
    private String iconName;

    @Column(name = "color_code", length = 7)
    private String colorCode;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "content_count")
    @Builder.Default
    private Long contentCount = 0L;

    @Column(name = "series_count")
    @Builder.Default
    private Long seriesCount = 0L;

    // Langues dans lesquelles ce thème est traduit
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "theme_translations", joinColumns = @JoinColumn(name = "theme_id"))
    @MapKeyColumn(name = "language")
    @Column(name = "translated_name")
    private Set<ThemeTranslation> translations;

    // Alias/synonymes pour améliorer la recherche
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "theme_aliases", joinColumns = @JoinColumn(name = "theme_id"))
    @Column(name = "alias", length = 200)
    private Set<String> aliases;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @ManyToMany(mappedBy = "themes", fetch = FetchType.LAZY)
    private Set<Series> series;

    @OneToMany(mappedBy = "theme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ContentTag> contentTags;

    // Embeddable class for translations
    @Embeddable
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThemeTranslation {
        @Column(name = "language", length = 10)
        private String language;
        
        @Column(name = "translated_name", length = 200)
        private String translatedName;
        
        @Column(name = "translated_description", columnDefinition = "TEXT")
        private String translatedDescription;
    }

    // Helper methods
    public void incrementContentCount() {
        this.contentCount = (this.contentCount == null ? 0 : this.contentCount) + 1;
        
        // Increment parent's count as well
        if (parent != null) {
            parent.incrementContentCount();
        }
    }

    public void decrementContentCount() {
        this.contentCount = Math.max(0, (this.contentCount == null ? 0 : this.contentCount) - 1);
        
        // Decrement parent's count as well
        if (parent != null) {
            parent.decrementContentCount();
        }
    }

    public void incrementSeriesCount() {
        this.seriesCount = (this.seriesCount == null ? 0 : this.seriesCount) + 1;
        
        // Increment parent's count as well
        if (parent != null) {
            parent.incrementSeriesCount();
        }
    }

    public void decrementSeriesCount() {
        this.seriesCount = Math.max(0, (this.seriesCount == null ? 0 : this.seriesCount) - 1);
        
        // Decrement parent's count as well
        if (parent != null) {
            parent.decrementSeriesCount();
        }
    }

    public boolean isRootTheme() {
        return parent == null;
    }

    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    public boolean isLeafTheme() {
        return !hasChildren();
    }

    public int getLevel() {
        int level = 0;
        Theme current = this.parent;
        while (current != null) {
            level++;
            current = current.parent;
        }
        return level;
    }

    public String getFullPath() {
        if (parent == null) {
            return name;
        }
        return parent.getFullPath() + " > " + name;
    }

    public String getTranslatedName(String language) {
        if (translations == null) {
            return name;
        }
        
        return translations.stream()
            .filter(t -> language.equals(t.getLanguage()))
            .map(ThemeTranslation::getTranslatedName)
            .findFirst()
            .orElse(name);
    }

    public String getTranslatedDescription(String language) {
        if (translations == null) {
            return description;
        }
        
        return translations.stream()
            .filter(t -> language.equals(t.getLanguage()))
            .map(ThemeTranslation::getTranslatedDescription)
            .findFirst()
            .orElse(description);
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
