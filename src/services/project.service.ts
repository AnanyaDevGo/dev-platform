import { apiClient } from './api';
import { Project } from '../types/project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return apiClient.request<Project[]>('/api/projects', {
      method: 'GET',
    });
  },

  async createProject(payload: { name: string; description?: string; status: string }): Promise<Project> {
    return apiClient.request<Project>('/api/projects', {
      method: 'POST',
      data: payload,
    });
  },
};
