import { apiClient } from './api';
import { User } from '../types/auth';

export const userService = {
  async getCurrentUser(token: string): Promise<User> {
    return apiClient.request<User>('/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
