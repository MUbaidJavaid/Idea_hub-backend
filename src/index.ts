/**
 * Vercel serverless entry (zero-config Express).
 * Local long-running server: npm run dev / npm start → src/server.ts
 */
import 'dotenv/config';

import { createApp } from './app.js';
import { markRuntimeStarted } from './lib/runtime-state.js';

markRuntimeStarted('vercel');

export default createApp();
