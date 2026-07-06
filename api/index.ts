/**
 * Vercel HTTP handler — re-exports compiled app from `npm run build`.
 * Avoids @vercel/node re-bundling `src/` with different ESM interop than tsc.
 */
export { default } from '../dist/index.js';
