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
 * Entité ContentAsset représentant un asset/fichier associé à un contenu
 * (vidéo master, HLS, thumbnails, sous-titres, etc.)
 */
@Entity
@Table(name = "content_assets", indexes = {
    @Index(name = "idx_content_assets_content", columnList = "content_id"),
    @Index(name = "idx_content_assets_kind", columnList = "kind"),
    @Index(name = "idx_content_assets_format", columnList = "format")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetKind kind;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(length = 50)
    private String format;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "bitrate")
    private Integer bitrate;

    @Column(name = "quality_level", length = 20)
    private String qualityLevel;

    @Column(length = 64)
    private String checksum;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "encoding", length = 50)
    private String encoding;

    @Column(name = "is_encrypted")
    @Builder.Default
    private Boolean isEncrypted = false;

    @Column(name = "encryption_key_id", length = 100)
    private String encryptionKeyId;

    @Column(name = "language", length = 10)
    private String language;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "processing_status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;

    @Column(name = "processing_error", columnDefinition = "TEXT")
    private String processingError;

    @Column(name = "processing_progress")
    private Integer processingProgress;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum AssetKind {
        MASTER,         // Fichier source original
        HLS_MANIFEST,   // Manifest HLS (.m3u8)
        HLS_SEGMENT,    // Segment HLS (.ts)
        DASH_MANIFEST,  // Manifest DASH (.mpd)
        DASH_SEGMENT,   // Segment DASH
        THUMBNAIL,      // Image de prévisualisation
        POSTER,         // Image de couverture
        WAVEFORM,       // Données de forme d'onde (JSON)
        SUBTITLE,       // Sous-titres (VTT, SRT)
        TRANSCRIPT,     // Transcription complète
        PDF,            // Document PDF
        AUDIO_LOW,      // Audio qualité basse
        AUDIO_MEDIUM,   // Audio qualité moyenne
        AUDIO_HIGH,     // Audio qualité haute
        VIDEO_LOW,      // Vidéo qualité basse
        VIDEO_MEDIUM,   // Vidéo qualité moyenne
        VIDEO_HIGH,     // Vidéo qualité haute
        SPRITE,         // Sprite des thumbnails
        PREVIEW         // Aperçu court (trailer)
    }

    public enum ProcessingStatus {
        PENDING,      // En attente de traitement
        PROCESSING,   // En cours de traitement
        COMPLETED,    // Traitement terminé avec succès
        FAILED,       // Traitement échoué
        CANCELLED     // Traitement annulé
    }

    // Helper methods
    public boolean isVideo() {
        return kind == AssetKind.MASTER && (
            "mp4".equalsIgnoreCase(format) ||
            "webm".equalsIgnoreCase(format) ||
            "mov".equalsIgnoreCase(format) ||
            "avi".equalsIgnoreCase(format)
        );
    }

    public boolean isAudio() {
        return kind == AssetKind.MASTER && (
            "mp3".equalsIgnoreCase(format) ||
            "aac".equalsIgnoreCase(format) ||
            "ogg".equalsIgnoreCase(format) ||
            "wav".equalsIgnoreCase(format)
        );
    }

    public boolean isImage() {
        return (kind == AssetKind.THUMBNAIL || kind == AssetKind.POSTER) && (
            "jpg".equalsIgnoreCase(format) ||
            "jpeg".equalsIgnoreCase(format) ||
            "png".equalsIgnoreCase(format) ||
            "webp".equalsIgnoreCase(format)
        );
    }

    public boolean isPdf() {
        return kind == AssetKind.PDF && "pdf".equalsIgnoreCase(format);
    }

    public boolean isSubtitle() {
        return kind == AssetKind.SUBTITLE && (
            "vtt".equalsIgnoreCase(format) ||
            "srt".equalsIgnoreCase(format)
        );
    }

    public boolean isStreamingAsset() {
        return kind == AssetKind.HLS_MANIFEST || 
               kind == AssetKind.HLS_SEGMENT || 
               kind == AssetKind.DASH_MANIFEST || 
               kind == AssetKind.DASH_SEGMENT;
    }

    public boolean isProcessingComplete() {
        return processingStatus == ProcessingStatus.COMPLETED;
    }

    public boolean isProcessingFailed() {
        return processingStatus == ProcessingStatus.FAILED;
    }

    public String getHumanReadableSize() {
        if (fileSize == null || fileSize <= 0) {
            return "0 B";
        }

        long size = fileSize;
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        int unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return String.format("%.1f %s", (double) size, units[unitIndex]);
    }

    public String getQualityDisplayName() {
        if (qualityLevel == null) {
            return "Standard";
        }

        return switch (qualityLevel.toLowerCase()) {
            case "low" -> "Basse qualité";
            case "medium" -> "Qualité moyenne";
            case "high" -> "Haute qualité";
            case "4k" -> "Ultra HD (4K)";
            default -> qualityLevel;
        };
    }
}
