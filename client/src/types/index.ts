export interface User {
  id: number;
  email: string;
  name: string;
  pictureUrl: string;
  roles: string[];
}

export enum FacilityType {
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
  LABORATORY = 'LABORATORY',
  SPORTS_HALL = 'SPORTS_HALL',
  AUDITORIUM = 'AUDITORIUM',
  STUDY_ROOM = 'STUDY_ROOM',
  COMPUTER_LAB = 'COMPUTER_LAB',
  OTHER = 'OTHER'
}

export enum FacilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Facility {
  id: number;
  name: string;
  description?: string;
  facilityType: FacilityType;
  location: string;
  capacity: number;
  status: FacilityStatus;
  imageUrl?: string;
  amenities?: string;
  availableFrom: string; // LocalTime as string
  availableTo: string; // LocalTime as string
  createdAt: string; // LocalDateTime as string
  updatedAt: string; // LocalDateTime as string
}

export interface CreateFacilityRequest {
  name: string;
  description?: string;
  facilityType: FacilityType;
  location: string;
  capacity: number;
  status: FacilityStatus;
  imageUrl?: string;
  amenities?: string;
  availableFrom: string; // LocalTime as string
  availableTo: string; // LocalTime as string
}

export interface UpdateFacilityRequest {
  name?: string;
  description?: string;
  facilityType?: FacilityType;
  location?: string;
  capacity?: number;
  status?: FacilityStatus;
  imageUrl?: string;
  amenities?: string;
  availableFrom?: string; // LocalTime as string
  availableTo?: string; // LocalTime as string
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  details?: Record<string, string>;
}
