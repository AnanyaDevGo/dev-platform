import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = `rate:${req.ip}`;
  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, 60);
  }

  if (current > 100) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  next();
}
