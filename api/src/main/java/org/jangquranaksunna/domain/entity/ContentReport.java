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
 * Entité ContentReport représentant un signalement de contenu
 */
@Entity
@Table(name = "content_reports", indexes = {
    @Index(name = "idx_content_reports_content", columnList = "content_id"),
    @Index(name = "idx_content_reports_user", columnList = "user_id"),
    @Index(name = "idx_content_reports_status", columnList = "status"),
    @Index(name = "idx_content_reports_reason", columnList = "reason"),
    @Index(name = "idx_content_reports_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportReason reason;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "reporter_email", length = 255)
    private String reporterEmail;

    @Column(name = "reporter_name", length = 200)
    private String reporterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;

    @Column(name = "moderator_action", length = 100)
    private String moderatorAction;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum ReportReason {
        INAPPROPRIATE_CONTENT,    // Contenu inapproprié
        COPYRIGHT_VIOLATION,      // Violation de droit d'auteur
        MISINFORMATION,          // Désinformation
        HATE_SPEECH,             // Discours de haine
        SPAM,                    // Spam
        VIOLENCE,                // Violence
        HARASSMENT,              // Harcèlement
        FAKE_CONTENT,            // Contenu falsifié
        TECHNICAL_ISSUE,         // Problème technique
        DUPLICATE_CONTENT,       // Contenu dupliqué
        WRONG_CATEGORY,          // Mauvaise catégorie
        POOR_QUALITY,            // Qualité médiocre
        OTHER                    // Autre raison
    }

    public enum ReportStatus {
        PENDING,        // En attente de révision
        UNDER_REVIEW,   // En cours de révision
        RESOLVED,       // Résolu
        REJECTED,       // Rejeté
        ESCALATED       // Escaladé
    }

    // Helper methods
    public boolean isPending() {
        return status == ReportStatus.PENDING;
    }

    public boolean isUnderReview() {
        return status == ReportStatus.UNDER_REVIEW;
    }

    public boolean isResolved() {
        return status == ReportStatus.RESOLVED;
    }

    public boolean isRejected() {
        return status == ReportStatus.REJECTED;
    }

    public boolean isEscalated() {
        return status == ReportStatus.ESCALATED;
    }

    public String getReasonDisplayName() {
        return switch (reason) {
            case INAPPROPRIATE_CONTENT -> "Contenu inapproprié";
            case COPYRIGHT_VIOLATION -> "Violation de droit d'auteur";
            case MISINFORMATION -> "Désinformation";
            case HATE_SPEECH -> "Discours de haine";
            case SPAM -> "Spam";
            case VIOLENCE -> "Violence";
            case HARASSMENT -> "Harcèlement";
            case FAKE_CONTENT -> "Contenu falsifié";
            case TECHNICAL_ISSUE -> "Problème technique";
            case DUPLICATE_CONTENT -> "Contenu dupliqué";
            case WRONG_CATEGORY -> "Mauvaise catégorie";
            case POOR_QUALITY -> "Qualité médiocre";
            case OTHER -> "Autre";
        };
    }

    public String getStatusDisplayName() {
        return switch (status) {
            case PENDING -> "En attente";
            case UNDER_REVIEW -> "En révision";
            case RESOLVED -> "Résolu";
            case REJECTED -> "Rejeté";
            case ESCALATED -> "Escaladé";
        };
    }

    public void markAsReviewed(User reviewer, String notes, String action) {
        this.reviewedBy = reviewer;
        this.reviewedAt = LocalDateTime.now();
        this.reviewNotes = notes;
        this.moderatorAction = action;
        this.status = ReportStatus.RESOLVED;
    }

    public void reject(User reviewer, String notes) {
        this.reviewedBy = reviewer;
        this.reviewedAt = LocalDateTime.now();
        this.reviewNotes = notes;
        this.status = ReportStatus.REJECTED;
    }

    public void escalate(User reviewer, String notes) {
        this.reviewedBy = reviewer;
        this.reviewedAt = LocalDateTime.now();
        this.reviewNotes = notes;
        this.status = ReportStatus.ESCALATED;
    }
}
