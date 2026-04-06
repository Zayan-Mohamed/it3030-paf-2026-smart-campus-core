package com.smartcampus.api.exception;

/**
 * Exception thrown when a requested facility is not found.
 */
public class FacilityNotFoundException extends RuntimeException {

    public FacilityNotFoundException(String message) {
        super(message);
    }

    public FacilityNotFoundException(Long id) {
        super("Facility not found with id: " + id);
    }
}