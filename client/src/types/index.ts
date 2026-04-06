export interface User {
  id: number;
  email: string;
  name: string;
  pictureUrl: string;
  roles: string[];
}

export type FacilityType =
  | 'CONFERENCE_ROOM'
  | 'LABORATORY'
  | 'SPORTS_HALL'
  | 'AUDITORIUM'
  | 'STUDY_ROOM'
  | 'COMPUTER_LAB'
  | 'OTHER';

export type FacilityStatus = 'AVAILABLE' | 'UNDER_MAINTENANCE' | 'UNAVAILABLE';

export interface Facility {
  id: number;
  name: string;
  description: string;
  facilityType: FacilityType;
  location: string;
  capacity: number;
  status: FacilityStatus;
  imageUrl?: string | null;
  amenities?: string | null;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  facilityId: number;
  facilityName: string;
  facilityType: FacilityType;
  facilityLocation: string;
  facilityCapacity: number;
  userId: number;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  numberOfAttendees: number;
  status: BookingStatus;
  staffComments?: string | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
  canCancel: boolean;
}

export interface BookingConflict {
  id: number;
  facilityName: string;
  userName: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
}

export interface BookingConflictResult {
  hasConflict: boolean;
  message: string;
  conflictingBookings: BookingConflict[];
}

export type IncidentCategory = 'ELECTRICAL' | 'FURNITURE' | 'AV_EQUIPMENT' | 'NETWORK' | 'OTHER';
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

export interface Incident {
  id: number;
  resourceLocation: string;
  category: IncidentCategory;
  description: string;
  priority: IncidentPriority;
  preferredContact: string;
  status: IncidentStatus;
  imageUrls: string[];
  createdAt: string;
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
