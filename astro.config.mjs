// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

// `site` será definido quando o domínio definitivo for confirmado (site.dominio).
export default defineConfig({
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
