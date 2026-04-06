package com.smartcampus.api.dto;

import com.smartcampus.api.model.Facility.FacilityType;
import com.smartcampus.api.model.Facility.FacilityStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalTime;

/**
 * Request DTO for creating a new facility.
 */
@Data
public class CreateFacilityRequest {

    /**
     * Name of the facility
     */
    @NotBlank(message = "Facility name is required")
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
    @NotNull(message = "Facility type is required")
    private FacilityType facilityType;

    /**
     * Location/building where facility is located
     */
    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    /**
     * Capacity of the facility
     */
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    /**
     * Current status of the facility
     */
    @NotNull(message = "Facility status is required")
    private FacilityStatus status;

    /**
     * Image URL for the facility
     */
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    /**
     * Amenities available (comma-separated)
     */
    @Size(max = 255, message = "Amenities must not exceed 255 characters")
    private String amenities;

    /**
     * Available from time
     */
    @NotNull(message = "Available from time is required")
    private LocalTime availableFrom;

    /**
     * Available to time
     */
    @NotNull(message = "Available to time is required")
    private LocalTime availableTo;

    @AssertTrue(message = "Available from time must be before available to time")
    public boolean isAvailabilityWindowValid() {
        return availableFrom == null || availableTo == null || availableFrom.isBefore(availableTo);
    }
}