# 01 — Problem Statement & Architecture
# Forkroom — Real-Time Collaborative Code Editor

## Why Forkroom

"Fork" is one of the most universally understood words in developer culture — git fork, process fork, fork in the road. It means: branching from the same origin to do your own work. "Room" is exactly what this product is — a temporary shared space where two developers fork away from their separate work and converge together. Every developer understands what it does from the name alone without reading a tagline. Verified unclaimed as a standalone product (July 2026).

**Tagline**: "Fork together. Ship faster."
**Domain targets**: `forkroom.dev` · `forkroom.app` · `getforkroom.com`

---

## What It Is

A browser-based collaborative code editor where multiple users join a named room, edit code simultaneously, see each other's live cursors, and run code output — all in real-time. No login required to start.

---

## Detailed Explanation

### The core problem it solves

Remote developers working on the same code file right now have two bad options:

1. **Screen share** (Zoom/Meet) — one person types, everyone watches. No hands-on collaboration. Laggy. No persistent output.
2. **Paste code into Slack/Discord** — async, loses context, conflicts when two people edit.

No lightweight, instant, shareable tool exists that lets two developers open a URL and start coding together in < 10 seconds — like a Google Docs for code, without needing to install VS Code Live Share, create an account, or set up anything.

### The real-time technical problem

Concurrent text editing has a fundamental conflict problem. Classic example:

```
Original:  "hello world"
User A (at same instant):  deletes "world"     → "hello "
User B (at same instant):  changes "world" to "universe" → "hello universe"
```

Naive "last write wins" = one user's work silently disappears. This is the core unsolved problem of collaborative editing. Two solutions exist:

**Operational Transformation (OT)** — used by Google Docs. Requires a central server to sequence all operations. Complex to implement correctly.

**CRDT (Conflict-free Replicated Data Type)** — used by Figma, Linear, Notion. Data structures that mathematically guarantee convergence without a central arbiter. Any two users with the same operations applied in any order reach the same state.

Forkroom uses **Yjs** (CRDT library, 920K weekly downloads) — the same engine powering Tiptap, Excalidraw, and VS Code's collaborative features. This is the correct choice for a portfolio project: shows you understand the actual problem, not just "socket.io emit/on".

---

## How Forkroom Solves It

1. Each room has a **Yjs shared document** (`Y.Doc`) as the source of truth
2. `Y.Text` shared type wraps the Monaco editor content — every keystroke becomes a CRDT operation
3. `y-websocket` syncs these operations between all clients via WebSocket (mounted at `/yjs` path)
4. **Conflict resolution is automatic** — Yjs guarantees convergence regardless of network order
5. **Awareness protocol** (`y-protocols/awareness`) syncs cursor positions and user presence (name, colour) separately from document content — so cursors are always live even without typing
6. Socket.io handles **room management**, **user join/leave events**, and **presence notifications** (non-document events) alongside the Yjs WebSocket for document sync
7. On Socket.io reconnect, the client re-emits `join-room` to restore server-side room state — preventing stale user lists after network interruption

---

## Architecture — CRDT Sync + Socket.io Rooms

> **Single-port deployment**: Both the Yjs WebSocket (`/yjs` path) and Socket.io WebSocket run on the same Node.js HTTP server and same port. Railway free tier provides one public URL per service — a single port is mandatory. The two WebSocket connections from the client go to the same host/port with different paths.

