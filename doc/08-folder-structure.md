# 08 — Complete Folder Structure
# Forkroom — Enterprise Level

> Every file annotated. Monorepo: `/client` (React SPA) + `/server` (Node.js) under one GitHub repo.
> All loophole fixes from validation applied: single-port WS, reconnect re-join, roomStore cleanup, origin check, CSP, missing assets, husky dep, axe dep, Playwright dual server.

---

```
./                                               ← GitHub repo root
│
├── .github/                                            ← GitHub automation config
│   ├── workflows/
│   │   ├── ci.yml                                      ← Runs on every PR: lint + unit tests + build check (client + server)
│   │   ├── codeql.yml                                  ← Performs CodeQL static security analysis
│   │   ├── dependency-review.yml                       ← Runs dependency security analysis on PRs
│   │   ├── release.yml                                 ← Builds and publishes draft GitHub releases
│   │   ├── stale.yml                                   ← Closes inactive issues and pull requests
│   │   ├── deploy-client.yml                           ← Deploys client to Vercel on push to main
│   │   └── deploy-server.yml                           ← Deploys server to Railway on push to main
│   │
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                               ← Bug template (markdown)
│   │   ├── bug_report.yml                              ← Bug report issue form (interactive YAML)
│   │   ├── feature_request.md                          ← Feature template (markdown)
│   │   ├── feature_request.yml                         ← Feature request issue form (interactive YAML)
│   │   └── security_vulnerability.yml                  ← Security vulnerability form (interactive YAML)
│   │
│   ├── pull_request_template.md                        ← PR checklist: what changed, tests added, axe tested, screenshot
│   ├── CODEOWNERS                                      ← Maps file paths to reviewers
│   └── FUNDING.yml                                     ← Configures repository sponsorship / funding
│
├── .husky/                                             ← Git hook scripts (husky ^9.1.0 in root devDependencies)
│   ├── commit-msg                                      ← Validates git commit messages using commitlint
│   ├── pre-commit                                      ← Runs lint-staged before every commit
│   └── pre-push                                        ← Runs vitest unit tests before every push
│
│
├── client/                                             ← React SPA (Vite 8 + TypeScript + Tailwind v4)
│   │
│   ├── public/                                         ← Static assets served as-is by Vite
│   │   ├── favicon.svg                                 ← Favicon: fork symbol only, no cursor blink, 3px strokes (modern browsers)
│   │   ├── favicon-16.png                              ← 16×16 PNG — legacy browser fallback (IE, old Edge)
│   │   ├── favicon-32.png                              ← 32×32 PNG (standard tab)
│   │   ├── apple-touch-icon.png                        ← 180×180 PNG — iOS Safari home screen bookmark (PWA required)
│   │   ├── favicon-192.png                             ← 192×192 PNG (PWA manifest — required)
│   │   ├── favicon-512.png                             ← 512×512 PNG (PWA manifest — required)
│   │   ├── og-image.png                                ← 1200×630 OG social share: logo + tagline on #1E1E1E bg (built in Figma)
│   │   ├── manifest.json                               ← PWA manifest: name, icons, theme_color #4EC9B0, background_color #1E1E1E
│   │   └── robots.txt                                  ← Allow all crawlers (editor room pages excluded via noindex meta tag)
│   │
│   ├── src/
│   │   │
│   │   ├── assets/                                     ← Imported assets (processed by Vite)
│   │   │   ├── forkroom-logo-full.svg                  ← Full logo: fork icon + "Forkroom" wordmark, dark bg
│   │   │   ├── forkroom-logo-full@2x.png               ← 480×112 PNG (retina header — 2× of 240×56 rendered)
│   │   │   ├── forkroom-icon.svg                       ← Icon only: fork symbol, no wordmark
│   │   │   ├── forkroom-icon-64.png                    ← 64×64
│   │   │   ├── forkroom-icon-256.png                   ← 256×256
│   │   │   └── forkroom-icon-512.png                   ← 512×512
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── common/                                 ← Shared across all pages
│   │   │   │   ├── Logo/
│   │   │   │   │   ├── Logo.tsx                        ← Renders full/icon variant via prop
│   │   │   │   │   ├── Logo.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ConnectionStatusBar/
│   │   │   │   │   ├── ConnectionStatusBar.tsx         ← Green/amber/red dot + label for WS state
│   │   │   │   │   ├── ConnectionStatusBar.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── ToastProvider/
│   │   │   │       ├── ToastProvider.tsx               ← Join/leave toast — auto-dismiss 3s, motion/react animation
│   │   │   │       ├── ToastProvider.test.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── landing/                                ← Landing page components
│   │   │   │   ├── RoomInputForm/
│   │   │   │   │   ├── RoomInputForm.tsx               ← Room ID input + Join + Create Room buttons
│   │   │   │   │   ├── RoomInputForm.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── HowToUseSection/
│   │   │   │   │   ├── HowToUseSection.tsx             ← 4 step cards (PlusCircle/Share2/Code2/Play icons), connector arrows hidden on mobile
│   │   │   │   │   ├── HowToUseSection.test.tsx        ← Tests: 4 steps render with correct headings
│   │   │   │   │   └── index.ts
│   │   │   │   ├── FAQSection/
│   │   │   │   │   ├── FAQSection.tsx                  ← 10-item accordion, ChevronDown toggle, 200ms height animation
│   │   │   │   │   ├── FAQSection.test.tsx             ← Tests: 10 items render; clicking item expands answer; clicking again collapses
│   │   │   │   │   └── index.ts
│   │   │   │   └── FeaturesGrid/
│   │   │   │       ├── FeaturesGrid.tsx                ← 6 feature cards (CRDT sync, live cursors, run code, no login, syntax highlighting, room sharing) — 2-col grid
│   │   │   │       ├── FeaturesGrid.test.tsx           ← Tests: renders 6 cards, each has heading + icon + body
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   └── editor/                                 ← Editor room components
│   │   │       ├── EditorHeader/
│   │   │       │   ├── EditorHeader.tsx                ← Logo + room ID chip + lang selector + avatars + Run btn
│   │   │       │   ├── EditorHeader.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── LanguageSelector/
│   │   │       │   ├── LanguageSelector.tsx            ← Dropdown: JS/TS/Python/HTML/CSS/JSON
│   │   │       │   ├── LanguageSelector.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── UserAvatarList/
│   │   │       │   ├── UserAvatarList.tsx              ← Coloured initial badges, max 5 + "+N more"
│   │   │       │   ├── UserAvatarList.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── MonacoPanel/
│   │   │       │   ├── MonacoPanel.tsx                 ← Monaco editor + MonacoBinding (y-monaco or manual fallback) + awareness cursors
│   │   │       │   ├── MonacoPanel.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── CursorOverlay/
│   │   │       │   ├── CursorOverlay.tsx               ← Name pill floating above each remote cursor, auto-fade 3s inactivity
│   │   │       │   ├── CursorOverlay.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── OutputPanel/
│   │   │       │   ├── OutputPanel.tsx                 ← Run output display (console.log/warn/error captured) + Clear button
│   │   │       │   ├── OutputPanel.test.tsx
│   │   │       │   └── index.ts
│   │   │       └── TemporaryContentBanner/
│   │   │           ├── TemporaryContentBanner.tsx      ← Amber dismissible "content is temporary" warning
│   │   │           ├── TemporaryContentBanner.test.tsx
│   │   │           └── index.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage/
│   │   │   │   ├── LandingPage.tsx                     ← Sections: Hero + RoomInputForm, HowToUseSection (4 steps), FeaturesGrid (6 cards), FAQSection (10 Q&As accordion), Footer
│   │   │   │   │                                          JSON-LD: SoftwareApplication schema + FAQPage schema (both injected via react-helmet-async)
│   │   │   │   ├── LandingPage.test.tsx                ← Tests: H1 renders, 4 steps render, 6 feature cards render, 10 FAQ items render, footer links work
│   │   │   │   └── index.ts
│   │   │   ├── EditorPage/
│   │   │   │   ├── EditorPage.tsx                      ← Null-checks roomId from useParams → redirects to / if missing
│   │   │   │   ├── EditorPage.test.tsx                 ← Tests: valid roomId renders editor; undefined roomId redirects to /
│   │   │   │   └── index.ts
│   │   │   ├── TermsPage/
│   │   │   │   ├── TermsPage.tsx                       ← Terms of Service — 10 sections, static content, react-helmet-async sets canonical + robots:index
│   │   │   │   ├── TermsPage.test.tsx                  ← Tests: renders H1, all 10 sections present, canonical tag set
│   │   │   │   └── index.ts
│   │   │   ├── PrivacyPage/
│   │   │   │   ├── PrivacyPage.tsx                     ← Privacy Policy — 11 sections, static content, react-helmet-async sets canonical + robots:index
│   │   │   │   ├── PrivacyPage.test.tsx                ← Tests: renders H1, all 11 sections present, canonical tag set
│   │   │   │   └── index.ts
│   │   │   └── NotFoundPage/
│   │   │       ├── NotFoundPage.tsx                    ← 404 fallback — noindex, link back to /
│   │   │       ├── NotFoundPage.test.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useRoom.ts                              ← Socket.io room join/leave + user list state
│   │   │   │                                              socket.on('connect') → emit join-room (handles initial + reconnect)
│   │   │   ├── useRoom.test.ts                         ← Tests reconnect re-join behaviour
│   │   │   ├── useYjs.ts                               ← Y.Doc + WebsocketProvider (path /yjs) + MonacoBinding lifecycle
│   │   │   ├── useYjs.test.ts
│   │   │   ├── useAwareness.ts                         ← Read/write awareness state (cursor, name, colour)
│   │   │   ├── useAwareness.test.ts
│   │   │   ├── useCodeRunner.ts                        ← Calls evalSandbox.runCode() → emits run-code via socket
│   │   │   ├── useCodeRunner.test.ts
│   │   │   ├── useConnectionStatus.ts                  ← WebSocket connected/reconnecting/disconnected state
│   │   │   └── useConnectionStatus.test.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── roomUtils.ts                            ← generateRoomId() using nanoid
│   │   │   ├── roomUtils.test.ts
│   │   │   ├── colourAssigner.ts                       ← CURSOR_COLOURS[index % CURSOR_COLOURS.length] — wraps for >8 users
│   │   │   ├── colourAssigner.test.ts                  ← Tests: index 0–7 unique; index 8 = index 0 (wrap)
│   │   │   ├── evalSandbox.ts                          ← Safe browser eval(): capture console.log/warn/error, catch errors, return string
│   │   │   │                                              Requires CSP unsafe-eval in vercel.json
│   │   │   ├── evalSandbox.test.ts                     ← Tests: return value, console capture, warn/error capture, error string, empty output
│   │   │   ├── monacoBinding.ts                        ← Manual MonacoBinding fallback (Y.Text ↔ Monaco model.applyEdits())
│   │   │   │                                              Used if y-monaco 0.1.6 incompatible with Monaco 0.52.0
│   │   │   ├── monacoBinding.test.ts
│   │   │   ├── languageMap.ts                          ← Monaco language ID → display name lookup
│   │   │   ├── languageMap.test.ts
│   │   │   ├── awarenessUtils.ts                       ← Parse awareness Map → AwarenessState[]
│   │   │   └── awarenessUtils.test.ts
│   │   │
│   │   ├── types/
│   │   │   ├── room.ts                                 ← RoomUser, RoomState interfaces
│   │   │   ├── events.ts                               ← Socket.io event payload types (JoinRoomPayload, RunCodePayload etc.)
│   │   │   └── awareness.ts                            ← AwarenessState interface + CURSOR_COLOURS const
│   │   │
│   │   ├── constants/
│   │   │   ├── languages.ts                            ← Supported Monaco language list: javascript, typescript, python, html, css, json
│   │   │   ├── routes.ts                               ← Route path strings: LANDING='/', ROOM='/room/:roomId', TERMS='/terms', PRIVACY='/privacy'
│   │   │   └── socket-events.ts                        ← Socket.io event name strings (avoid magic strings):
│   │   │                                                  CLIENT→SERVER: 'join-room', 'language-change', 'run-code'
│   │   │                                                  SERVER→CLIENT: 'room-state', 'user-joined', 'user-left', 'language-changed', 'code-output', 'error'
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css                               ← Entry: @import tailwind + @theme tokens + base resets
│   │   │   └── tokens.css                              ← CSS custom properties: all --surface, --accent, --text tokens
│   │   │
│   │   ├── App.tsx                                     ← BrowserRouter + Routes: / → LandingPage, /room/:roomId → EditorPage, /terms → TermsPage, /privacy → PrivacyPage, * → NotFoundPage
│   │   ├── App.test.tsx
│   │   └── main.tsx                                    ← React.createRoot + Sentry.init + mount
│   │
│   ├── tests/
│   │   └── e2e/                                        ← Playwright E2E (separate from unit — needs both client + server running)
│   │       ├── realtime-sync.spec.ts                   ← Two browser contexts: User A types → User B sees it within 1000ms
│   │       ├── cursor-awareness.spec.ts                ← User A cursor → User B sees name label
│   │       ├── language-sync.spec.ts                   ← Language change syncs to all users
│   │       ├── run-code-broadcast.spec.ts              ← Run output (including warn/error) appears for all room users
│   │       ├── join-leave-notifications.spec.ts        ← Toast shown on join/leave
│   │       ├── room-url-share.spec.ts                  ← Copy URL button copies correct URL
│   │       ├── disconnect-handling.spec.ts             ← User disconnects → others notified; user-left toast shown
│   │       ├── reconnect-rejoin.spec.ts                ← User network drop → reconnect → re-appears in user list
│   │       └── invalid-room-redirect.spec.ts           ← /room/ (no ID) → redirects to /
│   │
│   ├── vercel.json                                     ← CSP headers: script-src 'self' 'unsafe-eval'; connect-src wss://server
│   ├── .env                                            ← Local dev (gitignored): VITE_SERVER_URL=ws://localhost:3001
│   ├── .env.example                                    ← Committed template: VITE_SERVER_URL=
│   ├── .eslintrc.cjs                                   ← ESLint: react, ts, jsx-a11y rules
│   ├── .prettierrc                                     ← Prettier config
│   ├── .prettierignore                                 ← Exclude dist, node_modules
│   ├── index.html                                      ← Vite HTML entry: all favicon links, apple-touch-icon, manifest, OG tags, Google Fonts
│   ├── playwright.config.ts                            ← Two webServer entries: client (port 5173) + server (port 3001/health)
│   ├── tsconfig.json                                   ← strict: true, paths alias @/ → src/
│   ├── tsconfig.node.json                              ← TS config for vite.config.ts
│   ├── vite.config.ts                                  ← Vite 8: @vitejs/plugin-react + @tailwindcss/vite
│   ├── vitest.config.ts                                ← Vitest: environment jsdom, setupFiles, coverage v8
│   ├── vitest-setup.ts                                 ← Extend expect with @chialab/vitest-axe matchers
│   └── package.json                                    ← Scripts: dev / build / preview / test / test:e2e / lint
│                                                          devDeps includes @chialab/vitest-axe ^0.2.0
│
├── server/                                             ← Node.js 22 (Express + Socket.io + y-websocket)
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   └── health.js                               ← GET /health → { status: "ok", timestamp, activeRooms: roomStore.size }
│   │   ├── middleware/
│   │   │   ├── cors.js                                 ← Express HTTP CORS: allow CLIENT_URL env var origin only
│   │   │   │                                              Note: does NOT cover WS — origin checked separately in wss.on('connection')
│   │   │   └── errorHandler.js                         ← Global error handler: 500 JSON response
│   │   ├── socket/
│   │   │   ├── roomHandler.js                          ← Socket.io events:
│   │   │   │                                              join-room (rate limited 10/socket/min, stores socket.roomId + socket.userName)
│   │   │   │                                              language-change, run-code events
│   │   │   │                                              disconnect → removes user from roomStore, deletes room if empty
│   │   │   └── roomStore.js                            ← In-memory Map<roomId, RoomState>
│   │   │                                                  Cleaned on last user disconnect — no unbounded growth
│   │   └── utils/
│   │       └── logger.js                               ← pino logger instance (structured JSON: roomId, userCount, event)
│   │
│   ├── tests/
│   │   └── integration/
│   │       ├── health.test.js                          ← GET /health returns 200 + { status, timestamp, activeRooms }
│   │       └── socket-events.test.js                   ← join-room, leave-room, disconnect cleanup, rate-limit, language-change assertions
│   │
│   ├── .env                                            ← Local: CLIENT_URL, PORT, NODE_ENV (gitignored)
│   ├── .env.example                                    ← Committed: CLIENT_URL=  PORT=3001  NODE_ENV=development
│   │                                                      (No YJS_PORT — both servers share PORT)
│   ├── .eslintrc.cjs                                   ← ESLint for Node (no React rules)
│   ├── .prettierrc                                     ← Prettier (same config as client)
│   ├── index.js                                        ← Entry: Express + Socket.io + y-websocket on /yjs path + origin check + listen on PORT
│   └── package.json                                    ← Scripts: start / dev (nodemon) / test / lint
│
├── docs/                                               ← All project documentation committed to repo
│   ├── 01-problem-and-architecture.md
│   ├── 02-architecture-diagrams-eraser.md
│   ├── 03-dependencies-and-tech-stack.md
│   ├── 04-workflow-diagram-eraser.md
│   ├── 05-user-stories-features-pages.md
│   ├── 06-visual-design-and-logo.md
│   ├── 07-test-strategy-and-deployment.md
│   └── 08-folder-structure.md
│
├── .editorconfig                                       ← indent_style=space, indent_size=2, end_of_line=lf, charset=utf-8
├── .gitattributes                                      ← * text=auto eol=lf — enforce LF on Windows/Mac/Linux
├── .gitignore                                          ← node_modules, dist, .env, coverage, playwright-report, .DS_Store
├── .nvmrc                                              ← 22.12.0 — pins Node version for nvm, Railway, Vercel
├── CHANGELOG.md                                        ← Conventional Commits version history
├── CODE_OF_CONDUCT.md                                  ← Contributor Covenant Code of Conduct guidelines
├── CONTRIBUTING.md                                     ← Setup guide, branch naming, commit format, PR process
├── LICENSE                                             ← MIT
├── README.md                                           ← Overview, live demo, architecture, known limitations, setup
├── release.md                                          ← Pins release guidelines and SemVer strategies
├── SECURITY.md                                         ← Outlines vulnerability reporting mechanisms
└── package.json                                        ← Root: workspaces, lint-staged, husky devDependency + prepare script
```

