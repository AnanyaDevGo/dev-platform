import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { deleteCacheKeys, getCachedJson, setCachedJson } from '../redis';

const router = Router();
const PROJECTS_CACHE_KEY = 'cache:api:projects';
const USERS_CACHE_KEY = 'cache:api:users';
const AUDIT_CACHE_KEY = 'cache:api:audit-logs';

router.get('/projects', async (_req: Request, res: Response) => {
  const cached = await getCachedJson(PROJECTS_CACHE_KEY);
  if (cached) {
    return res.json(cached);
  }

  const projects = await prisma.project.findMany({ include: { owner: true } });
  await setCachedJson(PROJECTS_CACHE_KEY, projects);
  res.json(projects);
});

router.post('/projects', async (req: Request, res: Response) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { name, description, status } = req.body;
  if (!name || !status) {
    return res.status(400).json({ message: 'Project name and status are required.' });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status,
      ownerId: req.session.userId,
    },
    include: {
      owner: true,
    },
  });

  await deleteCacheKeys([PROJECTS_CACHE_KEY, AUDIT_CACHE_KEY]);
  res.status(201).json(project);
});

router.get('/audit-logs', async (_req, res) => {
  const cached = await getCachedJson(AUDIT_CACHE_KEY);
  if (cached) {
    return res.json(cached);
  }

  const audits = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  await setCachedJson(AUDIT_CACHE_KEY, audits);
  res.json(audits);
});

router.get('/users', async (_req, res) => {
  const cached = await getCachedJson(USERS_CACHE_KEY);
  if (cached) {
    return res.json(cached);
  }

  const users = await prisma.user.findMany();
  await setCachedJson(USERS_CACHE_KEY, users);
  res.json(users);
});

export default router;
