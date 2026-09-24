# Wayfinding site

Static Astro site for `wayfinding.support`, deployed as a Cloudflare Worker with static assets.

- `src/pages/index.astro`: landing page with the paste-to-agent block.
- The agent instructions live in the public repository [AI-Wayfinding/getting-started](https://github.com/AI-Wayfinding/getting-started). The copy block points agents straight at its raw `instructions/start.md`; this site keeps no copy.
- Framework text is not published here until it is cleared; see [framework/SOURCE-STATUS.md](../framework/SOURCE-STATUS.md).
- Published with Dan's approval on 2026-09-23: the landing page's framework headings and short phrases (the Triangle, Discover/Evaluate/Execute, the three stages, the seven principle titles) and the 20 interview quotes with their role-only credits in `src/data/site.ts`. The full framework text is still not published.

```sh
npm run dev      # local dev server
npm run build    # static build to dist/
npm run check    # astro type check
npm run deploy   # build, then wrangler deploy (needs CLOUDFLARE_API_TOKEN)
```

The Cloudflare account is recorded in `wrangler.jsonc`. It is the Reset Enterprise account for now; moving to a Hypha-owned account is planned.
