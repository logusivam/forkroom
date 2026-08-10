# 03 — Dependencies & Tech Stack
# Forkroom

> All versions verified against npm registry, July 2026.
> Node.js minimum: 20.19+ or 22.12+ (Vite 8 requirement).

---

## Project Structure

```
forkroom/
├── client/          ← React SPA (Vite 8 + TypeScript + Tailwind v4)
│   └── package.json
├── server/          ← Node.js (Express + y-websocket + Socket.io)
│   └── package.json
└── README.md
```

---

## Frontend Dependencies (`/client`)

| Package | Version | Purpose & Notes |
|---|---|---|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | DOM renderer |
| `vite` | ^8.0.9 | Build tool (Rolldown bundler, 10–30× faster builds). Node 20.19+ required. |
| `@vitejs/plugin-react` | ^4.3.0 | Vite React fast-refresh plugin |
| `typescript` | ^5.6.0 | Type safety. `strict: true` enforced in `tsconfig.json`. |
| `tailwindcss` | ^4.2.2 | Styling (CSS-native `@theme`, no config file). Min 4.2.2 for Vite 8. |
| `@tailwindcss/vite` | ^4.2.2 | Required Vite plugin for Tailwind v4. Without it, Tailwind produces no output silently. |
| `react-router` | ^7.17.0 | Routing. Import from `"react-router"` only — `react-router-dom` is deprecated in v7. `useParams<{ roomId: string }>()` returns `string \| undefined` — validate in `EditorPage`. |
| `yjs` | ^13.6.31 | CRDT library — shared document state, conflict-free concurrent editing. 920K weekly downloads, powers Figma/Excalidraw/Tiptap. |
| `y-websocket` | ^2.1.0 | WebsocketProvider — connects Y.Doc to y-websocket server at path `/yjs` for real-time sync. |
| `y-protocols` | ^1.0.6 | Awareness protocol — syncs cursor positions, user presence (name, colour) separately from document content. |
| `@monaco-editor/react` | ^4.7.0 | Monaco editor React wrapper (VS Code's editor). No webpack config needed. |
| `y-monaco` | ^0.1.6 | MonacoBinding — binds Y.Text to Monaco model. **Verify compatibility with monaco-editor 0.52.0 before release** — package last released 2022. If incompatible, use the manual `MonacoBinding` implementation in `client/src/lib/monacoBinding.ts` (see `03-loophole-fixes.md` L-01). |
| `monaco-editor` | ^0.52.0 | Monaco core (peer dep of @monaco-editor/react). |
| `socket.io-client` | ^4.8.3 | Socket.io client — room join/leave, presence events, language change, run-code broadcast. Re-emits `join-room` on every `connect` event (handles both initial connect and reconnect). |
| `motion` | ^12.40.0 | Animation (formerly framer-motion). Import from `"motion/react"`. For panel transitions and join/leave toasts. |
| `lucide-react` | ^1.17.0 | Icons. Major version 1.x — check lucide.dev migration guide if following 0.x tutorials. |
| `nanoid` | ^5.0.7 | Generates URL-safe unique room IDs. Used in `generateRoomId()` in `client/src/lib/roomUtils.ts`. Import: `import { nanoid } from 'nanoid'`. |
| `react-helmet-async` | ^2.0.5 | Dynamic per-route `<head>` tags — `<title>`, `<meta name="robots">`, `<link rel="canonical">`. Required for `noindex` on `/room/:roomId` and canonical links on `/terms`, `/privacy`. Must wrap app in `<HelmetProvider>` in `main.tsx`. |

---

## Backend Dependencies (`/server`)

| Package | Version | Purpose & Notes |
|---|---|---|
| `express` | ^4.21.0 | HTTP server (serves health endpoint, mounts Socket.io and y-websocket on same server) |
| `socket.io` | ^4.8.3 | WebSocket server — rooms, presence, language events, run-result broadcast. Includes per-socket rate limiting on `join-room` (max 10/min). |
| `y-websocket` | ^2.1.0 | `setupWSConnection()` — handles all Yjs CRDT sync protocol. Mounted at `path: '/yjs'` on the same HTTP server as Socket.io. Origin checked before `setupWSConnection()` is called. |
| `ws` | ^8.21.0 | WebSocket server (used by y-websocket). Explicit dep to stay on patched version. |
| `cors` | ^2.8.5 | Allow frontend origin for Express HTTP routes. **Note**: does not cover WebSocket upgrades — origin is enforced separately in `wss.on('connection')`. |
| `dotenv` | ^16.4.5 | Load `CLIENT_URL`, `PORT`, `NODE_ENV` from `.env`. `YJS_PORT` is not used — both servers share `PORT`. |
| `express-rate-limit` | ^8.5.2 | Rate-limit HTTP endpoints (health, future REST endpoints). Socket.io events rate-limited separately in `roomHandler.js`. |
| `pino` | ^9.4.0 | Structured JSON logging. Used in `server/src/utils/logger.js`. |

> **Node.js built-in fetch**: Node 18+ has fetch globally. No `node-fetch` package needed.

---

## Dev Dependencies (`/client`)

| Package | Version | Purpose |
|---|---|---|
| `vitest` | ^4.1.9 | Unit + component testing. Environment must be `jsdom`. |
| `@vitest/coverage-v8` | ^4.1.9 | Coverage. Must match vitest version exactly. |
| `@testing-library/react` | ^16.0.1 | Component testing |
| `@testing-library/user-event` | ^14.5.2 | Realistic user interaction simulation |
| `@chialab/vitest-axe` | ^0.2.0 | Accessibility assertions in Vitest. Required by `vitest-setup.ts` — must be listed here. |
| `@playwright/test` | ^1.61.0 | E2E tests — two `webServer` entries start both client and server. |
| `eslint` | ^9.13.0 | Linting |
| `prettier` | ^3.3.3 | Formatting |

## Dev Dependencies (root `package.json`)

| Package | Version | Purpose |
|---|---|---|
| `husky` | ^9.1.0 | Git hooks. Must be in root `devDependencies` — `prepare: husky install` script requires it at install time. |
| `lint-staged` | ^15.2.0 | Runs eslint + prettier on staged files pre-commit. |

---

## Tech Stack Reasoning

| Layer | Choice | Why |
|---|---|---|
| **Real-time sync** | Yjs 13.x (CRDT) | Mathematically correct concurrent editing. No manual conflict resolution. Same engine as Figma/Excalidraw. Shows CRDT knowledge — rare in portfolios at 2yr experience level. |
| **Editor** | Monaco Editor | VS Code's editor. 90+ languages, IntelliSense, familiar UX. `y-monaco` binding used where compatible; manual `MonacoBinding` fallback covers Monaco 0.52.0+. Employers immediately recognise it. |
| **Room/presence events** | Socket.io 4.8 | CRDT handles document sync. Socket.io handles everything else: join/leave notifications, language switch, run-code broadcast. Separation of concerns — each tool does what it is best at. |
| **Single-port WS routing** | `WebSocket.Server({ server, path: '/yjs' })` | y-websocket and Socket.io share one HTTP server and one port. WS upgrade path filters traffic. Mandatory for Railway free tier (one URL per service). |
| **Framework** | React 18 + Vite 8 | MERN stack. Vite 8 + Rolldown = fastest builds. |
| **Styling** | Tailwind v4.2.2 | Zero config. CSS-native tokens. Dark theme primary. |
| **Routing** | React Router v7 | `/` (landing) + `/room/:roomId` (editor). Two routes only. `roomId` null-checked in `EditorPage`. |
| **Code execution** | `eval()` in browser sandbox (MVP) | Browser `eval()` runs JavaScript only, sandboxed by the browser. `console.log` overridden before eval, restored after, output captured to string. `unsafe-eval` CSP directive required — set in `vercel.json`. |
| **Security** | Origin check on WS + Socket.io rate limit + CSP | WS origin enforced in `wss.on('connection')`. Socket.io `join-room` limited to 10/socket/min. CSP `unsafe-eval` scoped to script-src only. |

---

## What NOT to Use — Interview Prep

| Rejected | Reason |
|---|---|
| **Raw Socket.io for document sync** | Socket.io emit/on has no conflict resolution. Two users editing the same character simultaneously = data loss. |
| **Operational Transformation (OT)** | Correct approach but requires centralized server to sequence all ops — complex to implement. Yjs (CRDT) solves this without central coordination. |
| **MongoDB for room content** | No persistence in MVP — adds complexity for no benefit. Y.Doc in-memory per room is the correct starting point. Mention Redis/PostgreSQL Yjs adapters as v2 path. |
| **`react-router-dom`** | Deprecated in v7. Use `react-router` directly. |
| **`node-fetch`** | Unnecessary on Node 18+. Use `globalThis.fetch()`. |
| **Next.js** | SSR overhead with no SEO benefit. This is a real-time tool. Vite SPA is correct. |
| **`YJS_PORT` env var** | Not needed. Both servers run on same `PORT`. Removed from all env config. |
| **Separate WebSocket port for Yjs** | Railway free tier provides one URL — two ports require two services. Single-port via `/yjs` path is correct. |

---

## Deployment Compatibility

| Service | Frontend (React SPA) | Backend (Node + Socket.io) |
|---|---|---|
| Vercel | ✅ Static hosting. Add `vercel.json` with CSP headers for `unsafe-eval`. | ❌ Socket.io needs persistent WebSocket — Vercel serverless functions time out at 30s and don't support persistent WS |
| Railway | ✅ Static + Node | ✅ **Best free option** — persistent Node process, no sleep, $5/month credit. One URL = one port = single-port WS routing required. |
| Render | ✅ Static site | ⚠️ Free tier sleeps after 15 min — breaks WebSocket reconnection UX |
| Fly.io | ✅ Static site via `flyctl` (not evaluated — Vercel preferred) | ✅ Free allowance, persistent Node, WebSocket supported |

> **Recommendation**: Vercel for frontend (add `vercel.json` with CSP), Railway for backend (single port, both WS on same server).
