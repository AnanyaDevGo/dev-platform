import { apiClient } from './api';
import { Project } from '../types/project';

export interface CreateProjectPayload {
  name: string;
  description?: string;
  status: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: string;
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return apiClient.request<Project[]>('/api/projects', { method: 'GET' });
  },

  async getProject(projectId: string): Promise<Project> {
    return apiClient.request<Project>(`/api/projects/${projectId}`, { method: 'GET' });
  },

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    return apiClient.request<Project>('/api/projects', {
      method: 'POST',
      data: payload,
    });
  },

  async updateProject(projectId: string, payload: UpdateProjectPayload): Promise<Project> {
    return apiClient.request<Project>(`/api/projects/${projectId}`, {
      method: 'PATCH',
      data: payload,
    });
  },

  async deleteProject(projectId: string): Promise<void> {
    await apiClient.request(`/api/projects/${projectId}`, { method: 'DELETE' });
  },
};
