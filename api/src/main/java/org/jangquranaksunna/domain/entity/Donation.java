package org.jangquranaksunna.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entité Donation représentant une donation sur la plateforme
 */
@Entity
@Table(name = "donations", indexes = {
    @Index(name = "idx_donations_user", columnList = "user_id"),
    @Index(name = "idx_donations_status", columnList = "status"),
    @Index(name = "idx_donations_method", columnList = "payment_method"),
    @Index(name = "idx_donations_created_at", columnList = "created_at"),
    @Index(name = "idx_donations_receipt_no", columnList = "receipt_no")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "XOF"; // Franc CFA par défaut

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DonationStatus status = DonationStatus.PENDING;

    @Column(name = "payment_provider_id", length = 100)
    private String paymentProviderId;

    @Column(name = "payment_intent_id", length = 100)
    private String paymentIntentId;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "receipt_no", unique = true, length = 50)
    private String receiptNo;

    @Column(name = "donor_name", length = 200)
    private String donorName;

    @Column(name = "donor_email", length = 255)
    private String donorEmail;

    @Column(name = "donor_phone", length = 50)
    private String donorPhone;

    @Column(name = "is_anonymous")
    @Builder.Default
    private Boolean isAnonymous = false;

    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean isRecurring = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurring_frequency")
    private RecurringFrequency recurringFrequency;

    @Column(name = "dedication_message", columnDefinition = "TEXT")
    private String dedicationMessage;

    @Column(name = "dedication_to", length = 200)
    private String dedicationTo;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DonationType type = DonationType.GENERAL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_content_id")
    private Content targetContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_teacher_id")
    private Teacher targetTeacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_mosque_id")
    private Mosque targetMosque;

    @Column(name = "platform_fee", precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "payment_fee", precision = 10, scale = 2)
    private BigDecimal paymentFee;

    @Column(name = "net_amount", precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "failed_at")
    private LocalDateTime failedAt;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Column(name = "receipt_sent_at")
    private LocalDateTime receiptSentAt;

    @Column(name = "thank_you_sent_at")
    private LocalDateTime thankYouSentAt;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum PaymentMethod {
        ORANGE_MONEY,    // Orange Money (Sénégal)
        WAVE,            // Wave (Sénégal)
        STRIPE,          // Carte bancaire via Stripe
        PAYPAL,          // PayPal
        BANK_TRANSFER,   // Virement bancaire
        CASH,            // Espèces (pour donations physiques)
        CRYPTO           // Cryptomonnaies (future)
    }

    public enum DonationStatus {
        PENDING,         // En attente de paiement
        PROCESSING,      // Paiement en cours
        COMPLETED,       // Paiement réussi
        FAILED,          // Paiement échoué
        CANCELLED,       // Annulé par l'utilisateur
        REFUNDED,        // Remboursé
        DISPUTED         // Litige
    }

    public enum DonationType {
        GENERAL,         // Don général pour la plateforme
        CONTENT,         // Don pour un contenu spécifique
        TEACHER,         // Don pour un enseignant spécifique
        MOSQUE,          // Don pour une mosquée spécifique
        INFRASTRUCTURE,  // Don pour l'infrastructure
        MAINTENANCE,     // Don pour la maintenance
        DEVELOPMENT,     // Don pour le développement
        SPECIAL_PROJECT  // Don pour un projet spécial
    }

    public enum RecurringFrequency {
        WEEKLY,          // Hebdomadaire
        MONTHLY,         // Mensuel
        QUARTERLY,       // Trimestriel
        YEARLY           // Annuel
    }

    // Helper methods
    public boolean isCompleted() {
        return status == DonationStatus.COMPLETED;
    }

    public boolean isPending() {
        return status == DonationStatus.PENDING || status == DonationStatus.PROCESSING;
    }

    public boolean isFailed() {
        return status == DonationStatus.FAILED || status == DonationStatus.CANCELLED;
    }

    public boolean isRefunded() {
        return status == DonationStatus.REFUNDED;
    }

    public String getDisplayAmount() {
        if (amount == null) {
            return "0";
        }
        
        return switch (currency) {
            case "XOF", "CFA" -> String.format("%,.0f FCFA", amount);
            case "EUR" -> String.format("%.2f €", amount);
            case "USD" -> String.format("$%.2f", amount);
            default -> String.format("%.2f %s", amount, currency);
        };
    }

    public String getPaymentMethodDisplayName() {
        return switch (paymentMethod) {
            case ORANGE_MONEY -> "Orange Money";
            case WAVE -> "Wave";
            case STRIPE -> "Carte bancaire";
            case PAYPAL -> "PayPal";
            case BANK_TRANSFER -> "Virement bancaire";
            case CASH -> "Espèces";
            case CRYPTO -> "Cryptomonnaie";
        };
    }

    public String getTypeDisplayName() {
        return switch (type) {
            case GENERAL -> "Don général";
            case CONTENT -> "Don pour contenu";
            case TEACHER -> "Don pour enseignant";
            case MOSQUE -> "Don pour mosquée";
            case INFRASTRUCTURE -> "Don infrastructure";
            case MAINTENANCE -> "Don maintenance";
            case DEVELOPMENT -> "Don développement";
            case SPECIAL_PROJECT -> "Don projet spécial";
        };
    }

    public String getStatusDisplayName() {
        return switch (status) {
            case PENDING -> "En attente";
            case PROCESSING -> "En cours";
            case COMPLETED -> "Terminé";
            case FAILED -> "Échoué";
            case CANCELLED -> "Annulé";
            case REFUNDED -> "Remboursé";
            case DISPUTED -> "Litige";
        };
    }

    public boolean needsReceipt() {
        return isCompleted() && receiptSentAt == null;
    }

    public boolean needsThankYou() {
        return isCompleted() && thankYouSentAt == null;
    }
}
