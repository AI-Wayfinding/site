// @ts-check
import { defineConfig } from 'astro/config';

// Static output only. Cloudflare serves dist/ as Worker static assets.
export default defineConfig({
  site: 'https://wayfinding.support',
  output: 'static',
});
