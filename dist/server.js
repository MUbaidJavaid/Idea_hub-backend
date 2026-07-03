import 'dotenv/config';
import { createApp } from './app.js';
import { ensureApiReady } from './bootstrap-api.js';
import { logger } from './lib/logger.js';
const PORT = Number(process.env.PORT) || 10000;
async function startBackgroundJobs() {
    await import('./jobs/ai-coach-daily.cron.js');
    await import('./jobs/live-rooms.cron.js');
    await import('./jobs/trending-tags.cron.js');
    await import('./jobs/trending.cron.js');
    await import('./jobs/validation.cron.js');
    await import('./jobs/weekly-challenge.cron.js');
}
async function main() {
    await ensureApiReady();
    await startBackgroundJobs();
    const app = createApp();
    const server = app.listen(PORT);
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger.error({ port: PORT, code: err.code }, 'Port already in use — stop the other process or set PORT in .env');
        }
        else {
            logger.error({ err }, 'HTTP server error');
        }
        process.exit(1);
    });
    server.on('listening', () => {
        logger.info({ port: PORT, url: `http://localhost:${PORT}` }, 'HTTP server listening');
    });
}
main().catch((err) => {
    logger.fatal({ err }, 'failed to start');
    process.exit(1);
});
//# sourceMappingURL=server.js.map