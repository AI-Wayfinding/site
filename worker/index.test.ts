import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './index';

const valid = {
  name: 'Ada', email: 'ada@example.org', topic: 'join', message: 'Please add me.',
  turnstileToken: 'valid-token',
};
function setup() {
  const send = vi.fn(async (_message: EmailMessage | EmailMessageBuilder) => ({ messageId: 'sent' }));
  const limit = vi.fn(async () => ({ success: true }));
  const assets = vi.fn(async () => new Response('static'));
  const env = {
    ASSETS: { fetch: assets }, CONTACT_EMAIL: { send }, CONTACT_LIMIT: { limit },
    TURNSTILE_SECRET_KEY: 'test-secret', TURNSTILE_SITE_KEY: 'test-site',
    TURNSTILE_EXPECTED_HOSTNAME: 'wayfinding.support',
  };
  const verify = vi.fn(async (_url: RequestInfo | URL, _init: RequestInit) => Response.json({ success: true, hostname: 'wayfinding.support' }));
  vi.stubGlobal('fetch', verify);
  return { env, send, limit, assets, verify };
}
function post(body: unknown = valid, headers: HeadersInit = { 'Content-Type': 'application/json' }) {
  return new Request('https://wayfinding.support/api/contact', {
    method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('contact endpoint', () => {
  it('rejects GET without sending email', async () => {
    const { env, send, assets } = setup();
    const response = await worker.fetch(new Request('https://wayfinding.support/api/contact'), env);
    expect(response.status).toBe(405);
    expect(send).not.toHaveBeenCalled();
    expect(assets).not.toHaveBeenCalled();
  });

  it('passes other paths to assets unchanged', async () => {
    const { env, send, assets } = setup();
    const request = new Request('https://wayfinding.support/other?x=1', { method: 'POST' });
    expect((await worker.fetch(request, env)).status).toBe(200);
    expect(assets).toHaveBeenCalledExactlyOnceWith(request);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects non-JSON content types with 415', async () => {
    const { env, send } = setup();
    expect((await worker.fetch(post(valid, { 'Content-Type': 'text/plain' }), env)).status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects bodies over 8 KiB with 413', async () => {
    const { env, send } = setup();
    expect((await worker.fetch(post({ ...valid, message: 'x'.repeat(8192) }), env)).status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it('fails closed on an interrupted body without sending', async () => {
    const { env, send } = setup();
    const body = new ReadableStream({ start(controller) { controller.error(new Error('read interrupted')); } });
    const request = new Request('https://wayfinding.support/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    });
    const response = await worker.fetch(request, env);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'Unable to send your message.' });
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with 400', async () => {
    const { env, send } = setup();
    expect((await worker.fetch(post('{broken'), env)).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('silently accepts a filled honeypot without sending', async () => {
    const { env, send, limit, verify } = setup();
    const response = await worker.fetch(post({ ...valid, website: 'spam.example' }), env);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
    expect(limit).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it.each([
    ['empty name', { name: '' }],
    ['long name', { name: 'n'.repeat(101) }],
    ['name with CR/LF', { name: 'Ada\r\nBcc: thief@example.org' }],
    ['invalid email', { email: 'not-an-address' }],
    ['email with an invalid domain', { email: 'ada@example.org:evil' }],
    ['long email', { email: `${'a'.repeat(245)}@example.org` }],
    ['email with CR/LF', { email: 'ada@example.org\nBcc: thief@example.org' }],
    ['email with CR', { email: 'ada@example.org\rBcc: thief@example.org' }],
    ['unknown topic', { topic: 'spam' }],
    ['empty message', { message: '  ' }],
    ['long message', { message: 'x'.repeat(4001) }],
  ])('rejects %s with 400 without sending', async (_label, changes) => {
    const { env, send, verify } = setup();
    expect((await worker.fetch(post({ ...valid, ...changes }), env)).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it('returns 429 when the rate limit rejects the caller', async () => {
    const { env, send, limit, verify } = setup();
    limit.mockResolvedValueOnce({ success: false });
    const response = await worker.fetch(post(valid, { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.4' }), env);
    expect(response.status).toBe(429);
    expect(limit).toHaveBeenCalledExactlyOnceWith({ key: '198.51.100.4' });
    expect(send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it('verifies Turnstile then sends exactly one email with only validated fields', async () => {
    const { env, send, verify } = setup();
    const request = post({ ...valid, to: 'thief@example.org', from: 'thief@example.org' }, {
      'Content-Type': 'application/json; charset=utf-8', 'CF-Connecting-IP': '198.51.100.4',
    });
    Object.defineProperty(request, 'cf', { value: { country: 'GB' } });
    const response = await worker.fetch(request, env);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(verify).toHaveBeenCalledOnce();
    const [url, init] = verify.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(URLSearchParams);
    const body = init.body as URLSearchParams;
    expect(body.get('secret')).toBe('test-secret');
    expect(body.get('response')).toBe('valid-token');
    expect(body.get('remoteip')).toBe('198.51.100.4');
    expect(body.get('idempotency_key')).toMatch(/^[0-9a-f-]{36}$/);
    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    if (!('text' in email)) throw new Error('Expected a composed email');
    expect(email).toMatchObject({
      to: 'contact-destination@example.invalid', from: 'noreply@wayfinding.support',
      replyTo: 'ada@example.org', subject: '[wayfinding.support] join the network from Ada',
    });
    expect(email.text).toContain('Name: Ada');
    expect(email.text).toContain('Email: ada@example.org');
    expect(email.text).toContain('Topic: join the network');
    expect(email.text).toContain('Please add me.');
    expect(email.text).toContain('Country: GB');
    expect(email.text).toMatch(/Submitted at: \d{4}-\d{2}-\d{2}T/);
    expect(JSON.stringify(email)).not.toContain('198.51.100.4');
    expect(JSON.stringify(email)).not.toContain('thief@example.org');
  });

  it('accepts a test hostname only when configured for it', async () => {
    const { env, send, limit, verify } = setup();
    env.TURNSTILE_EXPECTED_HOSTNAME = 'test.invalid';
    verify.mockResolvedValueOnce(Response.json({ success: true, hostname: 'test.invalid' }));
    expect((await worker.fetch(post(), env)).status).toBe(200);
    expect(limit).toHaveBeenCalledExactlyOnceWith({ key: 'unknown' });
    expect(send).toHaveBeenCalledOnce();
  });

  it('requires a Turnstile token before sending', async () => {
    const { env, send, verify } = setup();
    const response = await worker.fetch(post({ ...valid, turnstileToken: '' }), env);
    expect(response.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it.each([
    ['unsuccessful challenge', { success: false, hostname: 'wayfinding.support' }],
    ['wrong hostname', { success: true, hostname: 'attacker.example' }],
  ])('rejects %s without sending', async (_label, result) => {
    const { env, send, verify } = setup();
    verify.mockResolvedValueOnce(Response.json(result));
    expect((await worker.fetch(post(), env)).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it('returns a generic 502 if sending fails, logging only its code', async () => {
    const { env, send } = setup();
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    send.mockRejectedValueOnce(Object.assign(new Error('private details'), { code: 'E_DELIVERY_FAILED' }));
    const response = await worker.fetch(post(), env);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: 'Unable to send your message.' });
    expect(send).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledExactlyOnceWith('Contact email send failed:', 'E_DELIVERY_FAILED');
  });
});
