import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const home = source('src/pages/index.astro');

class Element {
  textContent = '';
  hidden = true;
  disabled = false;
  dataset = {};
  attributes = {};
  listeners = new Map();
  children = {};
  classes = new Set();
  classList = {
    add: (value) => this.classes.add(value),
    remove: (value) => this.classes.delete(value),
    contains: (value) => this.classes.has(value),
  };
  addEventListener(name, callback) {
    this.listeners.set(name, [...(this.listeners.get(name) ?? []), callback]);
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  querySelector(selector) { return this.children[selector] ?? null; }
  querySelectorAll(selector) { return this.children[selector] ?? []; }
  async fire(name, event = {}) {
    for (const callback of this.listeners.get(name) ?? []) await callback(event);
  }
}

function view({ reduced = false, clipboardFails = false } = {}) {
  const copy = new Element();
  const prompt = new Element();
  prompt.textContent = 'Prompt';
  const status = new Element();
  const pause = new Element();
  const grid = new Element();
  grid.dataset.voiceSets = JSON.stringify([{ items: [{ q: 'First', who: 'Role' }, { q: 'Second', who: 'Role' }] }]);
  const card = new Element();
  const quote = new Element();
  const text = new Element();
  text.textContent = '“First”';
  grid.children['.voice-card'] = [card];
  card.children['.voice-quote'] = quote;
  quote.children.blockquote = text;
  const media = new Element();
  media.matches = reduced;
  const elements = { '#copy': copy, '#prompt': prompt, '#copy-status': status, '#pause-quotes': pause, '.voice-grid': grid };
  const timeouts = new Map();
  const intervals = new Map();
  let nextId = 1;
  const writes = [];
  const context = {
    document: { querySelector: (selector) => elements[selector] ?? null },
    window: { matchMedia: () => media },
    navigator: { clipboard: { writeText: async (value) => {
      if (clipboardFails) throw new Error('Clipboard denied');
      writes.push(value);
    } } },
    setTimeout: (callback) => { const id = nextId++; timeouts.set(id, callback); return id; },
    clearTimeout: (id) => timeouts.delete(id),
    setInterval: (callback) => { const id = nextId++; intervals.set(id, callback); return id; },
    clearInterval: (id) => intervals.delete(id),
  };
  vm.runInNewContext(ts.transpileModule(home.match(/<script>([\s\S]*?)<\/script>/)[1], {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  return { copy, status, pause, card, quote, text, media, writes, timeouts, intervals,
    tick: () => [...intervals.values()].forEach((fn) => fn()),
    finishFade: () => { const [id, fn] = timeouts.entries().next().value; timeouts.delete(id); fn(); } };
}

test('copy shows visible success only after copying, and explains failure', async () => {
  const success = view();
  await success.copy.fire('click');
  assert.deepEqual(success.writes, ['Prompt']);
  assert.equal(success.copy.textContent, 'Copied');
  assert.equal(success.status.textContent, 'Copied. Paste it into your agent.');

  const failure = view({ clipboardFails: true });
  await failure.copy.fire('click');
  assert.equal(failure.status.textContent, 'Could not copy. Select the text and copy it yourself.');
  assert.notEqual(failure.copy.textContent, 'Copied');
});

test('pause cancels pending quote changes and resume permits rotation', async () => {
  const page = view();
  assert.equal(page.pause.hidden, false);
  assert.equal(page.quote.attributes['aria-live'], 'off');
  page.tick();
  assert.equal(page.timeouts.size, 1);
  await page.pause.fire('click');
  assert.equal(page.pause.textContent, 'Resume quotes');
  assert.equal(page.pause.attributes['aria-pressed'], 'true');
  assert.equal(page.quote.attributes['aria-live'], 'polite');
  assert.equal(page.timeouts.size, 0);
  assert.equal(page.quote.classList.contains('fading'), false);
  page.tick();
  assert.equal(page.text.textContent, '“First”');
  await page.pause.fire('click');
  page.tick();
  page.finishFade();
  assert.equal(page.text.textContent, '“Second”');
});

test('reduced motion disables rotation but still permits manual quote changes', async () => {
  const page = view({ reduced: true });
  assert.equal(page.pause.disabled, true);
  assert.equal(page.pause.textContent, 'Quotes paused for reduced motion');
  page.tick();
  assert.equal(page.timeouts.size, 0);
  assert.equal(page.text.textContent, '“First”');
  await page.card.fire('keydown', { key: 'Enter', preventDefault() {} });
  assert.equal(page.text.textContent, '“Second”');
  assert.equal(page.timeouts.size, 0);
});

test('enabling reduced motion cancels an in-progress fade', async () => {
  const page = view();
  page.tick();
  page.media.matches = true;
  await page.media.fire('change');
  assert.equal(page.timeouts.size, 0);
  assert.equal(page.quote.classList.contains('fading'), false);
  assert.equal(page.pause.textContent, 'Quotes paused for reduced motion');
});

test('skip link, quote label and disclosures remain in place', () => {
  assert.match(home, /class="skip-link" href="#top"/);
  assert.match(home, /<main id="top" tabindex="-1">/);
  assert.match(home, /\.skip-link:focus/);
  assert.match(home, /id="copy-status"[^>]*role="status"/);
  assert.match(home, /Published with permission; names withheld\./);
  assert.match(home, /#pause-quotes\[hidden\] \{ display: none; \}/);
  assert.match(home, /Register interest in the peer network/);
  assert.doesNotMatch(home, /Join other wayfinders/);
  assert.match(home, /Your message goes to us by email\. Cloudflare checks this form for spam\./);
  assert.match(home, /Your answers go to your own AI provider, under its terms\./);
  assert.match(source('public/agents/start.md'), /Your answers go to your own AI provider, under its terms\./);
  for (const path of ['src/pages/index.astro', 'public/agents/install.md', 'public/agents/start.md']) {
    const text = source(path);
    assert.match(text, /Agent links are an exception/);
    assert.match(text, /server still sees details such as who is in a journey and when/);
  }
});
