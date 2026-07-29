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
- 🔗 **Instant room sharing** — one URL, paste anywhere

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
