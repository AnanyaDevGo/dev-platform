import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      event: 'User login',
      details: `Email login for ${email}`,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  return res.json({ accessToken: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already registered.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  req.session.userId = user.id;
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      event: 'User registration',
      details: `New user created: ${email}`,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  return res.status(201).json({ accessToken: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.get('/me', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ message: 'User not found.' });

  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

router.get('/oauth/complete', async (req, res) => {
  const provider = (req.query.provider as string) || 'google';
  const email = `${provider.toLowerCase()}@example.com`;
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(`${provider}-oauth`, 10);
    user = await prisma.user.create({
      data: {
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email,
        password: hashedPassword,
      },
    });
  }

  req.session.userId = user.id;
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      event: 'OAuth login',
      details: `Completed ${provider} OAuth login`,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  return res.json({ accessToken: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out.' });
  });
});

export default router;
