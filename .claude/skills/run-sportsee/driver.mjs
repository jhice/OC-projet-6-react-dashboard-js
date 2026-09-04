// .claude/skills/run-sportsee/driver.mjs
// REPL driver for the SportSee dashboard (Vite + React dev server).
//
// chromium-cli is not available in this environment, so this follows the
// documented fallback: adapt the Electron-example REPL driver, but with
// plain Playwright `chromium` instead of `_electron` (this is a normal web
// page, not a desktop app - no BrowserView/coordinate issues, so regular
// locator-based click/fill work fine).
//
// Designed for agents: wrap in tmux, send-keys commands, capture-pane output.
import { chromium } from 'playwright';
import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Vite's default port is 5173; it picks the next free one if that's taken
// (5174, 5175, ...) - check the "Local:" line `npm run dev` prints and
// override with BASE_URL if it's not 5173.
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/shots';
fs.mkdirSync(SHOT_DIR, { recursive: true });

let browser = null;
let page = null;
const consoleErrors = [];

const COMMANDS = {
  async launch() {
    if (browser) return console.log('already launched');
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    page = await browser.newPage();
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
    console.log('launched.');
  },

  async nav(urlPath) {
    if (!page) return console.log('ERROR: launch first');
    const url = BASE_URL + (urlPath || '/');
    await page.goto(url);
    console.log('nav ->', url);
  },

  // Project-specific shortcut: fills the login form (#username/#password),
  // submits, waits for the redirect to /dashboard.
  // Test users are in NOTES.md, e.g. "sophiemartin password123".
  async login(args) {
    if (!page) return console.log('ERROR: launch first');
    const [username, password] = (args || '').trim().split(/\s+/);
    await page.goto(BASE_URL + '/');
    await page.fill('#username', username || 'sophiemartin');
    await page.fill('#password', password || 'password123');
    await page.click('button[type="submit"]');
    try {
      await page.waitForURL('**/dashboard', { timeout: 10_000 });
      console.log('logged in, at', page.url());
    } catch {
      console.log('login FAILED - still at', page.url());
    }
  },

  async ss(name) {
    if (!page) return console.log('ERROR: launch first');
    const f = path.join(SHOT_DIR, (name || `ss-${Date.now()}`) + '.png');
    await page.screenshot({ path: f, fullPage: true });
    console.log('screenshot:', f);
  },

  async 'screenshot-element'(sel) {
    if (!page) return console.log('ERROR: launch first');
    const f = path.join(SHOT_DIR, `el-${Date.now()}.png`);
    await page.locator(sel).first().screenshot({ path: f });
    console.log('screenshot:', f);
  },

  async click(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.click(sel, { timeout: 5000 }); console.log('click', sel, '-> OK'); }
    catch (e) { console.log('click', sel, '-> ERROR:', e.message.split('\n')[0]); }
  },

  async 'click-text'(text) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.click(`text=${text}`, { timeout: 5000 }); console.log('click-text', JSON.stringify(text), '-> OK'); }
    catch (e) { console.log('click-text', JSON.stringify(text), '-> ERROR:', e.message.split('\n')[0]); }
  },

  async fill(args) {
    if (!page) return console.log('ERROR: launch first');
    const [sel, ...rest] = (args || '').trim().split(/\s+/);
    await page.fill(sel, rest.join(' '));
    console.log('fill', sel);
  },

  async type(text) { if (page) await page.keyboard.type(text, { delay: 20 }); },
  async press(key) { if (page) await page.keyboard.press(key); },

  async wait(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.waitForSelector(sel, { timeout: 10_000 }); console.log('found:', sel); }
    catch { console.log('TIMEOUT:', sel); }
  },

  async 'wait-text'(text) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.waitForSelector(`text=${text}`, { timeout: 10_000 }); console.log('found text:', text); }
    catch { console.log('TIMEOUT waiting for text:', text); }
  },

  async eval(expr) {
    if (!page) return console.log('ERROR: launch first');
    try { console.log(JSON.stringify(await page.evaluate(expr))); }
    catch (e) { console.log('ERROR:', e.message); }
  },

  async text(sel) {
    if (!page) return console.log('ERROR: launch first');
    console.log(await page.evaluate(
      (s) => (s ? document.querySelector(s) : document.body)?.innerText ?? '(null)',
      sel || null));
  },

  errors() {
    console.log(consoleErrors.length ? consoleErrors.join('\n') : '(none)');
  },

  async quit() { if (browser) await browser.close().catch(() => {}); browser = null; page = null; },
  help() { console.log('commands:', Object.keys(COMMANDS).join(', ')); },
};

const stdin = fs.createReadStream(null, { fd: fs.openSync('/dev/stdin', 'r') });
const rl = readline.createInterface({ input: stdin, output: process.stdout, prompt: 'driver> ' });

// A piped/heredoc input delivers every line to the 'line' event back-to-back,
// without waiting for the previous (async) command to finish - so `launch`
// and the command after it would race. Chain each line onto a queue so
// commands always run one at a time, in order, regardless of how fast the
// input arrives.
let queue = Promise.resolve();
let closed = false;
rl.on('line', (line) => {
  queue = queue.then(async () => {
    const [cmd, ...rest] = line.trim().split(/\s+/);
    if (!cmd) return;
    const fn = COMMANDS[cmd];
    if (!fn) { console.log('unknown:', cmd, '- try: help'); return; }
    try { await fn(rest.join(' ')); } catch (e) { console.log('ERROR:', e.message); }
    if (cmd === 'quit') { rl.close(); process.exit(0); }
  }).then(() => { if (!closed) rl.prompt(); });
});
rl.on('close', async () => {
  closed = true;
  // stdin (e.g. a heredoc) can hit EOF before the queued commands above have
  // actually run - wait for the queue to drain before tearing down.
  await queue;
  await COMMANDS.quit();
  process.exit(0);
});

console.log('sportsee driver - "help" for commands, "launch" to start');
rl.prompt();
