/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  CONTACT_EMAIL: SendEmail;
  CONTACT_LIMIT: RateLimit;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
}

const fail = (status: number) => Response.json({ ok: false, error: 'Unable to send your message.' }, { status });

async function contact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return fail(405);
  if (request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') return fail(415);

  const reader = request.body?.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  if (reader) {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          return fail(413);
        }
        chunks.push(value);
      }
    } catch { return fail(size > 8192 ? 413 : 400); }
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let data: unknown;
  try { data = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return fail(400); }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return fail(400);
  if ('website' in data && data.website !== '' && data.website !== undefined) return Response.json({ ok: true });

  const name = 'name' in data ? data.name : undefined;
  const email = 'email' in data ? data.email : undefined;
  const topic = 'topic' in data ? data.topic : undefined;
  const message = 'message' in data ? data.message : undefined;
  const token = 'turnstileToken' in data ? data.turnstileToken : undefined;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
      typeof email !== 'string' || email.length > 254 || /[\r\n]/.test(email) ||
      !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(email) ||
      (topic !== 'join' && topic !== 'facilitator' && topic !== 'share' && topic !== 'other') ||
      typeof message !== 'string' || !message.trim() || message.length > 4000) return fail(400);

  try {
    if (!(await env.CONTACT_LIMIT.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' })).success) return fail(429);
  } catch { return fail(503); }
  if (typeof token !== 'string' || !token || !env.TURNSTILE_SECRET_KEY) return fail(403);

  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY, response: token, idempotency_key: crypto.randomUUID(),
  });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    if (!verification.ok) return fail(403);
    const result: unknown = await verification.json();
    if (typeof result !== 'object' || result === null || !('success' in result) || result.success !== true ||
        !('hostname' in result) || result.hostname !== (env.TURNSTILE_EXPECTED_HOSTNAME || 'wayfinding.support')) return fail(403);
  } catch { return fail(403); }

  const labels = { join: 'join the network', facilitator: 'work with a facilitator', share: 'share a lesson', other: 'something else' };
  const country = (request as Request & { cf?: { country?: string } }).cf?.country;
  const text = [
    `Name: ${name}`, `Email: ${email}`, `Topic: ${labels[topic]}`, `Message:`, message,
    `Submitted at: ${new Date().toISOString()}`,
    ...(typeof country === 'string' ? [`Country: ${country}`] : []),
  ].join('\n');
  try {
    await env.CONTACT_EMAIL.send({
      to: 'contact-destination@example.invalid', from: 'noreply@wayfinding.support', replyTo: email,
      subject: `[wayfinding.support] ${labels[topic]} from ${name}`, text,
    });
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
      ? error.code : 'unknown';
    console.error('Contact email send failed:', code);
    return fail(502);
  }
  return Response.json({ ok: true });
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    let pathname: string;
    try { pathname = new URL(request.url).pathname; }
    catch { return Promise.resolve(fail(400)); }
    if (pathname !== '/api/contact') return env.ASSETS.fetch(request);
    return contact(request, env);
  },
};
