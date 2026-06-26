import { apiClient } from './api';
import { AuthResponse } from '../types/auth';
import { USE_MOCK_API } from '../config';

const mockUser = {
  id: 'u-1',
  email: 'user@example.com',
  name: 'Developer',
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        accessToken: 'mock-token-123',
        user: { ...mockUser, email },
      };
    }

    return apiClient.request<AuthResponse>('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        accessToken: 'mock-token-456',
        user: { id: 'u-2', name, email },
      };
    }

    return apiClient.request<AuthResponse>('/auth/register', {
      method: 'POST',
      data: { name, email, password },
    });
  },

  async completeOAuthLogin(): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        accessToken: 'oauth-token-789',
        user: { id: 'u-oauth', name: 'OAuth User', email: 'oauth@example.com' },
      };
    }

    return apiClient.request<AuthResponse>('/auth/oauth/complete', {
      method: 'GET',
    });
  },

  async logout() {
    if (USE_MOCK_API) {
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    return apiClient.request('/auth/logout', { method: 'POST' });
  },
};
