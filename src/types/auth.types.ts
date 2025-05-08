export type UserRole = 'admin' | 'warehouse_manager' | 'team_lead' | 'approver';

export type Permission = 'read' | 'write' | 'manage_users' | 'manage_roles' | 'manage_settings' | 'all';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  assigned_branch?: string;
  created_at: string;
  is_active: boolean;
  is_staff: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  auth_token: string;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  staff_users: number;
  monthly_stats: {
    month: string;
    active_users: number;
    new_users: number;
  }[];
  role_distribution: {
    role: UserRole;
    count: number;
  }[];
  activity_log: {
    timestamp: string;
    action: string;
    user: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  userId: string;
}