---

## Key File Contents

### `package.json` (root — with husky in devDependencies)

```json
{
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0"
  },
  "lint-staged": {
    "client/src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "server/src/**/*.{js}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

### `server/.env.example`

```
CLIENT_URL=
PORT=3001
NODE_ENV=development
```

> `YJS_PORT` is NOT present — both y-websocket and Socket.io run on `PORT`. This was a source of confusion in the original spec and has been removed.

---

### `client/vercel.json`

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

---

### `client/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,          // Real-time tests need sequential execution
  timeout: 15_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari',  use: { ...devices['iPhone 14'] } },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
    {
      command: 'cd ../server && npm run dev',
      url: 'http://localhost:3001/health',
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
  ],
});
```

---

### `server/index.js` (complete entry — single port)

```javascript
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import WebSocket from 'ws'
import { setupWSConnection } from 'y-websocket/bin/utils'
import { corsMiddleware } from './src/middleware/cors.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import { healthRouter } from './src/routes/health.js'
import { registerRoomHandler } from './src/socket/roomHandler.js'
import { logger } from './src/utils/logger.js'
import 'dotenv/config'

const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL

const app = express()
app.use(corsMiddleware)
app.use(express.json())
app.use('/health', healthRouter)
app.use(errorHandler)

const httpServer = createServer(app)

