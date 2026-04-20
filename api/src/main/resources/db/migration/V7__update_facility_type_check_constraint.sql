-- Align facilities facility_type DB check constraint with current FacilityType enum values.
-- Also normalize legacy value if present.

ALTER TABLE facilities DROP CONSTRAINT IF EXISTS facilities_facility_type_check;

UPDATE facilities
SET facility_type = 'PRACTICAL_ROOM'
WHERE facility_type = 'LABORATORY';

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