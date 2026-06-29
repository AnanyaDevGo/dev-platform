import { apiClient } from './api';
import { AuthResponse, User } from '../types/auth';
import { USE_MOCK_API } from '../config';

const mockUsers: Record<string, User> = {
  'user@example.com': { id: 'u-1', email: 'user@example.com', name: 'Developer' },
};

function createMockUser(name: string, email: string): User {
  return { id: `u-${Date.now()}`, name, email };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = mockUsers[email.toLowerCase()];
      if (!user) {
        throw new Error('No account found. Please register first.');
      }

      return {
        accessToken: 'mock-token-123',
        user,
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
      const normalizedEmail = email.toLowerCase();
      if (mockUsers[normalizedEmail]) {
        throw new Error('This email is already registered. Please sign in.');
      }

      const newUser = createMockUser(name, normalizedEmail);
      mockUsers[normalizedEmail] = newUser;
      return {
        accessToken: 'mock-token-456',
        user: newUser,
      };
    }

    return apiClient.request<AuthResponse>('/auth/register', {
      method: 'POST',
      data: { name, email, password },
    });
  },

  async completeOAuthLogin(provider = 'google'): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        accessToken: 'oauth-token-789',
        user: { id: 'u-oauth', name: 'OAuth User', email: 'oauth@example.com' },
      };
    }

    return apiClient.request<AuthResponse>(`/auth/oauth/complete?provider=${encodeURIComponent(provider)}`, {
      method: 'GET',
    });
  },

  async me(): Promise<User> {
    if (USE_MOCK_API) {
      return new Promise((resolve) => setTimeout(() => resolve(mockUsers['user@example.com']), 100));
    }

    return apiClient.request<User>('/auth/me', {
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
