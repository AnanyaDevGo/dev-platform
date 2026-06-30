import { apiClient } from './api';
import { User } from '../types/auth';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  is_active?: boolean;
  password?: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    return apiClient.request<User[]>('/api/users', { method: 'GET' });
  },

  async getUser(userId: string): Promise<User> {
    return apiClient.request<User>(`/api/users/${userId}`, { method: 'GET' });
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    return apiClient.request<User>('/api/users', {
      method: 'POST',
      data: payload,
    });
  },

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    return apiClient.request<User>(`/api/users/${userId}`, {
      method: 'PATCH',
      data: payload,
    });
  },

  async deleteUser(userId: string): Promise<User> {
    return apiClient.request<User>(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
