package com.smartcampus.api.model;

/**
 * Enum representing user roles in the Smart Campus system.
 * Used for role-based access control (RBAC).
 * 
 * Spring Security will automatically prefix these with "ROLE_" when checking permissions.
 * For example, Role.STUDENT becomes "ROLE_STUDENT" in @PreAuthorize annotations.
 */
public enum Role {
    /**
     * Student role - can view student dashboard, book facilities, report incidents
     */
    STUDENT,
    
    /**
     * Staff role - can access staff dashboard and handle maintenance/incidents
     */
    STAFF,
    
    /**
     * Admin role - full system access, can access all dashboards
     */
    ADMIN
}
