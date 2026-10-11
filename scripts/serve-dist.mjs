/**
 * Sirve dist/ como archivos estáticos, igual que Netlify.
 * Sirve para comprobar que la build funciona como sitio estático puro.
 *
 *   node scripts/serve-dist.mjs [puerto]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = pathResolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || 4399);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function safePath(p) {
  return join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let file = safePath(decodeURIComponent(url.pathname));

  try {
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = join(file, 'index.html');

    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    // Netlify devuelve 404 plano cuando no existe.
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
  }
}).listen(PORT, () => console.log(`dist/ servido en http://localhost:${PORT}`));