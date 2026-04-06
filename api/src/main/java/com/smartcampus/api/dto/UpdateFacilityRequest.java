package com.smartcampus.api.dto;

import com.smartcampus.api.model.Facility.FacilityType;
import com.smartcampus.api.model.Facility.FacilityStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalTime;

/**
 * Request DTO for updating an existing facility.
 */
@Data
public class UpdateFacilityRequest {

    /**
     * Name of the facility
     */
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    /**
     * Description of the facility
     */
    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    /**
     * Type of facility
     */
    private FacilityType facilityType;

    /**
     * Location/building where facility is located
     */
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    /**
     * Capacity of the facility
     */
    @Min(value = 1, message = "Capacity must be at least 1")
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
}