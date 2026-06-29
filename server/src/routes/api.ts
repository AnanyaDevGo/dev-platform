import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/projects', async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({ include: { owner: true } });
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

  res.status(201).json(project);
});

router.get('/audit-logs', async (_req, res) => {
  const audits = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  res.json(audits);
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
