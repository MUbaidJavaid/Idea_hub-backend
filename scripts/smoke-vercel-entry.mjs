/**
 * Smoke-test the Vercel entry: build dist, load api handler, hit /health.
 * Run: npm run build && node scripts/smoke-vercel-entry.mjs
 */
import http from 'node:http';

const { default: handler } = await import('../api/index.ts');

const server = http.createServer((req, res) => {
  void handler(req, res);
});

await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;

const res = await fetch(`http://127.0.0.1:${port}/health`);
const text = await res.text();
console.log('status', res.status);
console.log('body', text.slice(0, 300));

server.close();
if (res.status >= 500) process.exit(1);
