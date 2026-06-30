import { apiClient } from './api';

export interface HealthStatus {
  status: string;
  db: string;
  redis: string;
}

export const healthService = {
  async getHealth(): Promise<HealthStatus> {
    return apiClient.request<HealthStatus>('/health', { method: 'GET' });
  },
};
