import type { User } from '../types/auth';
import type { AuditLogEntry } from '../types/audit';
import type { Project } from '../types/project';

export const demoUsers: User[] = [
  {
    id: 'u-1001',
    name: 'Ananya Pradeep',
    email: 'ananya.pradeep@example.com',
    role: 'ADMIN',
  },
  {
    id: 'u-1002',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    role: 'USER',
  },
  {
    id: 'u-1003',
    name: 'Maya Iyer',
    email: 'maya.iyer@example.com',
    role: 'USER',
  },
];

export const demoProjects: Project[] = [
  {
    id: 'p-2001',
    name: 'Customer Identity Portal',
    description: 'Customer login, profile management, protected routes, and audit-ready access controls.',
    status: 'ACTIVE',
    owner: demoUsers[0],
    createdAt: '2026-06-20T09:30:00.000Z',
  },
  {
    id: 'p-2002',
    name: 'Billing Dashboard',
    description: 'Internal dashboard for subscriptions, invoices, payment status, and customer activity.',
    status: 'PAUSED',
    owner: demoUsers[1],
    createdAt: '2026-06-18T11:00:00.000Z',
  },
  {
    id: 'p-2003',
    name: 'Support Case Tracker',
    description: 'Case assignment, priority tracking, and SLA monitoring for customer support teams.',
    status: 'ACTIVE',
    owner: demoUsers[2],
    createdAt: '2026-06-22T14:15:00.000Z',
  },
];

export const demoAuditLogs: AuditLogEntry[] = [
  {
    id: 'a-3001',
    event: 'User login',
    details: 'Ananya Pradeep signed in from the customer portal.',
    createdAt: '2026-06-29T08:35:00.000Z',
    user: demoUsers[0],
  },
  {
    id: 'a-3002',
    event: 'Project created',
    details: 'Customer Identity Portal was created with ACTIVE status.',
    createdAt: '2026-06-29T08:42:00.000Z',
    user: demoUsers[0],
  },
  {
    id: 'a-3003',
    event: 'Role reviewed',
    details: 'Rahul Mehta access level was reviewed for project collaboration.',
    createdAt: '2026-06-29T09:05:00.000Z',
    user: demoUsers[1],
  },
];
