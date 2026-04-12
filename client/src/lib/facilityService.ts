import type { Facility, FacilityStatus, FacilityType } from '../types';

const API_BASE_URL = 'http://localhost:8080';

export type FacilityPayload = {
  name: string;
  description: string;
  facilityType: FacilityType;
  location: string;
  capacity: number;
  status: FacilityStatus;
  imageUrl: string;
  amenities: string;
  availableFrom: string;
  availableTo: string;
};

type ApiError = {
  message?: string;
  error?: string;
  details?: Record<string, string>;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string | null;
  body?: string;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = (await response.json().catch(() => null)) as T | ApiError | null;

    if (!response.ok) {
      const errorData = data as ApiError | null;
      const detailMessage = errorData?.details ? Object.values(errorData.details)[0] : undefined;
      throw new Error(detailMessage || errorData?.message || errorData?.error || 'Request failed');
    }

    return data as T;
  }

  const text = await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(text || 'Request failed');
  }

  return text as T;
}

async function facilityRequest<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', token, body } = options;
  const headers: Record<string, string> = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && method !== 'GET') {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body,
    });

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error while calling ${API_BASE_URL}${path}`);
    }

    throw error;
  }
}

export async function getFacilities() {
  return facilityRequest<Facility[]>('/api/facilities', {
    method: 'GET',
  });
}

export async function getFacility(id: string) {
  return facilityRequest<Facility>(`/api/facilities/${id}`, {
    method: 'GET',
  });
}

export async function createFacility(token: string, payload: FacilityPayload) {
  return facilityRequest<Facility>('/api/facilities', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateFacility(token: string, id: string, payload: FacilityPayload) {
  return facilityRequest<Facility>(`/api/facilities/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteFacility(token: string, id: number) {
  await facilityRequest<void>(`/api/facilities/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function normalizeFacilityTime(value: string) {
  if (!value) {
    return value;
  }

  return value.length === 5 ? `${value}:00` : value;
}

export function toTimeInputValue(value?: string | null) {
  if (!value) {
    return '';
  }

  return value.slice(0, 5);
}

export function facilityTypeLabel(value: FacilityType) {
  return value.replaceAll('_', ' ');
}

export function facilityStatusLabel(value: FacilityStatus) {
  return value.replaceAll('_', ' ');
}
