import type { HealthReport } from '../services/health.service.js';

function statusColor(status: HealthReport['status']): string {
  if (status === 'healthy') return '#22c55e';
  if (status === 'degraded') return '#f59e0b';
  return '#ef4444';
}

function boolBadge(on: boolean, onLabel = 'ON', offLabel = 'OFF'): string {
  const color = on ? '#22c55e' : '#64748b';
  const label = on ? onLabel : offLabel;
  return `<span style="color:${color};font-weight:600">${label}</span>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="color:#94a3b8;padding:8px 12px;border-bottom:1px solid #1e293b">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#e2e8f0">${value}</td></tr>`;
}

export function renderHealthPage(report: HealthReport): string {
  const color = statusColor(report.status);
  const mongoOk = report.mongodb.connected;
  const redisLabel = !report.redis.configured
    ? 'not configured'
    : report.redis.connected
      ? `connected (${report.redis.pingMs}ms)`
      : `down — ${report.redis.error ?? 'error'}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="30" />
  <title>Ideas Hub API — Health</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #070d16;
      color: #e2e8f0;
      padding: 24px 16px 48px;
    }
    .wrap { max-width: 880px; margin: 0 auto; }
    h1 { margin: 0 0 4px; font-size: 1.75rem; }
    .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border: 1px solid ${color}55;
      background: ${color}18;
      color: ${color};
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .card {
      background: #0f172a99;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px;
    }
    .card h2 {
      margin: 0 0 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #00f2ff;
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .stat { font-size: 1.5rem; font-weight: 700; color: #00f2ff; }
    .stat-label { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
    a { color: #00f2ff; }
    footer { margin-top: 24px; font-size: 0.8rem; color: #475569; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Ideas Hub API</h1>
    <p class="sub">Server health &amp; status dashboard</p>
    <div class="badge">${report.status}</div>

    <div class="grid">
      <div class="card">
        <h2>Uptime</h2>
        <div class="stat">${report.uptime.human}</div>
        <div class="stat-label">Running since ${report.startedAt}</div>
      </div>
      <div class="card">
        <h2>MongoDB</h2>
        <div class="stat" style="color:${mongoOk ? '#22c55e' : '#ef4444'}">${mongoOk ? 'OK' : 'DOWN'}</div>
        <div class="stat-label">${report.mongodb.pingMs != null ? `ping ${report.mongodb.pingMs}ms` : report.mongodb.error ?? report.mongodb.state}</div>
      </div>
      <div class="card">
        <h2>Runtime</h2>
        <div class="stat" style="font-size:1.1rem">${report.runtime.mode}</div>
        <div class="stat-label">Node ${report.runtime.nodeVersion} · ${report.runtime.env}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>Server</h2>
      <table>
        ${row('Checked at', report.checkedAt)}
        ${row('Started at', report.startedAt)}
        ${row('Uptime', `${report.uptime.human} (${report.uptime.seconds}s)`)}
        ${row('Service URL', report.server.url ?? '—')}
        ${row('Port', report.server.port != null ? String(report.server.port) : 'serverless')}
        ${row('Vercel region', report.server.region ?? '—')}
        ${row('Deployment', report.server.deployment ?? '—')}
        ${row('Process PID', String(report.runtime.pid))}
      </table>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>MongoDB</h2>
      <table>
        ${row('Configured', report.mongodb.configured ? 'yes' : 'no')}
        ${row('State', report.mongodb.state)}
        ${row('Connected', mongoOk ? 'yes' : 'no')}
        ${row('Ping', report.mongodb.pingMs != null ? `${report.mongodb.pingMs} ms` : '—')}
        ${row('Database', report.mongodb.database ?? '—')}
        ${row('Host', report.mongodb.host ?? '—')}
        ${row('Error', report.mongodb.error ?? '—')}
      </table>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>Redis</h2>
      <table>
        ${row('Status', redisLabel)}
        ${row('Ping', report.redis.pingMs != null ? `${report.redis.pingMs} ms` : '—')}
      </table>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>Features</h2>
      <table>
        ${row('Validation engine', boolBadge(report.features.validationEngine))}
        ${row('Gamification', boolBadge(report.features.gamification))}
        ${row('AI Coach', boolBadge(report.features.aiCoach))}
        ${row('Live rooms', boolBadge(report.features.liveRooms))}
        ${row('Background crons', boolBadge(report.features.backgroundCrons, 'running', 'serverless (off)'))}
      </table>
    </div>

    <div class="card">
      <h2>Memory (MB)</h2>
      <table>
        ${row('RSS', String(report.process.memoryMb.rss))}
        ${row('Heap used', String(report.process.memoryMb.heapUsed))}
        ${row('Heap total', String(report.process.memoryMb.heapTotal))}
        ${row('External', String(report.process.memoryMb.external))}
      </table>
    </div>

    <footer>
      JSON: <a href="/health">/health</a> · Auto-refresh 30s
    </footer>
  </div>
</body>
</html>`;
}
