package com.smartcampus.api.service;

import com.smartcampus.api.dto.CreateFacilityRequest;
import com.smartcampus.api.dto.FacilityResponse;
import com.smartcampus.api.dto.UpdateFacilityRequest;
import com.smartcampus.api.exception.DuplicateFacilityException;
import com.smartcampus.api.exception.FacilityNotFoundException;
import com.smartcampus.api.model.Facility;
import com.smartcampus.api.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring service implementation for facility and asset catalogue operations.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;

    @Override
    public FacilityResponse create(CreateFacilityRequest request) {
        validateAvailability(request.getAvailableFrom(), request.getAvailableTo());

        if (facilityRepository.existsByName(request.getName())) {
            throw new DuplicateFacilityException(request.getName());
        }

        Facility facility = new Facility();
        facility.setName(request.getName());
        facility.setDescription(request.getDescription());
        facility.setFacilityType(request.getFacilityType());
        facility.setLocation(request.getLocation());
        facility.setCapacity(request.getCapacity());
        facility.setStatus(request.getStatus() != null ? request.getStatus() : Facility.FacilityStatus.AVAILABLE);
        facility.setImageUrl(request.getImageUrl());
        facility.setAmenities(request.getAmenities());
        facility.setAvailableFrom(request.getAvailableFrom());
        facility.setAvailableTo(request.getAvailableTo());

        Facility saved = facilityRepository.save(facility);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FacilityResponse getById(Long id) {
        return facilityRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new FacilityNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityResponse> getAll() {
        return facilityRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityResponse update(Long id, UpdateFacilityRequest request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new FacilityNotFoundException(id));

        if (request.getName() != null && !request.getName().equals(facility.getName())
                && facilityRepository.existsByName(request.getName())) {
            throw new DuplicateFacilityException(request.getName());
        }

        if (request.getAvailableFrom() != null || request.getAvailableTo() != null) {
            LocalTime from = request.getAvailableFrom() != null ? request.getAvailableFrom() : facility.getAvailableFrom();
            LocalTime to = request.getAvailableTo() != null ? request.getAvailableTo() : facility.getAvailableTo();
            validateAvailability(from, to);
        }

        if (request.getName() != null) {
            facility.setName(request.getName());
        }
        if (request.getDescription() != null) {
            facility.setDescription(request.getDescription());
        }
        if (request.getFacilityType() != null) {
            facility.setFacilityType(request.getFacilityType());
        }
        if (request.getLocation() != null) {
            facility.setLocation(request.getLocation());
        }
        if (request.getCapacity() != null) {
            facility.setCapacity(request.getCapacity());
        }
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        if (request.getImageUrl() != null) {
            facility.setImageUrl(request.getImageUrl());
        }
        if (request.getAmenities() != null) {
            facility.setAmenities(request.getAmenities());
        }
        if (request.getAvailableFrom() != null) {
            facility.setAvailableFrom(request.getAvailableFrom());
        }
        if (request.getAvailableTo() != null) {
            facility.setAvailableTo(request.getAvailableTo());
        }

        return mapToResponse(facilityRepository.save(facility));
    }

    @Override
    public void delete(Long id) {
        if (!facilityRepository.existsById(id)) {
            throw new FacilityNotFoundException(id);
        }
        facilityRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityResponse> search(String name,
                                        String location,
                                        Facility.FacilityType facilityType,
                                        Facility.FacilityStatus status,
                                        Integer minCapacity) {
        Specification<Facility> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (location != null && !location.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
        }
        if (facilityType != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("facilityType"), facilityType));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        }
        if (minCapacity != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity));
        }

        return facilityRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateAvailability(LocalTime from, LocalTime to) {
        if (from == null || to == null) {
            return;
        }
        if (!from.isBefore(to)) {
            throw new IllegalArgumentException("Available from time must be before available to time");
        }
    }

    private FacilityResponse mapToResponse(Facility facility) {
        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .description(facility.getDescription())
                .facilityType(facility.getFacilityType())
                .location(facility.getLocation())
                .capacity(facility.getCapacity())
                .status(facility.getStatus())
                .imageUrl(facility.getImageUrl())
                .amenities(facility.getAmenities())
                .availableFrom(facility.getAvailableFrom())
                .availableTo(facility.getAvailableTo())
                .createdAt(facility.getCreatedAt())
                .updatedAt(facility.getUpdatedAt())
                .build();
    }
}