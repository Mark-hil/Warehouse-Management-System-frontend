import { UserRole } from '../types/auth.types';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  id?: string;
  email?: string;
  role?: UserRole;
  assigned_branch?: string;
  created_at?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  staff_users: number;
  monthly_stats: {
    month: string;
    count: number;
  }[];
  user_roles: {
    role: string;
    count: number;
  }[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}



export interface LoginResponse {
  token: string;
  user?: User;
}

export interface ErrorResponse {
  message?: string;
  status?: number;
  detail?: string;
  [key: string]: any; // Allow for additional error fields from the server
}
