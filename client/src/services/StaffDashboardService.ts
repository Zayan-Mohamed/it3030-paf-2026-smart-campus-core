const API_BASE_URL = 'http://localhost:8080/api/v1/dashboard/staff';

const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface StaffDashboardData {
  message: string;
  staffName: string;
  urgentIncidents: number;
  assignedTasks: number;
  completedToday: number;
  scheduledMaintenance: number;
}

export const StaffDashboardService = {
  async getDashboardData(): Promise<StaffDashboardData> {
    const response = await fetch(`${API_BASE_URL}/welcome`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff dashboard data');
    return response.json();
  }
};
