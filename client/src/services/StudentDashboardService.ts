const API_BASE_URL = 'http://localhost:8080/api/v1/dashboard/student';

const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface StudentDashboardData {
  message: string;
  studentName: string;
  activeBookings: number;
  reportedIncidents: number;
  availableFacilities: number;
  campusEvents: number;
}

export const StudentDashboardService = {
  async getDashboardData(): Promise<StudentDashboardData> {
    const response = await fetch(`${API_BASE_URL}/welcome`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch student dashboard data');
    return response.json();
  }
};