// Socket.io — room events, presence, language, run-code
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] }
})
io.on('connection', (socket) => registerRoomHandler(io, socket))

// y-websocket — Yjs CRDT sync, mounted on /yjs path (same port as Socket.io)
const wss = new WebSocket.Server({ server: httpServer, path: '/yjs' })
wss.on('connection', (ws, req) => {
  const origin = req.headers.origin
  if (CLIENT_URL && origin !== CLIENT_URL) {
    logger.warn({ origin }, 'WS connection rejected — origin not allowed')
    ws.close(1008, 'Origin not allowed')
    return
  }
  setupWSConnection(ws, req)
})

httpServer.listen(PORT, () => {
  logger.info({ port: PORT }, 'Forkroom server started')
})
```

---

### `client/src/hooks/useRoom.ts` (reconnect pattern)

```typescript
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type { RoomUser } from '../types/room'

const SOCKET_URL = import.meta.env.VITE_SERVER_URL

export function useRoom(roomId: string, name: string, colour: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    // Fires on initial connect AND every reconnect — keeps roomStore consistent
    socket.on('connect', () => {
      socket.emit('join-room', { roomId, name, colour })
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId, name, colour])

  return socketRef
}
```

---

### `client/src/lib/evalSandbox.ts`

```typescript
// Requires CSP: script-src 'self' 'unsafe-eval' in client/vercel.json