```
┌─────────────────────────────────────────────────────────┐
│                 CLIENT A — React SPA                     │
│  Monaco Editor ↔ MonacoBinding ↔ Y.Text (shared type)   │
│  Y.Doc (local CRDT state)                                │
│  WebsocketProvider → wss://server/yjs (Yjs CRDT sync)   │
│  Socket.io client  → wss://server/    (room events)     │
└───────────────┬─────────────────────────────────────────┘
                │ Both WS connections → same host, same port
                │ Yjs: path /yjs  |  Socket.io: path /
                ▼
┌─────────────────────────────────────────────────────────┐
│              SERVER — Node.js + Express                  │
│  Single HTTP server (port $PORT, e.g. 3001)             │
│                                                          │
│  WebSocket.Server({ server, path: '/yjs' })              │
│  → setupWSConnection() — handles all Yjs doc sync        │
│  → in-memory doc store per room name                     │
│  → origin check enforced before setupWSConnection        │
│                                                          │
│  Socket.io server (same HTTP server, default path /)    │
│  → room join/leave events + disconnect auto-cleanup      │
│  → active user list broadcast                            │
│  → language change events                                │
│  → run-code result broadcast                             │
│  → rate limit: max 10 join-room events/socket/min       │
└───────────────┬─────────────────────────────────────────┘
                │ Both WS connections → same port, different paths
                ▼
┌─────────────────────────────────────────────────────────┐
│                 CLIENT B — React SPA                     │
│  Same Y.Doc state — auto-merged via CRDT                 │
│  Sees Client A's cursor + colour via Awareness           │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture Decision Record

| Decision | Reasoning |
|---|---|
| **Yjs (CRDT) for document sync, not raw Socket.io** | Socket.io alone requires you to implement conflict resolution manually. Yjs solves this correctly at a mathematical level. Using Yjs + Socket.io for non-document events is the production pattern (Excalidraw, Tiptap use this exact split). |
| **Monaco Editor, not CodeMirror** | Monaco is VS Code's editor — syntax highlighting for 90+ languages, IntelliSense-style autocomplete, familiar keyboard shortcuts. The `y-monaco` binding is used where compatible; a manual `MonacoBinding` fallback is implemented for Monaco 0.52.0 forward-compatibility. Employers recognise Monaco immediately. |
| **y-websocket for document sync** | Maintained by the Yjs team. `setupWSConnection()` handles all Yjs protocol framing. Abstracts away binary encoding/decoding of CRDT updates. |
| **Socket.io for room/presence events** | Non-document events (join/leave/language switch/run output) don't need CRDT semantics. Socket.io's rooms, namespaces, and broadcast API are the right tool for this. |
| **Single-port deployment (y-websocket on `/yjs` path)** | Both y-websocket and Socket.io share the same HTTP server. y-websocket is mounted at `path: '/yjs'` so the WebSocket upgrade filter separates traffic correctly. No `YJS_PORT` needed — one `PORT` env var only. |
| **In-memory document store (MVP)** | No MongoDB needed for MVP — Yjs keeps doc state in memory per room. Rooms expire when all users disconnect (y-websocket built-in + explicit `roomStore` Map cleanup on last `disconnect`). Honest limitation: no persistence across sessions. Documented in README. |
| **Socket.io disconnect cleanup** | `socket.on('disconnect')` removes the user from `roomStore`, broadcasts `user-left`, and deletes the room Map entry when the last user leaves — preventing unbounded memory growth. |
| **Socket.io reconnect re-join** | Client handles `socket.on('connect')` (fires on initial connect AND reconnect) by emitting `join-room` — keeping server `roomStore` consistent after network interruption. |
| **Single Node server (no Redis)** | Redis adapter needed only when scaling to multiple server processes. Single process handles MVP. Document in README as a v2 scaling path. |

---

## What a 10-Year Dev Sees

Layer 1 — basic: "uses Socket.io and Monaco"

Layer 2 — intermediate: "understands WebSocket event lifecycle, room isolation"

Layer 3 — senior: "knows WHY Yjs instead of naive last-write-wins, can explain CRDT convergence guarantee, knows the OT vs CRDT tradeoff, understands awareness vs document sync as separate channels, knows single-port WS path routing"

Layer 4 — staff: can answer — "what happens if two clients edit the same position simultaneously with 500ms network lag?", "how would you add persistence without breaking CRDT merge?", "how would you scale this to 1000 concurrent rooms?" (answer: `y-websocket` Redis adapter + `socket.io` Redis adapter — both support horizontal scaling across multiple Node processes behind a load balancer), "why does y-websocket need an explicit origin check separate from Express CORS?"

If you can answer layer 3 questions in an interview, you sound like a 4–5 year dev minimum regardless of actual experience.

---

## Known Limitations — Document in README

| Limitation | Cause | Handle in UI |
|---|---|---|
| No persistence | In-memory only — room content lost when all users disconnect | Toast: "Room content is temporary. Copy your code before leaving." |
| No auth | Any user can join any room by URL | Mention in README as v2 scope |
| Single-server only | No Redis adapter — one Node process | README: v2 scale path with y-websocket Redis adapter |
| Crash = all rooms lost | No PM2/cluster restart policy in MVP | README: v2 — add Railway health restart + PM2 |
| Code execution is sandboxed JS only (MVP) | Running arbitrary server-side code safely requires Docker sandboxing — out of MVP scope | Label clearly in UI: "JavaScript only, runs in browser (no Node APIs)" |
| Colour reuse above 8 users | `CURSOR_COLOURS` pool has 8 entries; 9th user wraps to first colour | Show muted notice in `UserAvatarList` when room has > 8 users: "Colours repeat beyond 8 users." Document in README. |
