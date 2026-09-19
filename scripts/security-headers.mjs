import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? htmlFiles(path.join(dir, entry.name))
        : entry.name.endsWith('.html')
          ? [path.join(dir, entry.name)]
          : [],
    ),
  );
  return nested.flat();
}
const hashes = new Set();
for (const file of await htmlFiles('dist')) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
    // JSON-LD é dado, não script executável: não entra na CSP.
    if (/type\s*=\s*["']application\/ld\+json["']/i.test(match[1])) continue;
    hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
}
const csp = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  `script-src 'self' https://www.googletagmanager.com ${[...hashes].sort().join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  'frame-src https://www.google.com',
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com",
  "font-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');
const headers = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];
await writeFile(
  'vercel.json',
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      framework: 'astro',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      headers: [{ source: '/(.*)', headers }],
    },
    null,
    2,
  ) + '\n',
);
const netlify = '/*\n' + headers.map(({ key, value }) => `  ${key}: ${value}`).join('\n') + '\n';
await writeFile('public/_headers', netlify);
await writeFile('dist/_headers', netlify);
console.log(
  `Cabeçalhos gerados: ${hashes.size} hashes de scripts inline, sem unsafe-inline em script-src.`,
);
