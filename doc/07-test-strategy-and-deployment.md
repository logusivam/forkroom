# 07 — Test Strategy & Deployment / Monitoring
# Forkroom

---

## Test Strategy

### Testing Pyramid

```
        ┌─────────────────┐
        │   E2E (few)      │  Playwright — multi-tab real-time sync tests (client + server both started)
        ├─────────────────┤
        │   Integration    │  Vitest — Socket.io events, room state, roomStore cleanup
        ├─────────────────┤
        │   Unit (most)    │  Vitest — room utils, colour assignment, eval sandbox, reconnect logic
        └─────────────────┘
```

---

### 1. Unit Tests (Vitest 4.1.9, jsdom environment)

| Module | What to test |
|---|---|
| `roomUtils.ts` | `generateRoomId()` returns string of correct length; IDs are unique across 1000 calls |
| `colourAssigner.ts` | Given N users ≤ 8, assigns unique colours from pool; index % 8 wraps correctly for N > 8 (9th user = same colour as 1st — expected behaviour) |
| `evalSandbox.ts` | `runCode("1+1")` returns `"2"`; `runCode("console.log('hi')")` captures and returns `"hi"`; `runCode("console.warn('w')")` captures `"[warn] w"`; `runCode("throw new Error('x')")` returns `"Error: x"`, does not throw to caller; `runCode("")` returns `"(no output)"` |
| `languageMap.ts` | Monaco language ID lookup returns correct string for all supported languages |
| `awarenessUtils.ts` | `parseAwarenessStates(map)` returns correct array of `AwarenessState` objects |

---

### 2. Component Tests (Vitest + React Testing Library 16)

| Component | What to test |
|---|---|
| `RoomInputForm` | Empty submit shows error; valid room ID calls onJoin; Create Room button calls onCreateRoom |
| `LanguageSelector` | Renders all language options; selecting one calls onChange with correct language ID |
| `UserAvatarList` | Renders correct number of badges; shows "+N more" chip beyond 5 users |
| `OutputPanel` | Renders output lines including [warn] prefix; Clear button empties output; scrolls to bottom on new output |
| `ConnectionStatusBar` | Renders correct colour + text for connected/reconnecting/disconnected states |
| `EditorPage` | Redirects to `/` when `roomId` param is undefined (null guard) |

---

### 3. Real-Time Integration Tests (Vitest + mock Socket.io)

Use `socket.io-mock` or `@socket.io/component-emitter` to mock the server in unit tests without a real WebSocket server.

| Test | What to verify |
|---|---|
| Join room | `join-room` emit triggers `room-state` response with correct users array |
| Reconnect re-join | Simulating socket disconnect + reconnect fires `join-room` again via `socket.on('connect')` handler |
| User leave | `user-left` event updates user list correctly |
| Last user leave | roomStore entry deleted when last user disconnects (no stale Map entry) |
| Language change | `language-changed` event updates Monaco editor language |
| Run code broadcast | `code-output` event appends to output panel |
| Rate limit | 11th `join-room` emit in same minute receives `error` event, not room-state |

---

### 4. E2E Tests (Playwright 1.61) — the key test for a real-time app

> **Both client and server are started** by Playwright `webServer` config (two entries). E2E tests fail silently if only the client starts — the Socket.io connection goes unresolved.

```typescript
// tests/e2e/realtime-sync.spec.ts
import { test, expect, chromium } from '@playwright/test';

test('two users edit simultaneously — both see changes', async () => {
  const browser = await chromium.launch();

  // User A
  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();
  await pageA.goto('http://localhost:5173');
  await pageA.click('[data-testid="create-room"]');
  const roomUrl = pageA.url(); // e.g. /room/abc123

  // User B joins same room
  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await pageB.goto(roomUrl);
  await pageB.fill('[data-testid="name-input"]', 'User B');
  await pageB.click('[data-testid="join-btn"]');

  // User A types
  await pageA.click('.monaco-editor');
  await pageA.keyboard.type('hello world');

  // User B sees it within 1000ms
  await expect(pageB.locator('.monaco-editor')).toContainText('hello world', { timeout: 1000 });

  await browser.close();
});
```

| E2E Flow | Steps |
|---|---|
| **Real-time sync (core)** | Two browser contexts — User A types, verify User B sees text within 1000ms |
| **Cursor visibility** | User A moves cursor — verify User B sees cursor label with User A's name |
| **Language sync** | User A changes language to TypeScript — verify User B's editor also switches |
| **Run code broadcast** | User A runs code — verify User B sees output in output panel |
| **Join notification** | User B joins — verify User A sees toast notification |
| **Room URL share** | Copy URL button copies correct URL to clipboard |
| **Disconnect handling** | User A disconnects — verify User B sees "User A left" notification |
| **Reconnect re-join** | Simulate User A network drop — verify User A re-appears in User B's user list after reconnect |
| **Invalid roomId redirect** | Navigate to `/room/` (no ID) — verify redirect to `/` |

