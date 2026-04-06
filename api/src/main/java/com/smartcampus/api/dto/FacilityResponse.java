package com.smartcampus.api.dto;

import com.smartcampus.api.model.Facility.FacilityStatus;
import com.smartcampus.api.model.Facility.FacilityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Response DTO for facility information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityResponse {

    /**
     * Facility ID
     */
    private Long id;

    /**
     * Name of the facility
     */
    private String name;

    /**
     * Description of the facility
     */
    private String description;

    /**
     * Type of facility
     */
    private FacilityType facilityType;

    /**
     * Location/building where facility is located
     */
    private String location;

    /**
     * Capacity of the facility
     */
    private Integer capacity;

    /**
     * Current status of the facility
     */
    private FacilityStatus status;

    /**
     * Image URL for the facility
     */
    private String imageUrl;

    /**
     * Amenities available (comma-separated)
     */
    private String amenities;

    /**
     * Available from time
     */
    private LocalTime availableFrom;

    /**
     * Available to time
     */
    private LocalTime availableTo;

    /**
     * Creation timestamp
     */
    private LocalDateTime createdAt;

    /**
     * Last update timestamp
     */
    private LocalDateTime updatedAt;
}