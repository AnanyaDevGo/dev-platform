import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });

let connected = false;

redisClient.on('ready', () => {
  connected = true;
});

redisClient.on('end', () => {
  connected = false;
});

redisClient.on('error', (error) => {
  connected = false;
  console.error('Redis error:', error);
});

export async function connectRedis() {
  if (redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    connected = false;
    console.error('Redis connection failed:', error);
  }
}

export function isRedisAvailable() {
  return connected && redisClient.isReady;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  const cached = await redisClient.get(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

export async function setCachedJson(key: string, value: unknown, ttlSeconds = 60) {
  if (!isRedisAvailable()) {
    return;
  }

  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
}

export async function deleteCacheKeys(keys: string[]) {
  if (!isRedisAvailable() || keys.length === 0) {
    return;
  }

  await redisClient.del(keys);
}
