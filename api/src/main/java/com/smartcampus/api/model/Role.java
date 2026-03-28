package com.smartcampus.api.model;

/**
 * Enum representing user roles in the Smart Campus system.
 * Used for role-based access control (RBAC).
 */
public enum Role {
    /**
     * Student role - can create bookings and submit incident tickets
     */
    STUDENT,
    
    /**
     * Staff role - can manage facilities and handle incidents
     */
    STAFF,
    
    /**
     * Admin role - full system access
     */
    ADMIN
}
