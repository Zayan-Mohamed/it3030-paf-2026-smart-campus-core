package com.smartcampus.api.controller;

import com.smartcampus.api.dto.StaffDashboardResponse;
import com.smartcampus.api.model.User;
import com.smartcampus.api.model.Incident;
import com.smartcampus.api.repository.IncidentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Staff Dashboard operations.
 * 
 * SECURITY:
 * - All endpoints require authentication (JWT)
 * - Access restricted to users with STAFF or ADMIN roles
 * - Uses @PreAuthorize for method-level security
 * 
 * Spring Security automatically adds "ROLE_" prefix to roles from the JWT.
 * So hasRole('STAFF') checks for "ROLE_STAFF" in the JWT.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
public class StaffDashboardController {
    
    private final IncidentRepository incidentRepository;
    
    /**
     * Get staff dashboard welcome data.
     * 
     * SECURITY: Requires STAFF or ADMIN role
     * 
     * @param userDetails The authenticated user's details (injected by Spring Security)
     * @return StaffDashboardResponse with welcome message and work queue statistics
     */
    @GetMapping("/welcome")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<StaffDashboardResponse> getWelcomeData(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Staff dashboard welcome request from user: {}", userDetails.getName());
        
        List<Incident> assignedIncidents = incidentRepository.findByAssignedToOrderByCreatedAtDesc(userDetails);
        
        long urgentIncidents = assignedIncidents.stream()
            .filter(i -> i.getPriority() == Incident.IncidentPriority.HIGH || i.getPriority() == Incident.IncidentPriority.CRITICAL)
            .count();
        
        long assignedTasks = assignedIncidents.size();
        
        // Placeholder response until dashboard services are wired in.
        StaffDashboardResponse response = StaffDashboardResponse.builder()
                .message("Welcome Staff Member!")
                .staffName(userDetails.getName())
                .urgentIncidents((int) urgentIncidents)
                .assignedTasks((int) assignedTasks)
                .completedToday(0)
                .scheduledMaintenance(0)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get incident queue for staff member.
     * 
     * SECURITY: Requires STAFF or ADMIN role
     * 
     * @param userDetails The authenticated user's details
     * @return Incident queue data
     */
    @GetMapping("/incidents/queue")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<String> getIncidentQueue(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Incident queue request from staff: {}", userDetails.getName());
        
        // Placeholder response until incident queue services are wired in.
        return ResponseEntity.ok("Incident queue for staff: " + userDetails.getName());
    }
    
    /**
     * Get assigned maintenance tasks.
     * 
     * SECURITY: Requires STAFF or ADMIN role
     * 
     * @param userDetails The authenticated user's details
     * @return Assigned maintenance tasks
     */
    @GetMapping("/maintenance/assigned")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<String> getAssignedMaintenance(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Assigned maintenance request from staff: {}", userDetails.getName());
        
        // Placeholder response until maintenance services are wired in.
        return ResponseEntity.ok("Assigned maintenance tasks for: " + userDetails.getName());
    }
    
    /**
     * Get today's schedule for staff member.
     * 
     * SECURITY: Requires STAFF or ADMIN role
     * 
     * @param userDetails The authenticated user's details
     * @return Today's schedule
     */
    @GetMapping("/schedule/today")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<String> getTodaySchedule(
            @AuthenticationPrincipal User userDetails
    ) {
        log.info("Today's schedule request from staff: {}", userDetails.getName());
        
        // Placeholder response until scheduling services are wired in.
        return ResponseEntity.ok("Today's schedule for: " + userDetails.getName());
    }
}
