import { Request, Response, NextFunction } from 'express';
import { isRedisAvailable, redisClient } from '../redis';

const WINDOW_LIMIT = 100;
const memoryHits = new Map<string, { count: number; resetAt: number }>();

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = `rate:${req.ip}`;

  if (!isRedisAvailable()) {
    const now = Date.now();
    const current = memoryHits.get(key);

    if (!current || current.resetAt < now) {
      memoryHits.set(key, { count: 1, resetAt: now + 60_000 });
      return next();
    }

    current.count += 1;
    if (current.count > WINDOW_LIMIT) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    return next();
  }

  try {
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, 60);
    }

    if (current > WINDOW_LIMIT) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
  } catch (error) {
    console.error('Rate limiter skipped:', error);
  }

  next();
}
