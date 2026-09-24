# wayfinding.support

The website for [AI Wayfinding](https://wayfinding.support): a static Astro site served by a Cloudflare Worker, plus the Worker that handles the contact form.

- `src/pages/index.astro`: the landing page, including the copy-into-your-agent block.
- `worker/index.ts`: serves the static site and handles `POST /api/contact`.
- The agent instructions live in [AI-Wayfinding/getting-started](https://github.com/AI-Wayfinding/getting-started). This site links to them and keeps no copy.
- The framework headings and short phrases on the page, and the 20 interview quotes with role-only credits in `src/data/site.ts`, are published with approval. The full framework text is not published here.

## Develop

```sh
npm install
npm run dev      # local dev server
npm test         # Worker tests
npm run check    # Astro and Worker type checks
npm run build    # static build to dist/
```

## Contact form

Checks run in this order; any failure stops the request and no email is sent:

1. Cloudflare WAF rate limit on `POST /api/contact` (configured on the zone).
2. Size, content type and field validation, plus a hidden honeypot field.
3. Worker rate limit (a second, looser layer).
4. [Turnstile](https://developers.cloudflare.com/turnstile/) token verified server-side, tied to `wayfinding.support`.
5. Email through a `send_email` binding locked to one destination.

Nothing is stored.

## Deploy

The contact-form destination address is private and is not committed. `wrangler.jsonc` holds a placeholder. `deploy.sh` reads the real address and deploys with a temporary config.

```sh
echo 'CONTACT_TO=someone@example.org' > .deploy.env   # untracked
export CLOUDFLARE_API_TOKEN=...                      # never commit
npm run deploy
```

The Turnstile secret is a Worker secret, set once with `npx wrangler secret put TURNSTILE_SECRET_KEY`.

## Licence

Code: MIT (see `LICENSE`). Page text and quotes are not licensed for reuse.
