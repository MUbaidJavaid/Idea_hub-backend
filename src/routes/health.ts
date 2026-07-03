import { Router } from 'express';

import { ensureApiReady } from '../bootstrap-api.js';
import { buildHealthReport } from '../services/health.service.js';
import { renderHealthPage } from './health-page.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res, next) => {
  try {
    await ensureApiReady();
    const report = await buildHealthReport();
    const code = report.status === 'unhealthy' ? 503 : 200;
    res.status(code).json(report);
  } catch (err) {
    next(err);
  }
});

healthRouter.get('/health/page', async (_req, res, next) => {
  try {
    await ensureApiReady();
    const report = await buildHealthReport();
    const code = report.status === 'unhealthy' ? 503 : 200;
    res.status(code).type('html').send(renderHealthPage(report));
  } catch (err) {
    next(err);
  }
});

/** Backend root → health dashboard */
healthRouter.get('/', (_req, res) => {
  res.redirect(302, '/health/page');
});
