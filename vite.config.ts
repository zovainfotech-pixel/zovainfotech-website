import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { allIndexablePaths } from './src/data/routes'

/**
 * Emits robots.txt and (when VITE_SITE_URL is set) sitemap.xml at build time.
 * The production domain is only used once it is explicitly configured.
 */
function seoFiles(siteUrl: string | undefined): Plugin {
  return {
    name: 'zova-seo-files',
    apply: 'build',
    generateBundle() {
      const origin = siteUrl?.trim().replace(/\/$/, '')
      const robots = ['User-agent: *', 'Allow: /', ...(origin ? [`Sitemap: ${origin}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })
      if (!origin) {
        this.warn('VITE_SITE_URL is not set — sitemap.xml was not generated and canonical URLs are disabled.')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const urls = allIndexablePaths()
        .map((p) => `  <url><loc>${origin}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

/**
 * Serves /api/enquiry during `vite` local development.
 * Forwards requests to handleEnquiry in api/enquiry.ts with full body parsing and CORS.
 */
function devApiPlugin(): Plugin {
  return {
    name: 'zova-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:5173'}`)
        if (url.pathname !== '/api/enquiry') {
          return next()
        }
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          return res.end()
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', async () => {
          try {
            const body = Buffer.concat(chunks).toString('utf-8')
            const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1'
            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(', ') : value)
              }
            }
            headers.set('x-forwarded-for', clientIp)

            const webReq = new Request(url.href, {
              method: 'POST',
              headers,
              body,
            })

            const { handleEnquiry } = await import('./api/enquiry.ts')
            const response = await handleEnquiry(webReq)

            res.statusCode = response.status
            response.headers.forEach((val, key) => {
              res.setHeader(key, val)
            })
            const responseText = await response.text()
            res.end(responseText)
          } catch (err) {
            console.error('[dev-api] Error handling /api/enquiry:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Internal server error in dev api' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)
  return {
    // `vite build --mode preview-single` produces one self-contained HTML file (used for shareable previews).
    plugins: [react(), tailwindcss(), devApiPlugin(), seoFiles(env.VITE_SITE_URL), ...(mode === 'preview-single' ? [viteSingleFile()] : [])],
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 700,
    },
  }
})
