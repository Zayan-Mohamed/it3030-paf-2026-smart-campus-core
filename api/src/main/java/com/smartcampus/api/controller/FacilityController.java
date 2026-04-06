package com.smartcampus.api.controller;

import com.smartcampus.api.dto.CreateFacilityRequest;
import com.smartcampus.api.dto.FacilityResponse;
import com.smartcampus.api.dto.UpdateFacilityRequest;
import com.smartcampus.api.model.Facility.FacilityStatus;
import com.smartcampus.api.model.Facility.FacilityType;
import com.smartcampus.api.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for facility and asset catalogue operations.
 */
@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@Slf4j
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping
    public ResponseEntity<FacilityResponse> createFacility(@Valid @RequestBody CreateFacilityRequest request) {
        log.info("Creating new facility: {}", request.getName());
        FacilityResponse response = facilityService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponse> getFacilityById(@PathVariable Long id) {
        log.info("Fetching facility with id: {}", id);
        FacilityResponse response = facilityService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FacilityResponse>> listFacilities(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) FacilityType facilityType,
            @RequestParam(required = false) FacilityStatus status,
            @RequestParam(required = false) Integer minCapacity) {
        log.info("Listing facilities search=name:{} location:{} type:{} status:{} minCapacity:{}",
                name, location, facilityType, status, minCapacity);
        List<FacilityResponse> facilities = facilityService.search(name, location, facilityType, status, minCapacity);
        return ResponseEntity.ok(facilities);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacilityResponse> updateFacility(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFacilityRequest request) {
        log.info("Updating facility with id: {}", id);
        FacilityResponse response = facilityService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        log.info("Deleting facility with id: {}", id);
        facilityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