export function runCode(code: string): string {
  const logs: string[] = []
  const originalLog = console.log
  const originalWarn = console.warn
  const originalError = console.error

  console.log = (...args: unknown[]) => logs.push(args.map(String).join(' '))
  console.warn = (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' '))
  console.error = (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' '))

  try {
    // eslint-disable-next-line no-eval
    const result = eval(code)
    if (result !== undefined && logs.length === 0) {
      logs.push(String(result))
    }
  } catch (err) {
    logs.push(`Error: ${(err as Error).message}`)
  } finally {
    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError
  }

  return logs.length > 0 ? logs.join('\n') : '(no output)'
}
```

---

### `client/src/lib/monacoBinding.ts` (manual fallback if y-monaco incompatible)

```typescript
// Use this if y-monaco 0.1.6 is incompatible with monaco-editor 0.52.0.
// Test y-monaco first — use this only as fallback.

import * as Y from 'yjs'
import * as monaco from 'monaco-editor'

export function bindYTextToMonaco(
  yText: Y.Text,
  model: monaco.editor.ITextModel
): () => void {
  // Initial sync from Y.Doc to Monaco
  model.setValue(yText.toString())

  // Remote changes: Y.Text → Monaco
  const observer = (event: Y.YTextEvent, transaction: Y.Transaction) => {
    if (transaction.local) return
    let index = 0
    const edits: monaco.editor.IIdentifiedSingleEditOperation[] = []
    event.changes.delta.forEach((op) => {
      if (op.retain) {
        index += op.retain
      } else if (op.delete) {
        const start = model.getPositionAt(index)
        const end = model.getPositionAt(index + op.delete)
        edits.push({
          range: new monaco.Range(
            start.lineNumber, start.column,
            end.lineNumber, end.column
          ),
          text: ''
        })
      } else if (op.insert) {
        const pos = model.getPositionAt(index)
        edits.push({
          range: new monaco.Range(
            pos.lineNumber, pos.column,
            pos.lineNumber, pos.column
          ),
          text: op.insert as string
        })
        index += (op.insert as string).length
      }
    })
    if (edits.length > 0) model.applyEdits(edits)
  }

  yText.observe(observer)

  // Local changes: Monaco → Y.Text
  const disposable = model.onDidChangeContent((event) => {
    Y.transact(yText.doc!, () => {
      event.changes
        .sort((a, b) => b.rangeOffset - a.rangeOffset)
        .forEach((change) => {
          if (change.rangeLength > 0) yText.delete(change.rangeOffset, change.rangeLength)
          if (change.text) yText.insert(change.rangeOffset, change.text)
        })
    }, 'local')
  })

  // Cleanup
  return () => {
    yText.unobserve(observer)
    disposable.dispose()
  }
}
```

---

### `server/src/socket/roomHandler.js` (with rate limit + disconnect cleanup)

```javascript
import { roomStore } from './roomStore.js'
import { logger } from '../utils/logger.js'

