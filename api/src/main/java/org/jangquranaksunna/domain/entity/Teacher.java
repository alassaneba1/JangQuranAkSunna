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
 * Entité Teacher représentant un enseignant/ustaz sur la plateforme
 */
@Entity
@Table(name = "teachers", indexes = {
    @Index(name = "idx_teachers_display_name", columnList = "display_name"),
    @Index(name = "idx_teachers_verified", columnList = "verified"),
    @Index(name = "idx_teachers_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "teacher_languages", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "language", length = 10)
    @Builder.Default
    private Set<String> languages = Set.of("fr");

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "teacher_specializations", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "specialization", length = 100)
    private Set<String> specializations;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "teacher_links", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "link", length = 500)
    private Set<String> links;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TeacherStatus status = TeacherStatus.PENDING;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "birth_year")
    private Integer birthYear;

    @Column(length = 100)
    private String nationality;

    @Column(name = "education_background", columnDefinition = "TEXT")
    private String educationBackground;

    @Column(name = "current_position", length = 200)
    private String currentPosition;

    @Column(name = "social_media_youtube", length = 500)
    private String socialMediaYoutube;

    @Column(name = "social_media_telegram", length = 500)
    private String socialMediaTelegram;

    @Column(name = "social_media_facebook", length = 500)
    private String socialMediaFacebook;

    @Column(name = "social_media_twitter", length = 500)
    private String socialMediaTwitter;

    @Column(name = "social_media_instagram", length = 500)
    private String socialMediaInstagram;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "followers_count")
    @Builder.Default
    private Long followersCount = 0L;

    @Column(name = "total_content_count")
    @Builder.Default
    private Long totalContentCount = 0L;

    @Column(name = "total_views")
    @Builder.Default
    private Long totalViews = 0L;

    @Column(name = "average_rating")
    private Double averageRating;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Content> contents;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Series> series;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "teacher_mosques",
        joinColumns = @JoinColumn(name = "teacher_id"),
        inverseJoinColumns = @JoinColumn(name = "mosque_id")
    )
    private Set<Mosque> affiliatedMosques;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TeacherFollower> followers;

    // Enums
    public enum TeacherStatus {
        PENDING,      // En attente de vérification
        VERIFIED,     // Vérifié et actif
        SUSPENDED,    // Suspendu temporairement
        REJECTED,     // Candidature rejetée
        INACTIVE      // Inactif (par choix de l'enseignant)
    }

    // Helper methods
    public void incrementFollowersCount() {
        this.followersCount = (this.followersCount == null ? 0 : this.followersCount) + 1;
    }

    public void decrementFollowersCount() {
        this.followersCount = Math.max(0, (this.followersCount == null ? 0 : this.followersCount) - 1);
    }

    public void incrementContentCount() {
        this.totalContentCount = (this.totalContentCount == null ? 0 : this.totalContentCount) + 1;
    }

    public void decrementContentCount() {
        this.totalContentCount = Math.max(0, (this.totalContentCount == null ? 0 : this.totalContentCount) - 1);
    }

    public void addViews(long views) {
        this.totalViews = (this.totalViews == null ? 0 : this.totalViews) + views;
    }

    public boolean isActive() {
        return status == TeacherStatus.VERIFIED && verified;
    }

    public boolean canPublishContent() {
        return isActive();
    }
}
