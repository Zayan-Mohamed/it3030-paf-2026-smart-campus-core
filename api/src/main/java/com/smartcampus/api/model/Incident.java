package com.smartcampus.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Incident entity representing maintenance tickets for campus facilities.
 * Supports image attachments for incident documentation.
 */
@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_reporter", columnList = "reporter_id"),
    @Index(name = "idx_incident_facility", columnList = "facility_id"),
    @Index(name = "idx_incident_status", columnList = "status"),
    @Index(name = "idx_incident_priority", columnList = "priority")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Title/summary of the incident
     */
    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    /**
     * Detailed description of the incident
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Description is required")
    private String description;
    
    /**
     * User who reported the incident
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    @NotNull(message = "Reporter is required")
    private User reporter;
    
    /**
     * Facility where the incident occurred
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id")
    private Facility facility;
    
    /**
     * Location of the incident (if not tied to a specific facility)
     */
    private String location;
    
    /**
     * Category of the incident
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category is required")
    private IncidentCategory category;
    
    /**
     * Priority level of the incident
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncidentPriority priority = IncidentPriority.MEDIUM;
    
    /**
     * Current status of the incident
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.OPEN;
    
    /**
     * Securely generated filename for attached image (if any).
     * Stored as UUID to prevent path traversal attacks.
     */
    @Column(name = "attachment_filename")
    private String attachmentFilename;
    
    /**
     * MIME type of the attachment for validation
     */
    @Column(name = "attachment_mime_type")
    private String attachmentMimeType;
    
    /**
     * Staff member assigned to handle this incident
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    /**
     * Resolution notes from staff
     */
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    /**
     * Timestamp when incident was resolved
     */
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Categories of incidents
     */
    public enum IncidentCategory {
        ELECTRICAL,
        PLUMBING,
        HVAC,
        EQUIPMENT,
        CLEANLINESS,
        SECURITY,
        OTHER
    }
    
    /**
     * Priority levels for incidents
     */
    public enum IncidentPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
    
    /**
     * Status of incident resolution
     */
    public enum IncidentStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        CANCELLED
    }
}
