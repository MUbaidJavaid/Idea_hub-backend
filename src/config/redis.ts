import { Redis } from 'ioredis';

import { logger } from '../lib/logger.js';

let client: Redis | null = null;

/**
 * Shared ioredis client for BullMQ and app code. Returns null when REDIS_URL is unset
 * (no connection attempt — avoids localhost:6379 ECONNREFUSED on platforms like Render).
 */
export function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
    client.on('error', (err: Error) => {
      logger.error({ err, service: 'redis' }, 'Redis connection error');
    });
    client.on('connect', () => {
      logger.info({ service: 'redis' }, 'Redis connected');
    });
  }
  return client;
}

/** Use when Redis is mandatory (e.g. scanner worker process). */
export function requireRedisClient(): Redis {
  const c = getRedisClient();
  if (!c) {
    throw new Error(
      'REDIS_URL is not set. On Render: create a Redis instance (Render Redis, Upstash, etc.) and set REDIS_URL to the rediss:// or redis:// URL.'
    );
  }
  return c;
}

export async function closeRedisConnection(): Promise<void> {
  if (!client) return;
  try {
    await client.quit();
  } catch {
    /* ignore */
  }
  client = null;
}
