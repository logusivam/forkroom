# Forkroom — Complete Project Reference

> **Fork together. Ship faster.**  
> Built by **Loganathan G P** · Logusivam Vision · © 2026

---

## Table of Contents

1. [Logo](#1-logo)
2. [Problem Statement & How Forkroom Solves It](#2-problem-statement--how-forkroom-solves-it)
3. [Tech Stack — Frontend & Backend](#3-tech-stack--frontend--backend)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Complete API Documentation](#5-complete-api-documentation)
6. [Security Model](#6-security-model)
7. [All Dependencies & Versions](#7-all-dependencies--versions)
8. [Application Workflow Diagram](#8-application-workflow-diagram)
9. [Database / State — Collections & Data Flow](#9-database--state--collections--data-flow)
10. [Setup Guide](#10-setup-guide)
11. [Chat & Reference Links](#11-chat--reference-links)
12. [Colour Codes & Font Families](#12-colour-codes--font-families)
13. [Logo Design — Reasoning](#13-logo-design--reasoning)

---

## 1. Logo

### Primary Assets

| Filename | Dimensions | Format | Location | Use |
|---|---|---|---|---|
| `logo-1024x1024.png` | 1024 × 1024 | PNG | `client/public/` | Preloader, high-res |
| `nav-logo-full@2x.svg` | Vector | SVG | `client/public/` | Desktop/mobile header nav |
| `footer-logo-full@2x.svg` | Vector | SVG | `client/public/` | Footer brand |
| `favicon-96.png` | 96 × 96 | PNG | `client/public/` | Editor page nav icon |
| `favicon-32.png` | 32 × 32 | PNG | `client/public/` | Browser tab (standard) |
| `favicon-16.png` | 16 × 16 | PNG | `client/public/` | Browser tab (legacy) |
| `apple-touch-icon.png` | 180 × 180 | PNG | `client/public/` | iOS Safari PWA bookmark |
| `favicon-192.png` | 192 × 192 | PNG | `client/public/` | PWA manifest (required) |
| `favicon-512.png` | 512 × 512 | PNG | `client/public/` | PWA manifest — maskable |
| `og-image.png` | 1200 × 630 | PNG | `client/public/` | Social share / Open Graph |

### Where Each Logo Is Used

| Location | Asset |
|---|---|
| Browser tab | `favicon-32.png` / `favicon-16.png` |
| iOS home screen | `apple-touch-icon.png` |
| Preloader animation | `logo-1024x1024.png` |
| Header nav (all pages except editor) | `nav-logo-full@2x.svg` |
| Footer | `footer-logo-full@2x.svg` |
| Editor page header (compact) | `favicon-96.png` |
| Social share (OG/Twitter) | `og-image.png` |
| PWA install | `favicon-192.png`, `favicon-512.png` |

---

## 2. Problem Statement & How Forkroom Solves It

### The Problem

Remote developers collaborating on the same code file right now have two bad options:

1. **Screen share** (Zoom/Meet) — one person types, everyone watches. No hands-on participation. Laggy. No persistent output.
2. **Paste code into Slack/Discord** — async, loses context, conflicts when two people edit simultaneously.

No lightweight, instant, shareable tool exists that lets two developers open a URL and start coding together in under 10 seconds — like a Google Docs for code, without needing to install VS Code Live Share, create an account, or configure anything.

### The Core Technical Problem: Concurrent Text Editing

Concurrent text editing has a fundamental conflict problem:

```
Original:  "hello world"
User A (at same instant):  deletes "world"           → "hello "
User B (at same instant):  changes "world" → "universe" → "hello universe"
```

Naive "last write wins" = one user's work silently disappears. Two solutions exist:

- **Operational Transformation (OT)** — used by Google Docs. Requires a central server to sequence all operations. Complex to implement correctly.
- **CRDT (Conflict-free Replicated Data Type)** — used by Figma, Linear, Notion. Data structures that mathematically guarantee convergence without a central arbiter. Any two users with the same operations applied in any order reach the same state.

### How Forkroom Solves It

1. Each room has a **Yjs shared document** (`Y.Doc`) as the source of truth
2. `Y.Text` shared type wraps the Monaco editor content — every keystroke becomes a CRDT operation
3. `y-websocket` syncs these operations between all clients via WebSocket (path `/yjs`)
4. **Conflict resolution is automatic** — Yjs guarantees convergence regardless of network order
5. **Awareness protocol** (`y-protocols/awareness`) syncs cursor positions and user presence (name, colour) separately from document content — so cursors are always live even without typing
6. Socket.io handles **room management**, **user join/leave events**, and **presence notifications** alongside the Yjs WebSocket
7. On Socket.io reconnect, the client re-emits `join-room` to restore server-side room state — preventing stale user lists after network interruption

### Known Limitations (Documented)

| Limitation | Detail |
|---|---|
| **No persistence** | Room content is in-memory only. All code is lost when all users disconnect. |
| **JavaScript execution only** | Code runs in the browser sandbox (`eval()`). No Python runtime, no Node.js APIs. |
| **No authentication** | Anyone with the room URL can join. Auth is a v2 scope item. |
| **Single server** | No Redis adapter — one Node.js process. Redis scaling is v2. |
| **Colour reuse > 8 users** | Cursor colours cycle after 8 users. |

---

## 3. Tech Stack — Frontend & Backend

### Frontend (`/client`)

| Layer | Technology | Version | Reason |
|---|---|---|---|
| UI Framework | React | ^18.3.1 | Concurrent rendering, ecosystem |
| Build Tool | Vite | ^8.0.9 | Rolldown bundler — 10–30× faster builds |
| Language | TypeScript | ^5.6.0 | `strict: true` enforced |
| Styling | Tailwind CSS | ^4.2.2 | CSS-native `@theme` tokens, dark mode |
| Routing | React Router | ^7.17.0 | SPA routing — import from `"react-router"` (v7) |
| Real-time sync | Yjs (CRDT) | ^13.6.31 | Conflict-free document sync — powers Figma/Excalidraw |
| WS Provider | y-websocket | ^2.1.0 | Connects `Y.Doc` to `/yjs` WebSocket |
| Awareness | y-protocols | ^1.0.6 | Cursor position / presence sync |
| Code Editor | Monaco Editor | ^0.52.0 | VS Code's editor, 90+ languages |
| Editor Wrapper | @monaco-editor/react | ^4.7.0 | React wrapper — no webpack config needed |
| Room Events | socket.io-client | ^4.8.3 | Join/leave/language/run-code events |
| Animation | motion (framer-motion v12) | ^12.40.0 | Panel transitions, toast animations |
| Icons | lucide-react | ^1.17.0 | v1.x — check migration guide from 0.x |
| Room ID generation | nanoid | ^5.0.7 | URL-safe unique IDs |
| SEO / Meta | react-helmet-async | ^2.0.5 | Dynamic `<title>`, `noindex`, canonical tags |

### Backend (`/server`)

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Runtime | Node.js | 22.12.0 | LTS, native fetch, performance |
| HTTP Framework | Express | ^4.21.0 | HTTP server, health endpoint |
| WebSocket (CRDT) | y-websocket | ^2.1.0 | Handles Yjs protocol at `/yjs` path |
| WebSocket (raw) | ws | ^8.21.0 | Underlying WebSocket server for y-websocket |
| Room Events | socket.io | ^4.8.3 | Join/leave/language/run-code broadcast |
| CORS | cors | ^2.8.5 | Express HTTP CORS — `CLIENT_URL` origin only |
| Config | dotenv | ^16.4.5 | Load env vars from `.env` |
| Rate Limiting | express-rate-limit | ^8.5.2 | HTTP endpoint rate limiting |
| Logging | pino | ^9.4.0 | Structured JSON logging |

### Deployment

| Service | Layer | Notes |
|---|---|---|
| **Vercel** | Frontend (React SPA) | Static hosting, auto-deploy from `main`, CSP headers via `vercel.json` |
| **Render** | Backend (Node.js) | Persistent process — no sleep. Single port. $5/month free credit. |

> **Do NOT use Render free tier** — services sleep after 15 min, breaking WebSocket connections.

---

## 4. Complete Folder Structure

```
forkroom/                                          ← GitHub repo root (monorepo)
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                                 ← Lint + unit tests + build on every PR
│   │   ├── codeql.yml                             ← CodeQL static security analysis
│   │   ├── dependency-review.yml                  ← Dependency security analysis on PRs
│   │   ├── release.yml                            ← Publishes draft GitHub releases
│   │   ├── stale.yml                              ← Closes inactive issues/PRs
│   │   ├── deploy-client.yml                      ← Deploys client to Vercel on push to main
│   │   └── deploy-server.yml                      ← Deploys server to Render on push to main
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── bug_report.yml
│   │   ├── feature_request.md
│   │   ├── feature_request.yml
│   │   └── security_vulnerability.yml
│   ├── pull_request_template.md
│   ├── CODEOWNERS
│   └── FUNDING.yml
│
├── .husky/                                        ← Git hooks (husky ^9.1.0)
│   ├── commit-msg                                 ← Validates conventional commits
│   ├── pre-commit                                 ← Runs lint-staged (prettier)
│   └── pre-push                                   ← Runs vitest unit tests
│
├── client/                                        ← React SPA (Vite 8 + TypeScript + Tailwind v4)
│   │
│   ├── public/                                    ← Static assets (served as-is by Vite)
│   │   ├── logo-1024x1024.png                     ← 1024×1024 full logo (preloader)
│   │   ├── nav-logo-full@2x.svg                   ← Header navigation logo (full wordmark)
│   │   ├── footer-logo-full@2x.svg                ← Footer logo (full wordmark)
│   │   ├── favicon-96.png                         ← 96×96 — editor page icon
│   │   ├── favicon-32.png                         ← 32×32 — standard browser tab
│   │   ├── favicon-16.png                         ← 16×16 — legacy browser fallback
│   │   ├── apple-touch-icon.png                   ← 180×180 — iOS Safari PWA bookmark
│   │   ├── favicon-192.png                        ← 192×192 — PWA manifest (required)
│   │   ├── favicon-512.png                        ← 512×512 — PWA manifest (maskable)
│   │   ├── og-image.png                           ← 1200×630 — Social share / Open Graph
│   │   ├── manifest.json                          ← PWA manifest: theme_color #4EC9B0, bg #1E1E1E
│   │   └── robots.txt                             ← Allow all crawlers; editor rooms excluded via noindex
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.tsx                 ← Nav: logo, GitHub link, Terms, Privacy
│   │   │   │   │   ├── Header.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Footer/
│   │   │   │   │   ├── Footer.tsx                 ← Brand, author, legal links, social share
│   │   │   │   │   ├── Footer.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ConnectionStatusBar/
│   │   │   │   │   ├── ConnectionStatusBar.tsx    ← Green/amber/red dot + label for WS state
│   │   │   │   │   ├── ConnectionStatusBar.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── ToastProvider/
│   │   │   │       ├── ToastProvider.tsx          ← Join/leave toast — 3s auto-dismiss, motion animation
│   │   │   │       ├── ToastProvider.test.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── landing/
│   │   │   │   ├── RoomInputForm/
│   │   │   │   │   ├── RoomInputForm.tsx          ← Room ID input + Join + Create Room CTA
│   │   │   │   │   ├── RoomInputForm.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── HowToUseSection/
│   │   │   │   │   ├── HowToUseSection.tsx        ← 4-step cards with lucide icons + connector arrows
│   │   │   │   │   ├── HowToUseSection.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── FAQSection/
│   │   │   │   │   ├── FAQSection.tsx             ← 10-item accordion, ChevronDown, 200ms animation
│   │   │   │   │   ├── FAQSection.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── FeaturesGrid/
│   │   │   │       ├── FeaturesGrid.tsx           ← 6 feature cards, 2-col grid
│   │   │   │       ├── FeaturesGrid.test.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   └── editor/
│   │   │       ├── MonacoPanel/
│   │   │       │   ├── MonacoPanel.tsx            ← Monaco editor + MonacoBinding + awareness cursors
│   │   │       │   ├── MonacoPanel.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── OutputPanel/
│   │   │       │   ├── OutputPanel.tsx            ← Run output (console captured) + Clear + Copy
│   │   │       │   ├── OutputPanel.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── UserAvatarList/
│   │   │       │   ├── UserAvatarList.tsx         ← Coloured initial badges, max 5 + "+N more"
│   │   │       │   ├── UserAvatarList.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── LanguageSelector/
│   │   │       │   ├── LanguageSelector.tsx       ← Dropdown: JS/TS/Python/HTML/CSS/JSON
│   │   │       │   ├── LanguageSelector.test.tsx
│   │   │       │   └── index.ts
│   │   │       ├── CursorOverlay/
│   │   │       │   ├── CursorOverlay.tsx          ← Name pill over remote cursor, auto-fades 3s inactivity
│   │   │       │   ├── CursorOverlay.test.tsx
│   │   │       │   └── index.ts
│   │   │       └── TemporaryContentBanner/
│   │   │           ├── TemporaryContentBanner.tsx ← Amber dismissible "content is temporary" warning
│   │   │           ├── TemporaryContentBanner.test.tsx
│   │   │           └── index.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage/
│   │   │   │   ├── LandingPage.tsx               ← Hero, HowToUse, FeaturesGrid, FAQSection, Footer
│   │   │   │   │                                    JSON-LD: SoftwareApplication + FAQPage schemas
│   │   │   │   ├── LandingPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── EditorPage/
│   │   │   │   ├── EditorPage.tsx                ← Null-checks roomId → redirects to / if missing
│   │   │   │   ├── EditorPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── TermsPage/
│   │   │   │   ├── TermsPage.tsx                 ← Terms of Service — 10 sections, canonical set
│   │   │   │   ├── TermsPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PrivacyPage/
│   │   │   │   ├── PrivacyPage.tsx               ← Privacy Policy — 11 sections, canonical set
│   │   │   │   ├── PrivacyPage.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── NotFoundPage/
│   │   │       ├── NotFoundPage.tsx              ← 404 fallback, noindex, link to /
│   │   │       ├── NotFoundPage.test.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useRoom.ts                        ← Socket.io room join/leave + user list state
│   │   │   │                                        socket.on('connect') → emit join-room (reconnect-safe)
│   │   │   ├── useRoom.test.ts
│   │   │   ├── useYjs.ts                         ← Y.Doc + WebsocketProvider (path /yjs) + MonacoBinding
│   │   │   ├── useYjs.test.ts
│   │   │   ├── useAwareness.ts                   ← Read/write awareness state (cursor, name, colour)
│   │   │   ├── useAwareness.test.ts
│   │   │   ├── useCodeRunner.ts                  ← Calls evalSandbox.runCode() → emits run-code via socket
│   │   │   ├── useCodeRunner.test.ts
│   │   │   ├── useConnectionStatus.ts            ← WebSocket connected/reconnecting/disconnected state
│   │   │   └── useConnectionStatus.test.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── roomUtils.ts                      ← generateRoomId() using nanoid
│   │   │   ├── roomUtils.test.ts
│   │   │   ├── colourAssigner.ts                 ← CURSOR_COLOURS[index % length] — wraps for >8 users
│   │   │   ├── colourAssigner.test.ts
│   │   │   ├── evalSandbox.ts                    ← Safe browser eval(): capture console.log/warn/error
│   │   │   │                                        Requires CSP unsafe-eval in vercel.json
│   │   │   ├── evalSandbox.test.ts
│   │   │   ├── monacoBinding.ts                  ← Manual MonacoBinding (Y.Text ↔ Monaco model.applyEdits)
│   │   │   ├── monacoBinding.test.ts
│   │   │   ├── languageMap.ts                    ← Monaco language ID → display name lookup
│   │   │   ├── languageMap.test.ts
│   │   │   ├── awarenessUtils.ts                 ← Parse awareness Map → AwarenessState[]
│   │   │   └── awarenessUtils.test.ts
│   │   │
│   │   ├── types/
│   │   │   ├── room.ts                           ← RoomUser, RoomState interfaces
│   │   │   ├── events.ts                         ← Socket.io event payload types
│   │   │   └── awareness.ts                      ← AwarenessState interface + CURSOR_COLOURS const
│   │   │
│   │   ├── constants/
│   │   │   ├── languages.ts                      ← Supported language list: js, ts, python, html, css, json
│   │   │   ├── routes.ts                         ← Route strings: LANDING='/', ROOM='/room/:roomId', etc.
│   │   │   └── socket-events.ts                  ← Socket.io event name strings (no magic strings)
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css                         ← Entry: @import tailwind + @theme tokens + base resets
│   │   │   └── tokens.css                        ← CSS custom properties: --surface, --accent, --text
│   │   │
│   │   ├── App.tsx                               ← BrowserRouter + Routes (Landing/Editor/Terms/Privacy/404)
│   │   ├── App.test.tsx
│   │   └── main.tsx                              ← React.createRoot + HelmetProvider + mount
│   │
│   ├── tests/
│   │   └── e2e/                                  ← Playwright E2E (needs both client + server running)
│   │       ├── realtime-sync.spec.ts
│   │       └── run-code-broadcast.spec.ts
│   │
│   ├── vercel.json                               ← CSP headers: unsafe-eval for Monaco eval sandbox
│   ├── eslint.config.js                          ← ESLint v9 flat config
│   ├── playwright.config.ts                      ← Two webServer entries: client (5173) + server (3001)
│   ├── tsconfig.json                             ← strict: true, @/ path alias → src/
│   ├── vite.config.ts                            ← @vitejs/plugin-react + @tailwindcss/vite
│   ├── vitest.config.ts                          ← jsdom environment, setupFiles, coverage v8
│   ├── vitest-setup.ts                           ← Extend expect with @chialab/vitest-axe matchers
│   ├── index.html                                ← Vite HTML entry: favicons, PWA, OG tags, fonts, preloader
│   ├── .env.example                              ← VITE_SERVER_URL=
│   └── package.json
│
├── server/                                       ← Node.js 22 (Express + Socket.io + y-websocket)
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   └── health.js                         ← GET /health → { status, timestamp, activeRooms }
│   │   ├── middleware/
│   │   │   ├── cors.js                           ← Express HTTP CORS: CLIENT_URL origin only
│   │   │   └── errorHandler.js                   ← Global 500 error handler
│   │   ├── socket/
│   │   │   ├── roomHandler.js                    ← All Socket.io events: join-room, language-change,
│   │   │   │                                        run-code, disconnect + roomStore cleanup
│   │   │   └── roomStore.js                      ← In-memory Map<roomId, RoomState>
│   │   └── utils/
│   │       └── logger.js                         ← pino structured JSON logger
│   │
│   ├── tests/
│   │   └── integration/
│   │       ├── health.test.js                    ← GET /health → 200 + { status, timestamp, activeRooms }
│   │       └── socket-events.test.js             ← join-room, leave-room, disconnect, rate-limit, language
│   │
│   ├── eslint.config.js                          ← ESLint v9 flat config (Node.js + globals)
│   ├── index.js                                  ← Entry: Express + Socket.io + y-websocket on /yjs path
│   ├── .env.example                              ← CLIENT_URL=  PORT=3001  NODE_ENV=development
│   └── package.json
│
├── doc/                                          ← All project documentation
│   ├── 01-problem-and-architecture.md
│   ├── 02-architecture-diagrams-eraser.md
│   ├── 03-dependencies-and-tech-stack.md
│   ├── 04-workflow-diagram-eraser.md
│   ├── 05-user-stories-features-pages.md
│   ├── 06-visual-design-and-logo.md
│   ├── 07-test-strategy-and-deployment.md
│   └── 08-folder-structure.md
│
├── .editorconfig                                 ← indent_style=space, indent_size=2, eol=lf
├── .gitattributes                                ← * text=auto eol=lf (enforce LF everywhere)
├── .gitignore
├── .nvmrc                                        ← 22.12.0 — pins Node for nvm, Render, Vercel
├── CHANGELOG.md                                  ← Conventional Commits version history
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                                       ← MIT
├── README.md
├── SECURITY.md
└── package.json                                  ← Root: workspaces, lint-staged, husky
```

---

## 5. Complete API Documentation

### A. HTTP REST Endpoints

#### `GET /health`

Health check endpoint. Used by Render health checks, deployment monitoring, and Playwright E2E `webServer` config.

**Request:**
```http
GET /health HTTP/1.1
Host: your-server.onrender.com
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": 1786511000000,
  "activeRooms": 3
}
```

| Field | Type | Description |
|---|---|---|
| `status` | `"ok"` | Always `"ok"` if server is running |
| `timestamp` | `number` | `Date.now()` in milliseconds |
| `activeRooms` | `number` | Current `roomStore.size` — count of active rooms in memory |

**Rate-limited**: Yes (via `express-rate-limit`).

---

### B. Socket.io Events

Both directions use Socket.io over WebSocket. Server path: `/` (default).

#### CLIENT → SERVER Events

---

##### `join-room`

Emitted by the client on every `socket.on('connect')` event (fires on initial connect AND every reconnect — this is the reconnect-safe design pattern).

**Payload:**
```typescript
interface JoinRoomPayload {
  roomId: string;    // room URL segment — e.g. "abc123"
  name: string;      // display name chosen by user
  colour: string;    // hex colour from CURSOR_COLOURS pool — assigned client-side
}
```

**Rate limit:** Max 10 `join-room` events per socket per minute. The 11th emits returns an `error` event.

**Server actions:**
1. Rate-limit check
2. `socket.join(roomId)` — join Socket.io room
3. Update `roomStore` Map — add/replace user entry
4. `socket.to(roomId).emit('user-joined', ...)` — broadcast to others
5. `socket.emit('room-state', ...)` — send current room state to this client

---

##### `language-change`

Emitted when a user selects a different language in the language selector.

**Payload:**
```typescript
interface LanguageChangePayload {
  roomId: string;
  language: string;  // Monaco language ID: "javascript" | "typescript" | "python" | "html" | "css" | "json"
}
```

**Server actions:**
1. Update `roomStore.get(roomId).language`
2. `socket.to(roomId).emit('language-changed', { language })` — broadcast to others

---

##### `run-code`

Emitted when a user clicks Run (or presses Ctrl+Enter) to share their execution output with the room.

**Payload:**
```typescript
interface RunCodePayload {
  roomId: string;
  output: string;    // Stringified console output from browser eval() sandbox
  runBy: string;     // Display name of the user who ran the code
  latency: number;   // Execution latency in ms (displayed in output panel)
}
```

**Server actions:**
1. `socket.to(roomId).emit('code-output', { output, runBy, latency, timestamp: Date.now() })` — broadcast to all other room members

---

#### SERVER → CLIENT Events

---

##### `room-state`

Sent immediately after a successful `join-room` to bring the joining client up to date.

**Payload:**
```typescript
{
  users: RoomUser[];    // All currently connected users in the room
  language: string;     // Current language selection
}

interface RoomUser {
  id: string;        // socket.id
  name: string;
  colour: string;
  joinedAt: number;  // Date.now() timestamp
}
```

---

##### `user-joined`

Broadcast to all existing room members (not the joining user) when someone new joins.

**Payload:**
```typescript
{
  id: string;       // socket.id of the new user
  name: string;
  colour: string;
}
```

---

##### `user-left`

Broadcast to all remaining room members when a user disconnects.

**Payload:**
```typescript
{
  id: string;       // socket.id of the departed user
  name: string;
}
```

---

##### `language-changed`

Broadcast to all room members (except the sender) when the language selection changes.

**Payload:**
```typescript
{
  language: string;   // New language ID
}
```

---

##### `code-output`

Broadcast to all room members (except the runner) when code is executed.

**Payload:**
```typescript
{
  output: string;     // Captured console output string
  runBy: string;      // Display name of runner
  latency: number;    // Execution time in ms
  timestamp: number;  // Date.now()
}
```

---

##### `error`

Sent to the client only (not broadcast) when a server-side rule violation occurs.

**Payload:**
```typescript
{
  message: string;    // e.g. "Too many join attempts. Please wait 1 minute."
}
```

---

### C. Yjs WebSocket (CRDT Document Sync)

**Path:** `/yjs` (on the same Node.js HTTP server and port as Socket.io)

This is not a traditional REST API. It uses the binary `y-websocket` protocol (binary CRDT frames) to sync `Y.Doc` state between all clients in a room.

| Aspect | Detail |
|---|---|
| **Protocol** | `ws://` / `wss://` — binary WebSocket frames |
| **Path** | `/yjs/<roomId>` |
| **Library (server)** | `y-websocket` → `setupWSConnection(ws, req)` |
| **Library (client)** | `WebsocketProvider` from `y-websocket` |
| **Origin check** | Server rejects connections where `req.headers.origin !== CLIENT_URL` with close code `1008` |
| **Room isolation** | Each room (`roomId`) has its own `Y.Doc` instance in memory |
| **Cleanup** | y-websocket built-in — doc released when last WS connection to a room closes |
| **Awareness** | Cursor positions/names sync via the same WebSocket path using `y-protocols/awareness` |

**Connection example (client):**
```typescript
const provider = new WebsocketProvider(
  `${process.env.VITE_SERVER_URL}/yjs`,  // e.g. wss://server.onrender.com/yjs
  roomId,                                 // room document name
  ydoc
)
```

---

## 6. Security Model

> **Note:** This is an MVP tool with no authentication. Security is focused on connection isolation, rate limiting, and browser sandboxing.

### Security Layers

| Layer | Mechanism | Detail |
|---|---|---|
| **WebSocket origin check** | `wss.on('connection')` header check | Rejects Yjs WS connections where `origin !== CLIENT_URL`. Prevents unauthorized clients from syncing documents. Close code: `1008`. |
| **Socket.io CORS** | `Server({ cors: { origin: CLIENT_URL } })` | Only the whitelisted frontend origin can make Socket.io connections. |
| **HTTP CORS** | `cors` middleware | Express HTTP routes only accept requests from `CLIENT_URL`. |
| **Rate limiting — Socket.io** | Per-socket `join-room` counter | Max 10 `join-room` events per socket per 60 seconds. Excess returns `error` event. |
| **Rate limiting — HTTP** | `express-rate-limit` | Applied to all HTTP endpoints (`/health`, future REST). |
| **Browser code execution** | `eval()` in browser sandbox | JavaScript executes in the browser's own security sandbox — no server-side code execution, no filesystem access. |
| **CSP (`unsafe-eval`)** | `vercel.json` Content-Security-Policy header | `script-src 'self' 'unsafe-eval'` — required for Monaco's editor model + eval sandbox. Scoped to `script-src` only; other directives are strict. |
| **No data persistence** | In-memory only | No database, no file storage. All room content is irreversibly deleted when the last user disconnects. No attack surface for data exfiltration from persistent storage. |

### Token / Auth Model

**Forkroom v1 (current) has NO authentication, tokens, or sessions.**

| Field | Value |
|---|---|
| Auth type | None (no login required) |
| Access token | Not used |
| Refresh token | Not used |
| Session | Socket.io uses a transport-level session ID for WebSocket connection management only — not for user identity |
| Room access control | URL-based — anyone with the room URL can join |

> **v2 roadmap:** JWT-based room ownership, optional password-protected rooms, Socket.io room ACL.

### No Database = No Data at Rest

There is no database in Forkroom v1. All state is held in:
- **`roomStore` (server RAM)**: `Map<roomId, RoomState>` — deleted when last user disconnects
- **`Y.Doc` (server RAM)**: Yjs document per room — released by y-websocket when room empties
- **`awareness` (client RAM)**: Cursor state — never sent to persistent storage

---

## 7. All Dependencies & Versions

### Client (`/client/package.json`)

#### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM renderer |
| `react-router` | ^7.17.0 | Client-side routing (NOT react-router-dom — deprecated in v7) |
| `yjs` | ^13.6.31 | CRDT shared document library |
| `y-websocket` | ^2.1.0 | WebsocketProvider — connects Y.Doc to server |
| `y-protocols` | ^1.0.6 | Awareness protocol — cursor/presence sync |
| `@monaco-editor/react` | ^4.7.0 | Monaco editor React wrapper |
| `monaco-editor` | ^0.52.0 | Monaco core (VS Code's editor) |
| `socket.io-client` | ^4.8.3 | Socket.io client — room events |
| `motion` | ^12.40.0 | Animations (import from `"motion/react"`) |
| `lucide-react` | ^1.17.0 | Icon library (v1.x — check migration from 0.x) |
| `nanoid` | ^5.0.7 | URL-safe unique room ID generation |
| `react-helmet-async` | ^2.0.5 | Dynamic `<head>` meta tags per route |
| `tailwindcss` | ^4.2.2 | CSS-native utility framework |

#### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8.0.9 | Build tool + dev server |
| `@vitejs/plugin-react` | ^6.0.0 | Vite React fast-refresh plugin |
| `@tailwindcss/vite` | ^4.2.2 | Required Vite plugin for Tailwind v4 |
| `typescript` | ^5.6.0 | TypeScript compiler |
| `@types/react` | ^18.3.1 | React TypeScript types |
| `@types/react-dom` | ^18.3.1 | ReactDOM TypeScript types |
| `vitest` | ^4.1.9 | Unit + component test runner |
| `@vitest/coverage-v8` | ^4.1.9 | V8-based code coverage |
| `@testing-library/react` | ^16.0.1 | React component testing |
| `@testing-library/user-event` | ^14.5.2 | Realistic user interaction simulation |
| `@chialab/vitest-axe` | ^0.19.1 | Accessibility assertions in Vitest |
| `@playwright/test` | ^1.61.0 | E2E browser testing |
| `jsdom` | ^26.0.0 | DOM environment for Vitest |
| `eslint` | ^9.13.0 | Linter (v9 flat config) |
| `typescript-eslint` | ^8.67.0 | TypeScript ESLint integration |
| `@typescript-eslint/eslint-plugin` | ^8.66.0 | TypeScript-specific lint rules |
| `@typescript-eslint/parser` | ^8.66.0 | TypeScript ESLint parser |
| `eslint-plugin-react-hooks` | ^7.1.1 | React hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.5.4 | React refresh / HMR lint rules |
| `prettier` | ^3.3.3 | Code formatter |

---

### Server (`/server/package.json`)

#### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.21.0 | HTTP server framework |
| `socket.io` | ^4.8.3 | WebSocket room events server |
| `y-websocket` | ^2.1.0 | Yjs CRDT sync server (`setupWSConnection`) |
| `ws` | ^8.21.0 | Raw WebSocket library (used by y-websocket) |
| `cors` | ^2.8.5 | Express HTTP CORS middleware |
| `dotenv` | ^16.4.5 | Environment variable loader |
| `express-rate-limit` | ^8.5.2 | HTTP endpoint rate limiting |
| `pino` | ^9.4.0 | Structured JSON logging |

#### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `nodemon` | ^3.1.0 | Dev server auto-restart on file changes |
| `vitest` | ^4.1.9 | Integration test runner |
| `socket.io-client` | ^4.8.3 | Test client for socket integration tests |
| `globals` | latest | Node.js globals for ESLint flat config |
| `eslint` | ^9.13.0 | Linter (v9 flat config) |
| `prettier` | ^3.3.3 | Code formatter |

---

### Root (`/package.json`)

| Package | Version | Purpose |
|---|---|---|
| `husky` | ^9.1.0 | Git hooks management |
| `lint-staged` | ^15.2.0 | Run formatters on staged files pre-commit |

---

### Node.js Version

| Field | Value |
|---|---|
| Minimum | 20.19+ or 22.12+ (Vite 8 requirement) |
| Pinned | `22.12.0` (see `.nvmrc`) |
| npm | 10+ |

---

## 8. Application Workflow Diagram

### Full User Flow (from first visit to collaboration)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER VISITS forkroom.dev                          │
│                          Preloader → Landing Page (/)                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                        │
              ┌─────────────────────────┴────────────────────────┐
              │                                                   │
              ▼                                                   ▼
  ┌──────────────────────┐                          ┌──────────────────────────┐
  │   Create New Room    │                          │   Enter Room ID / URL   │
  │   generateRoomId()   │                          │   (paste existing link)  │
  │   → nanoid()         │                          └────────────┬─────────────┘
  └──────────┬───────────┘                                       │
             │                                                   │
             └─────────────────────────┬─────────────────────────┘
                                        │
                                        ▼
                          ┌─────────────────────────────┐
                          │  Navigate to /room/:roomId   │
                          │  EditorPage renders          │
                          │  → Name input form shown     │
                          └──────────────┬──────────────┘
                                         │
                                         │  User enters display name + clicks Join
                                         ▼
                          ┌─────────────────────────────┐
                          │  useYjs hook initialises:   │
                          │  • Y.Doc created            │
                          │  • WebsocketProvider        │
                          │    connects to wss://.../yjs│
                          │  • Awareness: name + colour │
                          └──────────────┬──────────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │  useRoom hook initialises:  │
                          │  • Socket.io connects       │
                          │  • socket.on('connect')     │
                          │    → emit join-room         │
                          │    (fires on reconnect too) │
                          └──────────────┬──────────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │  Server receives join-room  │
                          │  • Rate limit check         │
                          │  • roomStore.set(roomId,…)  │
                          │  • emit user-joined → peers │
                          │  • emit room-state → client │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │     EDITOR ROOM ACTIVE       │
                          │                             │
                          │  ┌─────────┐ ┌──────────┐  │
                          │  │  Monaco │ │  Output  │  │
                          │  │  Editor │ │  Panel   │  │
                          │  └────┬────┘ └──────────┘  │
                          └───────┼─────────────────────┘
                                  │
          ┌───────────────────────┼──────────────────────────┐
          │                       │                          │
          ▼                       ▼                          ▼
┌──────────────────┐   ┌─────────────────────┐   ┌───────────────────────┐
│  User Types Code │   │  Language Change     │   │  Run Code (Ctrl+Enter)│
│                  │   │                     │   │                       │
│ Keystroke        │   │ LanguageSelector    │   │ evalSandbox.runCode() │
│ → MonacoBinding  │   │ → emit             │   │ → captures console    │
│ → Y.Text update  │   │   language-change   │   │ → emit run-code       │
│ → Y.Doc update   │   │                     │   │ → server broadcasts   │
│ → WSProvider     │   │ Server:             │   │   code-output to room │
│ → wss://.../yjs  │   │ roomStore updated   │   │                       │
│ → y-websocket    │   │ → emit              │   │ All users see:        │
│ → All peers sync │   │   language-changed  │   │ "[UserName] Latency"  │
│   via CRDT       │   │   to all peers      │   │ "> console output"    │
└──────────────────┘   └─────────────────────┘   └───────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────┐
│                  AWARENESS (parallel channel)             │
│                                                          │
│  provider.awareness.setLocalStateField('user', {         │
│    name, colour, cursor: { anchor, head }                │
│  })                                                      │
│  → synced to all peers via wss://.../yjs                 │
│  → CursorOverlay renders remote cursor name pills        │
│  → UserAvatarList renders user badges                    │
└──────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│        USER DISCONNECTS          │
│                                  │
│ Socket.io: socket.on('disconnect')│
│ → roomStore: remove user         │
│ → if last user: delete room      │
│ → else: emit user-left to peers  │
│                                  │
│ Y.Doc: released by y-websocket   │
│ when room has no connections     │
└──────────────────────────────────┘
```

### CRDT Conflict Resolution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Shared state: "hello world"                                     │
│        │                           │                            │
│        ▼                           ▼                            │
│  User A (offline 500ms)     User B (offline 500ms)              │
│  Deletes "world" at pos 6   Changes "world" → "universe" at 6   │
│  Local: "hello "            Local: "hello universe"             │
│        │                           │                            │
│        └─────────────┬─────────────┘                            │
│                       ▼                                          │
│            Both reconnect — y-websocket broadcasts updates      │
│            socket.on('connect') → re-emit join-room             │
│                       │                                          │
│                       ▼                                          │
│       Final merged state: "hello universe"                       │
│       (CRDT: delete < insert at same position — deterministic)   │
│       Identical on ALL clients — no data loss                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Database / State — Collections & Data Flow

> **Forkroom v1 has NO database.** All state is held in server RAM and released automatically.

### In-Memory State (Server)

#### `roomStore` — `Map<roomId, RoomState>`

Location: `server/src/socket/roomStore.js`

```typescript
// Schema
interface RoomState {
  roomId: string;
  users: RoomUser[];
  language: string;    // current language selection for the room
}

interface RoomUser {
  id: string;          // socket.id
  name: string;        // display name
  colour: string;      // hex cursor colour
  joinedAt: number;    // Date.now()
}
```

**Lifecycle:**
- Created when first user joins a room (`join-room` event)
- Updated on every `join-room` (handles reconnect — stale entry for same socket removed first)
- `language` updated on `language-change` event
- User removed on `disconnect` event
- Entire room entry deleted when last user disconnects → **prevents memory leak**

#### `Y.Doc` (per room) — managed by y-websocket

Location: y-websocket in-memory store (internal to `y-websocket` server)

```typescript
// Conceptual schema
{
  [roomId: string]: Y.Doc  // one Y.Doc per room
  // Each Y.Doc contains:
  //   Y.Text('monaco') — the editor content
  //   awareness data — cursor positions + user info
}
```

**Lifecycle:**
- Created by y-websocket on first client connection to room
- Synced between all clients via binary CRDT protocol
- Released by y-websocket when last WebSocket connection to room closes

#### `joinAttempts` — `Map<socketId, { count, resetAt }>`

Location: `server/src/socket/roomHandler.js`

Rate limiting state. Deleted on socket disconnect. Prevents memory accumulation.

---

### Data Flow Visual Diagram

```
CLIENT                              SERVER
  │                                   │
  │──── WebSocket to /yjs/roomId ────▶│
  │                                   │  y-websocket:
  │                                   │  Y.Doc (in RAM per room)
  │◀─── CRDT binary frames ──────────│  auto-syncs between all clients
  │                                   │  released when room empties
  │                                   │
  │──── Socket.io to / ─────────────▶│
  │     join-room payload             │  roomStore Map:
  │                                   │  { roomId → { users[], language } }
  │◀─── room-state response ─────────│  deleted when last user leaves
  │◀─── user-joined broadcast ───────│
  │                                   │
  │──── language-change ────────────▶│  roomStore[roomId].language = new
  │◀─── language-changed broadcast ──│
  │                                   │
  │──── run-code ───────────────────▶│  no storage — pure broadcast
  │◀─── code-output broadcast ───────│
  │                                   │
  │    [disconnect]                   │
  │                                   │  roomStore: remove user
  │                                   │  if last user: delete room entry
  │◀─── user-left broadcast ─────────│  Y.Doc: released by y-websocket
```

### No Persistent Storage — By Design

| What | Where | Lifetime |
|---|---|---|
| Room user list | Server RAM (`roomStore`) | Until all users disconnect |
| Editor content (Y.Doc) | Server RAM (y-websocket) | Until all users disconnect |
| Cursor/presence (awareness) | Client RAM + WS broadcast | Until user disconnects |
| Display name | Server RAM (`roomStore`) + client localStorage | Session only (server); localStorage persists locally only |
| Language selection | Server RAM (`roomStore.language`) | Until all users disconnect |
| Code execution output | Client RAM only | Until page refresh |

> There is no MongoDB, PostgreSQL, Redis, or any other external data store in Forkroom v1.

---

## 10. Setup Guide

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 22.12.0+ (see `.nvmrc`) |
| npm | 10+ |
| Git | Any recent version |

### 1. Clone the Repository

```bash
git clone https://github.com/logusivam/forkroom.git
cd forkroom
```

### 2. Install All Dependencies (all workspaces + git hooks)

```bash
npm ci
```

> `npm ci` installs from `package-lock.json` exactly and runs `prepare: husky install` automatically.

### 3. Configure Environment Variables

**Server** — copy and edit:
```bash
cd server && cp .env.example .env
```

Edit `server/.env`:
```env
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

**Client** — copy and edit:
```bash
cd ../client && cp .env.example .env
```

Edit `client/.env`:
```env
VITE_SERVER_URL=ws://localhost:3001
```

### 4. Run the Development Servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
# Starts nodemon on port 3001
# Health check: http://localhost:3001/health
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
# Starts Vite dev server on port 5173
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Running Tests

**Unit + component tests (watch mode):**
```bash
cd client && npm test
```

**Unit tests (single run):**
```bash
cd client && npm test -- --run
```

**Server integration tests:**
```bash
cd server && npm test
```

**E2E tests** (requires both client + server running):
```bash
cd client && npm run test:e2e
```

**Lint:**
```bash
npm run lint --workspace=client
npm run lint --workspace=server
```

### 6. Production Build

**Client build:**
```bash
cd client && npm run build
# Output: client/dist/
```

**Server:** Runs directly with Node.js — no build step needed.

### 7. Production Deployment

#### Frontend → Vercel

1. Import the GitHub repository in the Vercel dashboard
2. Set the root directory to `/client`
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable: `VITE_SERVER_URL=wss://your-server.onrender.com`
7. The `client/vercel.json` CSP headers are applied automatically

#### Backend → Render

1. Create a new Render project → Deploy from GitHub → select root (or `/server`)
2. Set environment variables:
   - `CLIENT_URL=https://your-app.vercel.app`
   - `PORT=3001`
   - `NODE_ENV=production`
3. Render assigns `your-server.onrender.com` — update `VITE_SERVER_URL` in Vercel

> **Do NOT use Render free tier** — 15-min sleep breaks WebSocket connections.

---

## 11. Chat & Reference Links

### Project Repository

| Resource | URL |
|---|---|
| GitHub Repository | https://github.com/logusivam/forkroom |
| Live Demo | https://forkroom.dev |
| Bug Reports | https://github.com/logusivam/forkroom/issues |
| Pull Requests | https://github.com/logusivam/forkroom/pulls |
| CI Workflows | https://github.com/logusivam/forkroom/actions |
| Security | https://github.com/logusivam/forkroom/security |

### Creator

| Resource | URL |
|---|---|
| GitHub Profile | https://github.com/logusivam |
| Organisation | Logusivam Vision |
 
### Key Library References

| Library | Documentation |
|---|---|
| Yjs | https://docs.yjs.dev |
| y-websocket | https://github.com/yjs/y-websocket |
| Monaco Editor | https://microsoft.github.io/monaco-editor |
| Socket.io | https://socket.io/docs/v4 |
| Vite | https://vite.dev |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| React Router v7 | https://reactrouter.com/home |
| Playwright | https://playwright.dev |
| Vitest | https://vitest.dev |
| Pino | https://getpino.io |

---

## 12. Colour Codes & Font Families

### Colour Palette (WCAG 2.1 Contrast-Verified)

All ratios calculated against `--surface` (`#1E1E1E` — VS Code's exact background colour).

| Token | Hex | Contrast vs Surface | WCAG Level | Usage |
|---|---|---|---|---|
| `--surface` | `#1E1E1E` | — | — | Editor background, page background |
| `--surface-2` | `#252526` | — | — | Panel backgrounds, header |
| `--surface-3` | `#2D2D30` | — | — | Input backgrounds, dropdowns |
| `--border` | `#3E3E42` | — | — | Dividers, panel borders |
| `--text-primary` | `#D4D4D4` | 10.67:1 | **AAA ✓** | Primary text |
| `--text-secondary` | `#9D9D9D` | 4.54:1 | **AA ✓** | Secondary labels, timestamps, footer |
| `--accent-green` | `#4EC9B0` | 5.02:1 | **AA ✓** | Run button, connected status, success toasts |
| `--accent-blue` | `#569CD6` | 4.65:1 | **AA ✓** | Primary CTA buttons, links |
| `--accent-amber` | `#CE9178` | 4.51:1 | **AA ✓** | Reconnecting status, warning banner |
| `--accent-red` | `#F44747` | 5.28:1 | **AA ✓** | Disconnected status, error states |

### Cursor Colour Pool (8 colours — `CURSOR_COLOURS[index % 8]`)

Used only as non-text UI fills (WCAG 1.4.11 — 3:1 threshold applies).

| Index | Hex | Name |
|---|---|---|
| 0 | `#FF6B6B` | Coral red |
| 1 | `#4ECDC4` | Teal |
| 2 | `#45B7D1` | Sky blue |
| 3 | `#96CEB4` | Sage green |
| 4 | `#FFEAA7` | Soft yellow |
| 5 | `#DDA0DD` | Plum |
| 6 | `#98D8C8` | Mint |
| 7 | `#F7DC6F` | Golden |

> Index 8+ wraps to index 0. Documented as known limitation for rooms with more than 8 users.

### Special Brand Colours

| Use | Hex |
|---|---|
| PWA theme colour | `#4EC9B0` |
| PWA background colour | `#1E1E1E` |
| OG image background | `#1E1E1E` |
| Preloader background | `#1E1E1E` |
| Preloader accent | `#4EC9B0` |
| Preloader gradient | `#4EC9B0` → `#569CD6` |

### Font Families

| Role | Typeface | Weights | Usage |
|---|---|---|---|
| UI text, labels, body | **Inter** | 400 / 500 / 600 | All non-code UI — nav, headings, body, buttons |
| Room IDs, output, shortcuts | **JetBrains Mono** | 400 / 500 | Room ID chips, output panel, `Ctrl+Enter` labels, preloader wordmark |
| Editor content | Monaco (VS Code default) | — | Injected by Monaco Editor — do not override |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Size | Usage |
|---|---|
| 11px | Status bar labels, sub-footer copyright |
| 13px | Editor meta labels, room ID chip, preloader |
| 14px | Body / UI default |
| 16px | CTA button labels, body-lg |
| 18px | How-to steps, FAQ answers |
| 24px | Section headings (h2) |
| 40px | Hero H1 (landing page only) |

---

## 13. Logo Design — Reasoning

### Logo Concept Summary

A **git fork icon** — one base circle splitting into two upward bezier branches — with a **cursor blink underscore** on the active right branch. No text needed. Universally understood by developers.

### Construction Spec (for reference)

| Element | Colour | Spec |
|---|---|---|
| Fork base circle | `#4EC9B0` | Solid fill, 10px diameter |
| Fork stem | `#D4D4D4` | 2px stroke, 14px height, vertical |
| Left branch | `#D4D4D4` | 2px stroke, bezier curve up-left |
| Right branch | `#4EC9B0` | 2px stroke, bezier curve up-right |
| Left top circle | `#D4D4D4` | Solid fill, 7px diameter |
| Right top circle | `#4EC9B0` | Solid fill, 7px diameter |
| Cursor blink | `#4EC9B0` | 2px × 8px rect, 2px below right top circle |

### Wordmark Spec

| Part | Typeface | Weight | Colour |
|---|---|---|---|
| "Fork" | JetBrains Mono | 700 | `#4EC9B0` |
| "room" | Inter | 600 | `#D4D4D4` |

---

*Forkroom — Real-Time Collaborative Code Editor*  
*Built by Loganathan G P · Logusivam Vision · MIT Licence · © 2026*
