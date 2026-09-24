# Wayfinding site

Static Astro site for `wayfinding.support`, deployed as a Cloudflare Worker with static assets.

- `src/pages/index.astro`: landing page with the paste-to-agent block.
- `public/start.md`: the instructions an agent fetches with `curl`. Served as `text/markdown` via `public/_headers`.
- Framework text is not published here until it is cleared; see [framework/SOURCE-STATUS.md](../framework/SOURCE-STATUS.md).
- Published with Dan's approval on 2026-09-23: the landing page's framework headings and short phrases (the Triangle, Discover/Evaluate/Execute, the three stages, the seven principle titles) and the 20 interview quotes with their role-only credits in `src/data/site.ts`. The full framework text is still not published.

```sh
npm run dev      # local dev server
npm run build    # static build to dist/
npm run check    # astro type check
npm run deploy   # build, then wrangler deploy (needs CLOUDFLARE_API_TOKEN)
```

The Cloudflare account is recorded in `wrangler.jsonc`. It is the Reset Enterprise account for now; moving to a Hypha-owned account is planned.
