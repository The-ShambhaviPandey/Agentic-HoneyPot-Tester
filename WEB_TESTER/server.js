/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   🍯  HoneyTrap Web Tester — Express Backend                 ║
 * ║                                                              ║
 * ║   Usage:                                                     ║
 * ║     npm install express                                      ║
 * ║     node server.js                                           ║
 * ║     node server.js --port 4000                               ║
 * ║                                                              ║
 * ║   Then open http://localhost:3000 in your browser.           ║
 * ║                                                              ║
 * ║   Routes:                                                    ║
 * ║     GET  /              → serves index.html                  ║
 * ║     POST /api/proxy     → forwards to your honeypot endpoint ║
 * ║     POST /api/callback  → receives final payload POSTed by   ║
 * ║                           your honeypot                      ║
 * ║     GET  /api/poll/:id  → browser polls for callback result  ║
 * ║     GET  /api/status    → health check                       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import express  from 'express';
import path     from 'path';
import { fileURLToPath } from 'url';

// ─── Config ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const getArg  = f => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };

const PORT    = parseInt(getArg('--port') || process.env.PORT || '3333');
const __dir   = path.dirname(fileURLToPath(import.meta.url));

// ─── In-memory callback store ─────────────────────────────────────────────────
// Map<sessionId, { payload, receivedAt }>
// Also stores under '__latest__' so the browser can grab it even if session ID
// wasn't matched (handles slight session-ID formatting differences).
const callbackStore = new Map();

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '2mb' }));

// ── Serve index.html ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dir, 'index.html'));
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ ok: true, storedCallbacks: callbackStore.size });
});

// ── Proxy: browser → this server → honeypot ──────────────────────────────────
//
// Request body (from browser):
//   { targetUrl, headers, body }
//
// Response: exactly whatever the honeypot returned, plus a synthetic
//   _meta: { status, elapsed } field so the browser knows HTTP status
//   without reading response headers.
//
app.post('/api/proxy', async (req, res) => {
  const { targetUrl, headers: extraHeaders = {}, body: honeypotBody } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  const t0 = Date.now();

  try {
    const upstream = await fetch(targetUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      body:    JSON.stringify(honeypotBody),
      signal:  AbortSignal.timeout(31_000),
    });

    const elapsed = Date.now() - t0;
    let data = null;
    try { data = await upstream.json(); } catch (_) {}

    // Attach meta so the browser can read HTTP status without CORS issues
    res.json({
      ...(data ?? {}),
      _meta: { status: upstream.status, elapsed },
    });

  } catch (err) {
    const elapsed = Date.now() - t0;
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';

    res.status(502).json({
      error:    timedOut ? `Timeout after ${elapsed}ms` : err.message,
      timedOut,
      _meta:    { status: 0, elapsed },
    });
  }
});

// ── Callback receiver: honeypot → this server ─────────────────────────────────
//
// Your honeypot should POST its final payload to:
//   http://localhost:3000/api/callback
//
// The payload must contain a `sessionId` field for matching, but we also
// store under '__latest__' as a fallback.
//
app.post('/api/callback', (req, res) => {
  const payload = req.body;
  const sid     = payload?.sessionId || null;
  const entry   = { payload, receivedAt: Date.now() };

  if (sid) {
    callbackStore.set(sid, entry);
    console.log(`[callback] Received payload for session: ${sid}`);
  } else {
    console.log('[callback] Received payload (no sessionId in body — stored under __latest__)');
  }
  // Always store latest for polling fallback
  callbackStore.set('__latest__', entry);

  // Clean up stale entries (older than 30 min)
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [k, v] of callbackStore.entries()) {
    if (v.receivedAt < cutoff) callbackStore.delete(k);
  }

  res.json({ status: 'received', sessionId: sid });
});

// ── Poll: browser asks "any callback for this session yet?" ───────────────────
//
// Returns 200 + payload if found, 204 if not yet received.
// The browser polls this every second while waiting.
//
app.get('/api/poll/:sessionId', (req, res) => {
  const sid = req.params.sessionId;

  // Try exact match first, then '__latest__' fallback
  const entry = callbackStore.get(sid) || callbackStore.get('__latest__');

  if (!entry) {
    return res.status(204).end();
  }

  // Remove so it's only consumed once
  callbackStore.delete(sid);
  if (callbackStore.get('__latest__') === entry) {
    callbackStore.delete('__latest__');
  }

  res.json(entry.payload);
});

// ── Clear a specific session's pending callback (optional housekeeping) ───────
app.delete('/api/poll/:sessionId', (req, res) => {
  callbackStore.delete(req.params.sessionId);
  res.json({ deleted: true });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🍯  HoneyTrap Web Tester running');
  console.log(`  →  Open http://localhost:${PORT} in your browser`);
  console.log(`  →  Set your honeypot's FINAL_CALLBACK_URL to:`);
  console.log(`       http://localhost:${PORT}/api/callback`);
  console.log('');
});