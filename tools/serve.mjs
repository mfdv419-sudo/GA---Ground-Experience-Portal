#!/usr/bin/env node
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '');
const args = process.argv.slice(2);
const portArg = args.indexOf('--port');
const port = Number(portArg >= 0 ? args[portArg + 1] : 5173) || 5173;
const host = '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.gz': 'application/gzip',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function safePath(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0].split('#')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = normalize(join(root, relative));
  return file === root || file.startsWith(root + sep) ? file : null;
}

const server = createServer((req, res) => {
  try {
    const file = safePath(req.url);
    if (!file || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
  }
});

server.listen(port, host, () => {
  console.log(`Ground Experience Portal: http://${host}:${port}/`);
});
