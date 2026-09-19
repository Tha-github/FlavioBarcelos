import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

/** Serve o build (dist/) com os cabeçalhos reais de vercel.json. Só para testes locais. */
const root = path.resolve('dist');
const config = JSON.parse(await readFile('vercel.json', 'utf8')) as {
  headers: { headers: { key: string; value: string }[] }[];
};
const mime: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
};
createServer(async (req, res) => {
  try {
    for (const header of config.headers[0]!.headers) res.setHeader(header.key, header.value);
    const url = new URL(req.url ?? '/', 'http://127.0.0.1:4322');
    const pathname = decodeURIComponent(url.pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.statusCode = 403;
      res.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    } catch {
      file = path.join(root, '404.html');
      res.statusCode = 404;
    }
    res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.statusCode = 500;
    res.end('Test server error');
  }
}).listen(4322, '127.0.0.1');
