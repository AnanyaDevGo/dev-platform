export interface AuditLogEntry {
  id: string;
  event: string;
  details?: string;
  createdAt: string;
  user: {
    id?: string;
    name: string;
    email: string;
  };
}
