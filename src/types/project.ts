export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  completedAt?: string;
}
