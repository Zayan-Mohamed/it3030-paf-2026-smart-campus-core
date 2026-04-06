package com.smartcampus.api.exception;

/**
 * Exception thrown when attempting to create a facility with a name that already exists.
 */
public class DuplicateFacilityException extends RuntimeException {

    public DuplicateFacilityException(String message) {
        super(message);
    }

    public DuplicateFacilityException(String name) {
        super("Facility with name '" + name + "' already exists");
    }
}