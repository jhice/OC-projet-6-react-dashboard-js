---
name: run-sportsee
description: Build, run, and drive the SportSee React dashboard in a real headless browser. Use when asked to start the app, log in, take a screenshot of the dashboard/profile pages, or verify a UI change actually works (not just lint/typecheck).
---

SportSee is a Vite + React SPA with no chromium-cli available in this
environment, so it's driven via the Playwright REPL at
`.claude/skills/run-sportsee/driver.mjs` (plain `chromium`, not
`_electron` - this is a normal web page). All paths below are relative
to the repo root.

## Prerequisites

No extra `apt-get` packages were needed in this container - Chromium
launched fine with just `--no-sandbox`. `sudo` is **not** available
here, so skip `--with-deps` (it fails: "sudo: a terminal is required").

```bash
npx playwright install chromium
```

This downloads the browser binary to `~/.cache/ms-playwright/` (~300MB,
one-time; persists across projects on this machine). `playwright` is
already a devDependency (added for this driver).

**External dependency this repo does NOT provide:** a backend API on
`http://localhost:8000` (login, user-info, user-activity - see
`api+mock/*.http` for the contract). Without it, `login` below fails
with "Invalid credentials" or the dashboard never leaves "Loading...".
Confirm it's up before driving the app:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/api/user-info
# 401 = server is up and requires auth (expected without a token)
```

Test users are in `NOTES.md`, e.g. `sophiemartin` / `password123`.

## Setup

```bash
npm install
```

## Run (agent path)

Start the dev server, wait for it to actually serve, then pipe commands
to the driver:

```bash
npm run dev &
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'
```

Vite binds `5173` by default and falls back to `5174`/`5175` if that's
taken (check the `Local:` line it prints) - pass `BASE_URL` to the
driver if it's not 5173:

```bash
node .claude/skills/run-sportsee/driver.mjs <<'EOF'
launch
login sophiemartin password123
wait-text Vos dernières performances
ss dashboard
errors
quit
EOF
# BASE_URL=http://localhost:5174 node .claude/skills/run-sportsee/driver.mjs <<'EOF' ...
```

Stop the dev server when done: `lsof -ti:5173 -sTCP:LISTEN | xargs -r kill`
(use the actual port).

Screenshots land in `/tmp/shots/` (override: `SCREENSHOT_DIR`).

The driver serializes commands with an internal queue, so piping a
whole heredoc like above (all lines delivered to stdin at once) runs
them strictly in order - `login` won't race ahead of `launch`.

### Commands

| command | what it does |
|---|---|
| `launch` | start headless Chromium |
| `nav [path]` | go to `BASE_URL + path` (default `/`) |
| `login [user] [pass]` | fill `#username`/`#password`, submit, wait for `/dashboard` (defaults to `sophiemartin`/`password123`) |
| `ss [name]` | full-page screenshot -> `/tmp/shots/<name>.png` |
| `screenshot-element <sel>` | screenshot of one element |
| `click <sel>` | Playwright click (supports `:has-text`, `>>` chaining) |
| `click-text <text>` | click the first element containing `text` |
| `fill <sel> <text>` | fill an input |
| `type <text>` / `press <key>` | keyboard input |
| `wait <sel>` / `wait-text <text>` | wait up to 10s for a selector / for text to appear |
| `eval <js>` | `page.evaluate(js)`, prints JSON |
| `text [sel]` | print `innerText` (plain `document.querySelector` - see Gotchas) |
| `errors` | print collected console errors |
| `quit` | close the browser |

## Run (human path)

```bash
npm run dev   # -> http://localhost:5173, Ctrl-C to stop
```

Needs the same external API on `:8000` to actually log in.

## Test

```bash
npm run lint
```

No automated test suite in this repo (just ESLint).

## Gotchas

- **No sudo in this container** - `playwright install --with-deps` and
  `apt-get install tmux` both fail ("a terminal is required to read the
  password"). Plain `playwright install chromium` (no `--with-deps`)
  worked fine with zero extra system packages, and the heredoc-piped
  driver above doesn't need tmux at all.
- **`text`/`eval` run in the real DOM** (`document.querySelector` /
  `page.evaluate`), so they don't understand Playwright-only selector
  syntax like `:has-text(...)` or `>>` chaining - those only work with
  `click` / `click-text` / `wait` / `fill`. For `text` on a scoped
  region, use a plain CSS selector, or `eval` with a JS-side search.
- **Vite's port isn't fixed.** If another dev server is already running
  on 5173 (e.g. from an IDE), a second `npm run dev` silently moves to
  5174+ - always check the printed `Local:` line and set `BASE_URL`
  accordingly rather than assuming 5173.
- **The mock API on :8000 is external to this repo.** `api+mock/*.http`
  and `public/*.json` are just sample request/response pairs, not a
  server. If nothing is listening on :8000, every fetch in the app
  fails and the dashboard/profile pages never leave "Loading...".

## Troubleshooting

- **`login FAILED - still at http://.../`**: wrong credentials, or the
  `:8000` API isn't running. `ss` right after `login` and read the page
  - a real login failure shows "Invalid credentials" under the form.
- **`... is not a valid selector` from `text`/`eval`**: you passed a
  Playwright-only selector (`:has-text`, `>>`) to a command that uses
  plain `document.querySelector`. Use `click`/`wait` for those, or a
  plain CSS selector for `text`.
- **`curl: (7) Failed to connect` while polling the dev server**: give
  it a moment (Vite's first optimize pass can take a few seconds), or
  check `npm run dev`'s own output for a port conflict.
