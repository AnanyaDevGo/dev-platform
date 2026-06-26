import { apiClient } from './api';
import { Project } from '../types/project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return apiClient.request<Project[]>('/projects');
  },
};
