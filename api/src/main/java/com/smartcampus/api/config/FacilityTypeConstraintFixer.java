package com.smartcampus.api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Keeps the facilities.facility_type database check constraint aligned with
 * the current FacilityType enum values used by the application.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class FacilityTypeConstraintFixer {

    private final JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner fixFacilityTypeConstraint() {
        return args -> {
            jdbcTemplate.execute("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.tables
                        WHERE table_schema = 'public' AND table_name = 'facilities'
                    ) THEN
                        UPDATE facilities
                        SET facility_type = 'PRACTICAL_ROOM'
                        WHERE facility_type = 'LABORATORY';

                        ALTER TABLE facilities DROP CONSTRAINT IF EXISTS facilities_facility_type_check;

                        ALTER TABLE facilities
                        ADD CONSTRAINT facilities_facility_type_check
                        CHECK (facility_type::text = ANY (ARRAY[
                            'CONFERENCE_ROOM'::character varying,
                            'SPORTS_HALL'::character varying,
                            'AUDITORIUM'::character varying,
                            'STUDY_ROOM'::character varying,
                            'BYOD_COMPUTER_LAB'::character varying,
                            'PRACTICAL_ROOM'::character varying,
                            'COMPUTER_LAB'::character varying,
                            'PROJECTOR'::character varying,
                            'CAMERA'::character varying,
                            'STAFF_ROOM'::character varying,
                            'MEETING_ROOM'::character varying,
                            'LECTURE_HALL'::character varying,
                            'OTHER'::character varying
                        ]::text[]));
                    END IF;
                END
                $$;
                """);

            log.info("Facility type check constraint synchronized");
        };
    }
}
