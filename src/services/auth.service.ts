import * as authApi from '../api/auth';
import { LoginCredentials, LoginResponse } from '../types/auth.types';

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.login(credentials);
    this.token = response.token;
    return response;
  }

  async logout(): Promise<void> {
    await authApi.logout();
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  async validateToken(): Promise<boolean> {
    if (!this.token) return false;
    return authApi.validateToken(this.token);
  }
}

export default AuthService.getInstance();