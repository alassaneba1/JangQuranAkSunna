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
 * Entité Mosque représentant une mosquée sur la plateforme
 */
@Entity
@Table(name = "mosques", indexes = {
    @Index(name = "idx_mosques_name", columnList = "name"),
    @Index(name = "idx_mosques_city", columnList = "city"),
    @Index(name = "idx_mosques_country", columnList = "country"),
    @Index(name = "idx_mosques_verified", columnList = "verified")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mosque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String region;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    // Coordonnées géographiques
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    // Informations de contact
    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "facebook_page", length = 500)
    private String facebookPage;

    @Column(name = "instagram_page", length = 500)
    private String instagramPage;

    @Column(name = "twitter_page", length = 500)
    private String twitterPage;

    // Images
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    // Informations sur la mosquée
    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "imam_name", length = 200)
    private String imamName;

    @Column(name = "architectural_style", length = 100)
    private String architecturalStyle;

    // Statut et vérification
    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MosqueStatus status = MosqueStatus.ACTIVE;

    // Statistiques
    @Column(name = "followers_count")
    @Builder.Default
    private Long followersCount = 0L;

    @Column(name = "content_count")
    @Builder.Default
    private Long contentCount = 0L;

    @Column(name = "events_count")
    @Builder.Default
    private Long eventsCount = 0L;

    // Horaires de prière (format JSON ou texte)
    @Column(name = "prayer_times", columnDefinition = "TEXT")
    private String prayerTimes;

    // Services offerts
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "mosque_services", joinColumns = @JoinColumn(name = "mosque_id"))
    @Column(name = "service", length = 100)
    private Set<String> services;

    // Langues parlées
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "mosque_languages", joinColumns = @JoinColumn(name = "mosque_id"))
    @Column(name = "language", length = 10)
    @Builder.Default
    private Set<String> languages = Set.of("fr");

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "mosque", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Content> contents;

    @OneToMany(mappedBy = "mosque", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Series> series;

    @ManyToMany(mappedBy = "affiliatedMosques", fetch = FetchType.LAZY)
    private Set<Teacher> affiliatedTeachers;

    @OneToMany(mappedBy = "mosque", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MosqueFollower> followers;

    // Enums
    public enum MosqueStatus {
        ACTIVE,      // Active
        INACTIVE,    // Inactive
        SUSPENDED,   // Suspendue
        PENDING      // En attente de vérification
    }

    // Helper methods
    public void incrementFollowersCount() {
        this.followersCount = (this.followersCount == null ? 0 : this.followersCount) + 1;
    }

    public void decrementFollowersCount() {
        this.followersCount = Math.max(0, (this.followersCount == null ? 0 : this.followersCount) - 1);
    }

    public void incrementContentCount() {
        this.contentCount = (this.contentCount == null ? 0 : this.contentCount) + 1;
    }

    public void decrementContentCount() {
        this.contentCount = Math.max(0, (this.contentCount == null ? 0 : this.contentCount) - 1);
    }

    public void incrementEventsCount() {
        this.eventsCount = (this.eventsCount == null ? 0 : this.eventsCount) + 1;
    }

    public void decrementEventsCount() {
        this.eventsCount = Math.max(0, (this.eventsCount == null ? 0 : this.eventsCount) - 1);
    }

    public boolean isActive() {
        return status == MosqueStatus.ACTIVE;
    }

    public boolean hasLocation() {
        return latitude != null && longitude != null;
    }

    public String getFullAddress() {
        StringBuilder addressBuilder = new StringBuilder();
        
        if (address != null && !address.trim().isEmpty()) {
            addressBuilder.append(address);
        }
        
        if (city != null && !city.trim().isEmpty()) {
            if (addressBuilder.length() > 0) {
                addressBuilder.append(", ");
            }
            addressBuilder.append(city);
        }
        
        if (region != null && !region.trim().isEmpty()) {
            if (addressBuilder.length() > 0) {
                addressBuilder.append(", ");
            }
            addressBuilder.append(region);
        }
        
        if (country != null && !country.trim().isEmpty()) {
            if (addressBuilder.length() > 0) {
                addressBuilder.append(", ");
            }
            addressBuilder.append(country);
        }
        
        return addressBuilder.toString();
    }
}
