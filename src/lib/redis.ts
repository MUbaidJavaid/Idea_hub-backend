import { Redis } from 'ioredis';

import { logger } from './logger.js';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: false,
    });
    client.on('error', (err: Error) =>
      logger.error({ err, service: 'redis' }, 'Redis connection error')
    );
    client.on('connect', () =>
      logger.info({ service: 'redis' }, 'Redis connected')
    );
    return client;
  } catch (err) {
    logger.error({ err, service: 'redis' }, 'Redis init failed');
    return null;
  }
}

export async function closeRedis(): Promise<void> {
  if (!client) return;
  try {
    await client.quit();
  } catch {
    /* ignore */
  }
  client = null;
}
