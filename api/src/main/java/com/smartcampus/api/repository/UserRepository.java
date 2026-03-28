package com.smartcampus.api.repository;

import com.smartcampus.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by Google ID
     */
    Optional<User> findByGoogleId(String googleId);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if user exists by Google ID
     */
    boolean existsByGoogleId(String googleId);
}