---

### 5. Manual Testing Checklist (before any demo)

- [ ] Test with 3+ simultaneous users in same room (open 3 tabs)
- [ ] Test with simulated network lag: Chrome DevTools → Network → Slow 3G — edits should still converge
- [ ] Test rapid consecutive typing from both users — verify no content loss
- [ ] Test room URL sharing — paste URL in incognito tab, verify joining works
- [ ] Test keyboard shortcut Ctrl+Enter to run code
- [ ] Test on mobile (375px) — editor panel visible, output accessible via toggle
- [ ] Test network drop + reconnect — user re-appears in active user list
- [ ] Test 9th user joining — colour wraps to first colour (coral red) — document as expected
- [ ] Verify `console.log`, `console.warn`, `console.error` all captured in output panel
- [ ] Open DevTools → Network → filter WS — confirm Yjs frames on `/yjs` and Socket.io frames on `/`
- [ ] Navigate to `/terms` — all 10 sections render, footer shows Terms (active) + Privacy links
- [ ] Navigate to `/privacy` — all 11 sections render, footer shows Terms + Privacy (active) links
- [ ] Open DevTools → Elements → `<head>` on `/room/test` — confirm `noindex, nofollow`
- [ ] Open DevTools → Elements → `<head>` on `/` — confirm canonical href is production URL
- [ ] Paste `/` URL in Twitter Card Validator — confirm OG image renders at 1200×630
- [ ] Open `https://forkroom.dev/sitemap.xml` — confirm 3 URLs present, no `/room/` entries
- [ ] Open `https://forkroom.dev/robots.txt` — confirm `Disallow: /room/`
- [ ] Check footer on Landing, Terms, Privacy — all three show "Built by Loganathan G P" line

---

## Deployment Setup

### Frontend → Vercel (Free Hobby Tier)

1. Push `/client` to GitHub
2. Import in Vercel dashboard → Framework: Vite
3. Build: `npm run build`, Output: `dist`
4. Environment variable: `VITE_SERVER_URL=wss://your-server.railway.app`
5. Add `client/vercel.json` for CSP headers (required for `eval()`):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval'; connect-src 'self' wss://your-server.railway.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:"
        }
      ]
    }
  ]
}
```

> Replace `wss://your-server.railway.app` with actual Railway URL before deploying.

6. Deploy — auto-deploys on push to `main`

---

### Backend → Railway (Recommended)

> **Critical**: Do NOT use Render free tier for Forkroom. Render free services sleep after 15 minutes — WebSocket connections drop and the Yjs document is lost from memory. Railway's free $5/month credit keeps the process alive.

1. Create Railway project → Deploy from GitHub → select `/server`
2. Railway auto-detects Node.js
3. Set environment variables:
   - `CLIENT_URL=https://your-app.vercel.app`
   - `PORT=3001`
   - `NODE_ENV=production`
   - _(No `YJS_PORT` — not needed, both servers share `PORT`)_
4. Railway assigns a persistent URL: `your-server.railway.app`

**Single-port server setup** (mandatory for Railway):

```js
// server/index.js
import { createServer } from 'http'
import { Server } from 'socket.io'
import WebSocket from 'ws'
import { setupWSConnection } from 'y-websocket/bin/utils'
import express from 'express'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } })

// y-websocket on /yjs path — same HTTP server, same port
const wss = new WebSocket.Server({ server: httpServer, path: '/yjs' })
wss.on('connection', (ws, req) => {
  // Origin check before handing off to Yjs
  const origin = req.headers.origin
  if (process.env.CLIENT_URL && origin !== process.env.CLIENT_URL) {
    ws.close(1008, 'Origin not allowed')
    return
  }
  setupWSConnection(ws, req)
})

httpServer.listen(process.env.PORT || 3001)
```

Client connects:
```typescript
// y-websocket client
new WebsocketProvider(`${VITE_SERVER_URL}/yjs`, roomId, ydoc)

// Socket.io client
io(`${VITE_SERVER_URL}`)  // no path suffix
```

---

## Monitoring Setup (Free)

### 1. UptimeRobot — uptime monitoring

- Monitor: `https://your-server.railway.app/health` every 5 minutes
- Health endpoint:

```js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    activeRooms: roomStore.size
  })
})
```

### 2. Sentry — error tracking (free: 5,000 errors/month)

- Frontend: `npm i @sentry/react` → init in `main.tsx`
- Backend: `npm i @sentry/node` → init at top of `index.js`
- Key events to capture: WebSocket connection failures, `eval()` errors, uncaught Socket.io exceptions, origin-rejected WS connections

### 3. Vercel Analytics (built-in, free)