// Per-socket rate limiting for join-room
const joinAttempts = new Map() // socketId → { count, resetAt }

export function registerRoomHandler(io, socket) {

  socket.on('join-room', ({ roomId, name, colour }) => {
    // Rate limit: max 10 join-room per socket per minute
    const now = Date.now()
    const entry = joinAttempts.get(socket.id) || { count: 0, resetAt: now + 60_000 }
    if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000 }
    entry.count++
    joinAttempts.set(socket.id, entry)
    if (entry.count > 10) {
      socket.emit('error', { message: 'Too many join attempts. Please wait 1 minute.' })
      return
    }

    // Store on socket for disconnect handler
    socket.roomId = roomId
    socket.userName = name

    socket.join(roomId)

    // Update roomStore
    if (!roomStore.has(roomId)) {
      roomStore.set(roomId, { roomId, users: [], language: 'javascript' })
    }
    const room = roomStore.get(roomId)
    // Remove stale entry for same socket (reconnect)
    room.users = room.users.filter(u => u.id !== socket.id)
    room.users.push({ id: socket.id, name, colour, joinedAt: Date.now() })

    socket.to(roomId).emit('user-joined', { id: socket.id, name, colour })
    socket.emit('room-state', { users: room.users, language: room.language })

    logger.info({ roomId, name, userCount: room.users.length }, 'user joined')
  })

  socket.on('language-change', ({ roomId, language }) => {
    const room = roomStore.get(roomId)
    if (room) room.language = language
    socket.to(roomId).emit('language-changed', { language })
  })

  socket.on('run-code', ({ roomId, output, runBy }) => {
    socket.to(roomId).emit('code-output', { output, runBy, timestamp: Date.now() })
  })

  socket.on('disconnect', () => {
    joinAttempts.delete(socket.id)

    const roomId = socket.roomId
    if (!roomId) return

    const room = roomStore.get(roomId)
    if (!room) return

    room.users = room.users.filter(u => u.id !== socket.id)

    if (room.users.length === 0) {
      roomStore.delete(roomId)   // prevent memory leak — last user gone
      logger.info({ roomId }, 'room destroyed — no users remain')
    } else {
      io.to(roomId).emit('user-left', { id: socket.id, name: socket.userName })
      logger.info({ roomId, name: socket.userName, userCount: room.users.length }, 'user left')
    }
  })
}
```

---

### `client/index.html` `<head>` (complete)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#4EC9B0">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- ═══ PRIMARY SEO ═══ -->
  <title>Forkroom — Real-Time Collaborative Code Editor, No Login Required</title>
  <meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync. No signup, no install. The Google Docs for code.">
  <meta name="keywords" content="collaborative code editor, real-time code editor, pair programming online, browser code editor, no login code editor, live coding, multiplayer editor, yjs, monaco editor">
  <meta name="author" content="Loganathan G P — Logusivam Vision">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://forkroom.dev/">

  <!-- ═══ OPEN GRAPH ═══ -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Forkroom">
  <meta property="og:title" content="Forkroom — Code Together Instantly">
  <meta property="og:description" content="Real-time collaborative code editor. Share a link, start coding. No login, no install.">
  <meta property="og:image" content="https://forkroom.dev/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Forkroom logo — Fork together. Ship faster.">
  <meta property="og:url" content="https://forkroom.dev">
  <meta property="og:locale" content="en_US">

  <!-- ═══ TWITTER CARD ═══ -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Forkroom — Fork together. Ship faster.">
  <meta name="twitter:description" content="Browser-based real-time collaborative code editor. No signup. Share a URL, start coding with live cursors.">
  <meta name="twitter:image" content="https://forkroom.dev/og-image.png">
  <meta name="twitter:image:alt" content="Forkroom — real-time collaborative code editor">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

### `.github/workflows/ci.yml`

```yaml
name: CI
on: [pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
      - name: Install root deps (husky + lint-staged)
        run: npm install
      - name: Client — install, lint, test, build
        run: |
          cd client
          npm ci
          npm run lint
          npm run test -- --run
          npm run build
      - name: Server — install, lint, test
        run: |
          cd server
          npm ci
          npm run lint
          npm test
```

---

### `.github/CODEOWNERS`

```
# All files — solo project
*                                @logusivam

# Real-time sync core — extra caution
/client/src/hooks/useYjs.ts      @logusivam
/client/src/hooks/useRoom.ts     @logusivam
/client/src/lib/monacoBinding.ts @logusivam
/server/src/socket/              @logusivam

# Legal pages — content accuracy risk
/client/src/pages/TermsPage/     @logusivam
/client/src/pages/PrivacyPage/   @logusivam

# CSS design tokens — any change is visual regression risk
/client/src/styles/tokens.css    @logusivam
```

---

### `CHANGELOG.md`

```markdown
# Changelog

All notable changes follow [Conventional Commits](https://conventionalcommits.org).

## [Unreleased]

## [0.1.0] - 2026-08-01
### Added
- Landing page: Hero + How to Use (4 steps) + Features (6 cards) + FAQ (10 Q&As accordion) + Footer
- Terms of Service page (/terms) — 10 sections, static, indexed, canonical set
- Privacy Policy page (/privacy) — 11 sections, static, indexed, canonical set
- Monaco editor with Yjs CRDT sync via y-websocket (single-port, /yjs path)
- Remote cursor awareness (name + colour labels, auto-fade 3s inactivity)
- Language selector synced to all room users
- JavaScript code runner (browser eval) + console.log/warn/error/return-value capture + output broadcast
- Connection status bar (connected / reconnecting / disconnected)
- Temporary content warning banner (React useState — not localStorage)
- Socket.io reconnect auto-rejoin (socket.on('connect') pattern)
- roomStore cleanup on last user disconnect (prevents memory leak)
- joinAttempts Map cleanup BEFORE roomId early-return in disconnect handler
- Socket.io join-room rate limit (10/socket/min)
- WS origin check on y-websocket connection
- CSP headers via vercel.json (unsafe-eval scoped to script-src)
- Manual MonacoBinding fallback (y-monaco compatibility safety net)
- react-helmet-async for dynamic per-route meta (noindex on /room/, canonicals on static pages)
- SoftwareApplication + FAQPage JSON-LD schemas on landing page
- sitemap.xml (/, /terms, /privacy — /room/ excluded)
- robots.txt (Disallow: /room/)
- apple-touch-icon (180×180) for iOS PWA
- favicon-16.png for legacy browser fallback
- roomId null guard in EditorPage (redirect to / on invalid URL)
- UserAvatarList muted notice when room > 8 users (colour repeat warning)
- nanoid for URL-safe room ID generation
```

---

### `CONTRIBUTING.md`

```markdown
# Contributing to Forkroom

## Local setup
1. Clone: `git clone https://github.com/logusivam/forkroom`
2. Install root deps: `npm ci` (installs all workspaces + husky hooks via prepare script — do NOT run `npm install` at root AND `npm ci` in subdirs)
3. Client: `cd client && npm install && cp .env.example .env`
   - Set `VITE_SERVER_URL=ws://localhost:3001`
4. Server: `cd server && npm install && cp .env.example .env`
   - Set `CLIENT_URL=http://localhost:5173`, `PORT=3001`, `NODE_ENV=development`
   - No `YJS_PORT` needed — y-websocket runs on same PORT as Socket.io
5. Run server: `cd server && npm run dev`
6. Run client: `cd client && npm run dev`
7. Open http://localhost:5173

## Key architecture notes
- Yjs WebSocket connects to `ws://localhost:3001/yjs` (path `/yjs`)
- Socket.io connects to `ws://localhost:3001` (no path suffix)
- Both share a single HTTP server — no separate port for y-websocket
- App has 5 routes: `/`, `/room/:roomId`, `/terms`, `/privacy`, `*` (404)
- `/terms` and `/privacy` are static React pages — no server involvement
- `react-helmet-async` handles per-route `<title>`, `<meta robots>`, `<link canonical>`
- TemporaryContentBanner uses React `useState` — NOT localStorage or sessionStorage

## Branch naming
- `feat/cursor-name-labels`
- `fix/yjs-reconnect-loop`
- `chore/update-socket-io`

## Commit format (Conventional Commits)
- `feat: add language selector sync`
- `fix: prevent duplicate join events on reconnect`
- `chore: bump yjs to 13.6.31`

## PR process
1. Branch from main
2. Open PR → fill in pull_request_template.md
3. CI must pass (lint + unit + build for both client and server)
4. Test with 2 tabs manually before merging
5. Test reconnect: open two tabs, disable network on one, re-enable, verify user re-appears
```

---

### `README.md` — Complete Content Spec

> This is the #1 file a hiring manager or senior engineer reads. Every section below must be present.

```markdown
# Forkroom — Real-Time Collaborative Code Editor

> Fork together. Ship faster.

[![CI](https://github.com/logusivam/forkroom/actions/workflows/ci.yml/badge.svg)](https://github.com/logusivam/forkroom/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-forkroom.dev-4EC9B0)](https://forkroom.dev)

**[→ Live Demo](https://forkroom.dev)** | **[→ Report a Bug](https://github.com/logusivam/forkroom/issues)**

---

## What Is Forkroom?

Forkroom is a browser-based real-time collaborative code editor. Two or more developers
open the same URL and code together instantly — no account, no install, no configuration.

Built with **Yjs CRDT** (conflict-free replicated data types — the same engine powering
Figma and Excalidraw), **Monaco Editor** (VS Code's editor), and **Socket.io**.

---

## Features

- ⚡ **Zero-conflict real-time sync** — CRDT guarantees edits always converge, never clash
- 👁 **Live cursors** — see every collaborator's cursor and name in real-time
- ▶ **Run & share output** — execute JavaScript, all users see results instantly
- 🔗 **No login required** — open a URL, enter a name, start coding
- 🎨 **Syntax highlighting** — JavaScript, TypeScript, Python, HTML, CSS, JSON
- 📋 **Instant room sharing** — one URL, paste anywhere

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Real-time sync | Yjs 13.x (CRDT) | Conflict-free concurrent editing — same as Figma/Excalidraw |
| Editor | Monaco Editor 0.52 | VS Code's editor — 90+ languages, IntelliSense |
| Room events | Socket.io 4.8 | Join/leave, language sync, run output broadcast |
| Frontend | React 18 + Vite 8 + TypeScript | Fast builds, strict types |
| Styling | Tailwind CSS v4 | CSS-native design tokens, dark theme |
| Backend | Node.js 22 + Express | Single HTTP server, single port |
| Deployment | Vercel (frontend) + Railway (backend) | Persistent WebSocket on Railway |

---

## Architecture

```
Client A (React SPA)
  ├── WebsocketProvider → wss://server/yjs   ← Yjs CRDT sync
  └── Socket.io client  → wss://server/      ← Room events

Node.js Server (single port $PORT)
  ├── WebSocket.Server path: '/yjs'          ← y-websocket (Yjs)
  │     └── origin check → setupWSConnection()
  └── Socket.io Server path: '/'             ← room/presence events
        └── roomStore Map (in-memory, cleaned on last disconnect)
```

**Why Yjs instead of raw Socket.io?** Socket.io emit/on has no conflict resolution —
two users editing the same line simultaneously = data loss. Yjs CRDT solves this
mathematically: any two clients with the same operations applied in any order reach
the same state. This is the same guarantee Figma uses.

---

## Local Setup

### Prerequisites
- Node.js 22.12.0+ (see `.nvmrc`)
- npm 10+

### Install

```bash
git clone https://github.com/logusivam/forkroom
cd forkroom
npm ci   # installs all workspaces + husky git hooks
```

### Configure

```bash
# Client
cd client && cp .env.example .env
# Set: VITE_SERVER_URL=ws://localhost:3001

# Server
cd ../server && cp .env.example .env
# Set: CLIENT_URL=http://localhost:5173  PORT=3001  NODE_ENV=development
```

### Run

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Testing

```bash
# Unit + component tests
cd client && npm test

# Unit tests (single run, no watch)
cd client && npm test -- --run

# Server integration tests
cd server && npm test

# E2E tests (requires both client + server running)
cd client && npm run test:e2e
```

---

## Deployment

| Service | Use |
|---|---|
| **Vercel** | Frontend (React SPA static build) |
| **Railway** | Backend (persistent Node.js — WebSocket requires long-running process) |

**Do NOT use Render free tier** — services sleep after 15 min, breaking WebSocket connections.

See [07-test-strategy-and-deployment.md](docs/07-test-strategy-and-deployment.md) for full deployment steps.

---

## Known Limitations

| Limitation | Detail |
|---|---|
| **No persistence** | Room content is in-memory only. All code is lost when all users disconnect. Copy your code before leaving. |
| **JavaScript only** | Code execution runs in the browser sandbox (`eval()`). No Python, no Node.js APIs. |
| **No authentication** | Anyone with the room URL can join. Auth is a v2 scope item. |
| **Single server** | No Redis adapter — one Node.js process. Crash = all rooms lost. Redis scaling is v2. |
| **Colour reuse > 8 users** | Cursor colours cycle after 8 users. A notice is shown in the UI. |

---

## Project Structure

```
forkroom/
├── client/     React SPA (Vite 8 + TypeScript + Tailwind v4)
├── server/     Node.js (Express + Socket.io + y-websocket)
└── docs/       Architecture, design, test strategy, and more
```

See [docs/08-folder-structure.md](docs/08-folder-structure.md) for the full annotated file tree.

---

## Interview Talking Points

This project demonstrates knowledge interviewers at senior level will probe:

- **Why CRDT over OT?** OT requires a central server to sequence operations. CRDT convergence is guaranteed without central coordination — any merge order produces the same result.
- **Why two WebSocket connections?** Yjs document sync (binary CRDT updates) and Socket.io room events (join/leave/language) have different semantics. Mixing them into one channel would require manual conflict resolution for documents.
- **How does single-port routing work?** `WebSocket.Server({ server, path: '/yjs' })` — the Node.js `ws` library filters WebSocket upgrade requests by path before y-websocket sees them.
- **What happens at 1000 concurrent rooms?** Add `y-websocket` Redis adapter + Socket.io Redis adapter → horizontal scaling across multiple Node processes behind a load balancer.

---

## Licence

MIT © 2026–present Loganathan G P — [Logusivam Vision](https://github.com/logusivam)
```
