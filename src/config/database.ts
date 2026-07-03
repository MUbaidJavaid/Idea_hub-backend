import mongoose from 'mongoose';

import { logger } from '../lib/logger.js';

function looksLikeLocalMongo(uri: string): boolean {
  return /mongodb:\/\/([^/@]*@)?(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/i.test(
    uri
  );
}

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  const prod = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (prod) {
      throw new Error(
        'MONGODB_URI is required in production. In Render: add Environment → MONGODB_URI with your MongoDB Atlas connection string (mongodb+srv://...), or use Render MongoDB.'
      );
    }
    logger.warn(
      'MONGODB_URI is not set — database features disabled; /health will show mongo disconnected'
    );
    return;
  }

  if (prod && looksLikeLocalMongo(uri)) {
    throw new Error(
      'MONGODB_URI points to localhost, which is not available on Vercel or Render. Use MongoDB Atlas (mongodb+srv://...) and allow 0.0.0.0/0 (or Vercel IPs) in Atlas Network Access.'
    );
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

  const onVercel =
    process.env.VERCEL === '1' || process.env.VERCEL === 'true';
  const defaultPool = onVercel ? 1 : 15;
  const maxPoolSize = Math.min(
    50,
    Math.max(1, Number(process.env.MONGODB_MAX_POOL_SIZE) || defaultPool)
  );

  try {
    await mongoose.connect(uri, {
      maxPoolSize,
<<<<<<< HEAD
      minPoolSize: onVercel ? 1 : Math.min(2, maxPoolSize),
=======
      minPoolSize: Math.min(2, maxPoolSize),
>>>>>>> 0e670fbc074c1080c80bfe3d23718fecfdd65372
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code =
      err && typeof err === 'object' && 'code' in err
        ? Number((err as { code: unknown }).code)
        : undefined;
    if (
      code === 8000 ||
      /bad auth|Authentication failed/i.test(msg)
    ) {
      logger.fatal(
        { err },
        'MongoDB authentication failed. In Atlas: Database Access → reset the user password → Connect → Drivers → copy URI. ' +
          'If the password has @ : / ? # [ ] characters, URL-encode them in MONGODB_URI (e.g. @ → %40).'
      );
    }
    throw err;
  }

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
