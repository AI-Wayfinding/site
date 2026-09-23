# Wayfinding site

Static Astro site for `wayfinding.support`, deployed as a Cloudflare Worker with static assets.

- `src/pages/index.astro`: landing page with the paste-to-agent block.
- `public/start.md`: the instructions an agent fetches with `curl`. Served as `text/markdown` via `public/_headers`.
- Framework text is not published here until it is cleared; see [framework/SOURCE-STATUS.md](../framework/SOURCE-STATUS.md).

```sh
npm run dev      # local dev server
npm run build    # static build to dist/
npm run check    # astro type check
npm run deploy   # build, then wrangler deploy (needs CLOUDFLARE_API_TOKEN)
```

The Cloudflare account is recorded in `wrangler.jsonc`. It is the Reset Enterprise account for now; moving to a Hypha-owned account is planned.
