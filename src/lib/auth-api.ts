import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Verify token
  verifyToken: async (token: string): Promise<AuthResponse> => {
    const response = await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Logout (if you have a logout endpoint)
  logout: async (token: string): Promise<void> => {
    await api.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};