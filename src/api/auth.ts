import { LoginCredentials, LoginResponse } from '../types/auth.types';

const BASE_URL = '/api/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/validate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
};