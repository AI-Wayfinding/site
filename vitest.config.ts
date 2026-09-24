import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';

export default defineConfig({
  // The pool's bundled workerd stops at this date; production uses wrangler.jsonc's newer date.
  plugins: [cloudflareTest({ miniflare: { compatibilityDate: '2026-08-22' } })],
  test: { include: ['worker/**/*.test.ts'] },
});
