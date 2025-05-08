import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { LoginRequest, LoginResponse, ErrorResponse } from './types';
import { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic request methods
  public async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async post<T>(url: string, data?: unknown, config = {}): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async put<T>(url: string, data?: unknown, config = {}): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Authentication endpoints
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/users/auth/token/login/', credentials);
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/users/me/');
    return response.data;
  }

  private handleError(error: AxiosError): Error {
    const response = error.response?.data as ErrorResponse;
    return new Error(response?.message || error.message || 'An unexpected error occurred');
  }
}

// Export a singleton instance
export const api = ApiClient.getInstance();
