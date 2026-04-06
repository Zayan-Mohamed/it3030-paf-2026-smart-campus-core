package com.smartcampus.api.service;

import com.smartcampus.api.dto.CreateFacilityRequest;
import com.smartcampus.api.dto.FacilityResponse;
import com.smartcampus.api.dto.UpdateFacilityRequest;
import com.smartcampus.api.model.Facility;

import java.util.List;

/**
 * Service interface for facility and asset catalogue operations.
 */
public interface FacilityService {

    /**
     * Create a new facility.
     */
    FacilityResponse create(CreateFacilityRequest request);

    /**
     * Get a facility by its ID.
     */
    FacilityResponse getById(Long id);

    /**
     * Get all facilities.
     */
    List<FacilityResponse> getAll();

    /**
     * Update an existing facility.
     */
    FacilityResponse update(Long id, UpdateFacilityRequest request);

    /**
     * Delete a facility by ID.
     */
    void delete(Long id);

    /**
     * Search facilities by optional filters.
     */
    List<FacilityResponse> search(
            String name,
            String location,
            Facility.FacilityType facilityType,
            Facility.FacilityStatus status,
            Integer minCapacity
    );
}
