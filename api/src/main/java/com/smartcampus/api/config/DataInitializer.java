package com.smartcampus.api.config;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

/**
 * Initializes test users with different roles for RBAC testing.
 * 
 * Creates three test users:
 * - admin@smartcampus.edu (ADMIN) - Full system access
 * - staff@smartcampus.edu (STAFF) - Staff dashboard access
 * - student@smartcampus.edu (STUDENT) - Student dashboard access
 * 
 * WARNING: This is for development/testing only. Remove or disable in production.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            log.info("Starting data initialization...");

            // Create ADMIN user
            if (!userRepository.existsByEmail("admin@smartcampus.edu")) {
                User admin = User.builder()
                        .email("admin@smartcampus.edu")
                        .name("Super Admin")
                        .password(passwordEncoder.encode("admin123"))
                        .pictureUrl("https://ui-avatars.com/api/?name=Super+Admin&background=dc2626&color=fff")
                        .roles(Set.of(Role.ADMIN))
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                log.info("Created ADMIN user: admin@smartcampus.edu");
            } else {
                log.info("ADMIN user already exists: admin@smartcampus.edu");
            }

            // Create STAFF user
            if (!userRepository.existsByEmail("staff@smartcampus.edu")) {
                User staff = User.builder()
                        .email("staff@smartcampus.edu")
                        .name("Staff Member")
                        .password(passwordEncoder.encode("staff123"))
                        .pictureUrl("https://ui-avatars.com/api/?name=Staff+Member&background=2563eb&color=fff")
                        .roles(Set.of(Role.STAFF))
                        .enabled(true)
                        .build();
                userRepository.save(staff);
                log.info("Created STAFF user: staff@smartcampus.edu");
            } else {
                log.info("STAFF user already exists: staff@smartcampus.edu");
            }

            // Create STUDENT user
            if (!userRepository.existsByEmail("student@smartcampus.edu")) {
                User student = User.builder()
                        .email("student@smartcampus.edu")
                        .name("Test Student")
                        .password(passwordEncoder.encode("student123"))
                        .pictureUrl("https://ui-avatars.com/api/?name=Test+Student&background=16a34a&color=fff")
                        .roles(Set.of(Role.STUDENT))
                        .enabled(true)
                        .build();
                userRepository.save(student);
                log.info("Created STUDENT user: student@smartcampus.edu");
            } else {
                log.info("STUDENT user already exists: student@smartcampus.edu");
            }

            log.info("Data initialization complete!");
        };
    }
}
