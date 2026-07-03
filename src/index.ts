/**
 * Vercel serverless entry — zero-config Express detection.
 * Local long-running server: use `npm run dev` / `npm start` (src/server.ts).
 */
import 'dotenv/config';

import { createApp } from './app.js';

export default createApp();
