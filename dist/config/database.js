import mongoose from 'mongoose';
import { logger } from '../lib/logger.js';
function looksLikeLocalMongo(uri) {
    return /mongodb:\/\/([^/@]*@)?(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/i.test(uri);
}
export async function connectDatabase() {
    const uri = process.env.MONGODB_URI?.trim();
    const prod = process.env.NODE_ENV === 'production';
    if (!uri) {
        if (prod) {
            throw new Error('MONGODB_URI is required in production. In Render: add Environment → MONGODB_URI with your MongoDB Atlas connection string (mongodb+srv://...), or use Render MongoDB.');
        }
        logger.warn('MONGODB_URI is not set — database features disabled; /health will show mongo disconnected');
        return;
    }
    if (prod && looksLikeLocalMongo(uri)) {
        throw new Error('MONGODB_URI points to localhost, which is not available on Render. Use MongoDB Atlas (mongodb+srv://...) and allow your Render outbound IPs or 0.0.0.0/0 in Atlas Network Access.');
    }
    mongoose.connection.on('connected', () => logger.info({ service: 'mongodb' }, 'MongoDB connected'));
    mongoose.connection.on('error', (err) => logger.error({ err, service: 'mongodb' }, 'MongoDB error'));
    mongoose.connection.on('disconnected', () => logger.warn({ service: 'mongodb' }, 'MongoDB disconnected'));
    const maxPoolSize = Math.min(50, Math.max(5, Number(process.env.MONGODB_MAX_POOL_SIZE) || 15));
    await mongoose.connect(uri, {
        maxPoolSize,
        minPoolSize: Math.min(2, maxPoolSize),
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45_000,
    });
    logger.info({
        service: 'mongodb',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
    }, 'MongoDB ready');
}
export async function disconnectDatabase() {
    await mongoose.disconnect();
    logger.info({ service: 'mongodb' }, 'MongoDB disconnected gracefully');
}
//# sourceMappingURL=database.js.map