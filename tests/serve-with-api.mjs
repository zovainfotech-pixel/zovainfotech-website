/**
 * Local test server: serves the production build (dist/) and runs the real
 * api/enquiry.ts handler at /api/enquiry, with Resend replaced by an in-process
 * mock (nothing is emailed). Used by the browser tests.
 *
 *   npm run build && npm run serve:test      → http://localhost:4174
 *   GET /__test/sent   lists the emails the handler asked "Resend" to send
 *   POST /__test/mode  body "ok" | "fail500" | "fail403" switches the mock's response
 */
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname
const PORT = Number(process.env.PORT ?? 4174)
const sent = []
let mode = 'ok'

const mock = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    sent.push({ idempotencyKey: req.headers['idempotency-key'], ...JSON.parse(body) })
    if (mode === 'fail500') return res.writeHead(500, { 'Content-Type': 'application/json' }).end('{"message":"mock outage"}')
    if (mode === 'fail403') return res.writeHead(403, { 'Content-Type': 'application/json' }).end('{"message":"You can only send testing emails to your own email address"}')
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id: `mock-${sent.length}` }))
  })
})
await new Promise((r) => mock.listen(0, '127.0.0.1', r))
process.env.RESEND_API_KEY ??= 're_local_test'
process.env.RESEND_API_BASE = `http://127.0.0.1:${mock.address().port}`
const { handleEnquiry } = await import('../api/enquiry.ts')

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' }

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (url.pathname === '/__test/sent') return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(sent))
    if (url.pathname === '/__test/mode') {
      let b = ''
      req.on('data', (c) => (b += c))
      req.on('end', () => {
        mode = b.trim() || 'ok'
        res.writeHead(200).end(mode)
      })
      return
    }
    if (url.pathname === '/api/enquiry') {
      let body = ''
      req.on('data', (c) => (body += c))
      req.on('end', async () => {
        const r = await handleEnquiry(
          new Request(url, { method: req.method, headers: { ...req.headers, 'x-forwarded-for': `${req.socket.remoteAddress}-${Math.random()}` }, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body }),
        )
        res.writeHead(r.status, Object.fromEntries(r.headers)).end(await r.text())
      })
      return
    }
    let file = normalize(join(DIST, decodeURIComponent(url.pathname)))
    if (!file.startsWith(DIST)) return res.writeHead(403).end()
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    } catch {
      file = join(DIST, 'index.html')
    }
    try {
      res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(await readFile(file))
    } catch {
      res.writeHead(200, { 'Content-Type': 'text/html' }).end(await readFile(join(DIST, 'index.html')))
    }
  })
  .listen(PORT, () => console.log(`test server with /api/enquiry on http://localhost:${PORT}`))
