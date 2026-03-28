package com.smartcampus.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Facility entity representing bookable campus facilities
 * (e.g., conference rooms, labs, sports facilities).
 */
@Entity
@Table(name = "facilities", indexes = {
    @Index(name = "idx_facility_type", columnList = "facility_type"),
    @Index(name = "idx_facility_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Name of the facility
     */
    @Column(nullable = false)
    @NotBlank(message = "Facility name is required")
    private String name;
    
    /**
     * Description of the facility
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Type of facility (e.g., CONFERENCE_ROOM, LABORATORY, SPORTS_HALL)
     */
    @Column(name = "facility_type", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Facility type is required")
    private FacilityType facilityType;
    
    /**
     * Location/building where facility is located
     */
    @Column(nullable = false)
    @NotBlank(message = "Location is required")
    private String location;
    
    /**
     * Capacity of the facility
     */
    @Column(nullable = false)
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    /**
     * Current status of the facility
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FacilityStatus status = FacilityStatus.AVAILABLE;
    
    /**
     * Image URL for the facility
     */
    @Column(name = "image_url")
    private String imageUrl;
    
    /**
     * Amenities available (comma-separated)
     */
    private String amenities;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Types of facilities available for booking
     */
    public enum FacilityType {
        CONFERENCE_ROOM,
        LABORATORY,
        SPORTS_HALL,
        AUDITORIUM,
        STUDY_ROOM,
        COMPUTER_LAB,
        OTHER
    }
    
    /**
     * Status of facility availability
     */
    public enum FacilityStatus {
        AVAILABLE,
        UNDER_MAINTENANCE,
        UNAVAILABLE
    }
}
