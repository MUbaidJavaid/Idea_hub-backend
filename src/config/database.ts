import mongoose from 'mongoose';

import { logger } from '../lib/logger.js';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    logger.warn(
      'MONGODB_URI is not set — database features disabled; /health will show mongo disconnected'
    );
    return;
  }

  mongoose.connection.on('connected', () =>
    logger.info({ service: 'mongodb' }, 'MongoDB connected')
  );
  mongoose.connection.on('error', (err) =>
    logger.error({ err, service: 'mongodb' }, 'MongoDB error')
  );
  mongoose.connection.on('disconnected', () =>
    logger.warn({ service: 'mongodb' }, 'MongoDB disconnected')
  );

  const maxPoolSize = Math.min(
    50,
    Math.max(5, Number(process.env.MONGODB_MAX_POOL_SIZE) || 15)
  );

  await mongoose.connect(uri, {
    maxPoolSize,
    minPoolSize: Math.min(2, maxPoolSize),
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45_000,
  });

  logger.info(
    {
      service: 'mongodb',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    },
    'MongoDB ready'
  );
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info({ service: 'mongodb' }, 'MongoDB disconnected gracefully');
}
