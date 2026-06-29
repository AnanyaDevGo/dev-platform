import { apiClient } from './api';
import { User } from '../types/auth';

export const userService = {
  async getCurrentUser(token: string): Promise<User> {
    return apiClient.request<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getUsers(): Promise<User[]> {
    return apiClient.request<User[]>('/api/users', {
      method: 'GET',
    });
  },
};
