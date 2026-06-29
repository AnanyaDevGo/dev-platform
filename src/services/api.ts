import { API_BASE_URL } from '../config';

interface ApiRequestConfig extends RequestInit {
  data?: unknown;
}

export const apiClient = {
  async request<T>(endpoint: string, config: ApiRequestConfig = {}) {
    const { data, headers, ...fetchConfig } = config;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      ...fetchConfig,
    });

    const contentType = response.headers.get('content-type');
    const responseBody = contentType?.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      const message = responseBody?.message || response.statusText || 'Request failed.';
      throw new Error(message);
    }

    return responseBody as T;
  },
};
