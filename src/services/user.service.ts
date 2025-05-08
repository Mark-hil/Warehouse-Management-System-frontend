import { api } from '../api/api';
import { User, Permission, UserRole, DashboardStats, Notification } from '../types/auth.types';

export class UserService {
  private static instance: UserService;
  private baseUrl = '/users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // User Management
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/users/`);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/users/${id}/`);
    return response.data;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post<User>(`${this.baseUrl}/users/`, user);
    return response.data;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await api.put<User>(`${this.baseUrl}/users/${id}/`, user);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/users/${id}/`);
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>(`${this.baseUrl}/dashboard/stats/`);
    return response.data;
  }

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    const response = await api.get<Permission[]>(`${this.baseUrl}/permissions/`);
    return response.data;
  }

  async assignPermissions(userId: string, permissions: Permission[]): Promise<void> {
    await api.post(`${this.baseUrl}/users/${userId}/permissions/`, { permissions });
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>(`${this.baseUrl}/notifications/`);
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await api.put(`${this.baseUrl}/notifications/${id}/read/`);
  }

  // Roles
  async getRoles(): Promise<UserRole[]> {
    const response = await api.get<UserRole[]>(`${this.baseUrl}/roles/`);
    return response.data;
  }

  async assignRole(userId: string, role: UserRole): Promise<void> {
    await api.post(`${this.baseUrl}/users/${userId}/role/`, { role });
  }
}

export const userService = UserService.getInstance();
