const API_BASE_URL = 'http://localhost:8080/api/v1/dashboard/admin';

const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface SystemHealth {
  status: string;
  database: string;
  uptime: string;
  memoryUsagePercentage: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface AdminDashboardData {
  message: string;
  adminName: string;
  totalUsers: number;
  activeBookings: number;
  openIncidents: number;
  totalFacilities: number;
  recentUsers: RecentUser[];
  systemHealth: SystemHealth;
}

export const AdminDashboardService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await fetch(`${API_BASE_URL}/welcome`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin dashboard data');
    return response.json();
  }
};