- Enable in Vercel dashboard — zero config
- Tracks: page views, Web Vitals

### 4. Railway built-in logs

- Live + historical logs, free tier
- Structured logging via pino: `log.info({ roomId, userCount: room.users.length }, 'user joined')`

---

## Pre-Launch Checklist

### Infrastructure & Config
- [ ] `VITE_SERVER_URL` set on Vercel (no trailing slash, `wss://` protocol)
- [ ] `CLIENT_URL` set on Railway (exact Vercel domain, no trailing slash)
- [ ] `YJS_PORT` absent from all env configs — not used
- [ ] `vercel.json` CSP headers deployed — `unsafe-eval` in `script-src`, correct `wss://` in `connect-src`
- [ ] CORS: Socket.io server allows only `CLIENT_URL` origin
- [ ] WS origin check: `wss.on('connection')` rejects non-`CLIENT_URL` origins
- [ ] y-websocket mounted at `/yjs` path on same HTTP server as Socket.io
- [ ] `/health` endpoint returns `{ status: "ok", activeRooms: N }`
- [ ] UptimeRobot monitor active on `/health`
- [ ] Sentry configured on both frontend + backend
- [ ] `joinAttempts.delete(socket.id)` runs BEFORE `roomId` early-return in disconnect handler

### Dependencies
- [ ] `nanoid` in `client/package.json` dependencies
- [ ] `react-helmet-async` in `client/package.json` dependencies
- [ ] `pino ^9.4.0` in `server/package.json` dependencies
- [ ] `@chialab/vitest-axe ^0.2.0` in `client/package.json` devDependencies
- [ ] `husky ^9.1.0` + `lint-staged ^15.2.0` in root `package.json` devDependencies
- [ ] CI uses `npm ci` at root (workspaces) — not `npm install` + separate `npm ci` in subdirs

### Assets & PWA
- [ ] `apple-touch-icon.png` (180×180) in `public/`
- [ ] `favicon-16.png` (16×16) in `public/`
- [ ] `favicon-32.png` (32×32) in `public/`
- [ ] `favicon.svg` in `public/`
- [ ] `favicon-192.png` + `favicon-512.png` in `public/`
- [ ] `manifest.json` has `background_color: "#1E1E1E"` and `purpose: "any maskable"` on 512 icon
- [ ] `og-image.png` (1200×630) in `public/` — matches content spec (logo + tagline on dark bg + credit)
- [ ] `sitemap.xml` in `public/` — includes `/`, `/terms`, `/privacy`; excludes `/room/`
- [ ] `robots.txt` has `Disallow: /room/` and `Sitemap:` reference

### SEO & Meta
- [ ] `index.html` has: canonical, author, keywords, robots, og:site_name, og:image:width/height/alt, og:locale, twitter:image:alt
- [ ] `react-helmet-async` `<HelmetProvider>` wraps app in `main.tsx`
- [ ] `/room/:roomId` — DevTools confirms `<meta name="robots" content="noindex, nofollow">`
- [ ] `/` — DevTools confirms `<link rel="canonical" href="https://forkroom.dev/">`
- [ ] `/terms` — DevTools confirms canonical + `robots: index, follow`
- [ ] `/privacy` — DevTools confirms canonical + `robots: index, follow`
- [ ] SoftwareApplication JSON-LD validates at https://validator.schema.org
- [ ] FAQPage JSON-LD validates at https://validator.schema.org

### Pages & Routes
- [ ] `App.tsx` has all 5 routes: `/`, `/room/:roomId`, `/terms`, `/privacy`, `*`
- [ ] `routes.ts` constants include `TERMS` and `PRIVACY`
- [ ] `/terms` page renders all 10 sections correctly
- [ ] `/privacy` page renders all 11 sections correctly
- [ ] Footer "Terms of Service" link → `/terms` works
- [ ] Footer "Privacy Policy" link → `/privacy` works
- [ ] Nav shows Terms + Privacy links on Landing, Terms, Privacy pages
- [ ] Editor page (`/room/:roomId`) has NO footer — full viewport used for editor

### Functional
- [ ] `roomId` undefined → redirect to `/` verified
- [ ] TemporaryContentBanner uses React `useState` (NOT localStorage or sessionStorage)
- [ ] 3-tab simultaneous edit test passed — no content loss
- [ ] Reconnect test passed — user re-appears in user list after network drop
- [ ] Ctrl+Enter run shortcut works
- [ ] `console.log`, `console.warn`, `console.error` all captured in output panel
- [ ] DevTools Network WS tab: Yjs frames on `/yjs`, Socket.io frames on `/`
- [ ] 9th user joining — colour wraps, muted notice shown in UserAvatarList
- [ ] Mobile layout (375px) — editor visible, output toggle works
- [ ] Playwright `webServer` has two entries (client port 5173 + server port 3001/health)
- [ ] README live demo link works
