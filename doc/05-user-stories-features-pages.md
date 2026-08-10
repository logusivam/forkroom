# 05 — User Stories, Features, Pages & Sections
# Forkroom

---

## User Stories

### Epic 1 — Room Creation & Joining
- **US-1.1**: As a developer, I want to create a room with one click so I can start collaborating in under 10 seconds.
- **US-1.2**: As a developer, I want a shareable URL for my room so I can invite a collaborator by sending a link.
- **US-1.3**: As a developer, I want to enter a display name before joining so my collaborators know who I am.
- **US-1.4**: As a developer, I want a randomly assigned cursor colour so I am visually distinguishable from others.

### Epic 2 — Real-Time Code Editing
- **US-2.1**: As a developer, I want to see my collaborator's keystrokes appear in real-time so we can pair-program.
- **US-2.2**: As a developer, I want to see my collaborator's cursor position and name so I know where they are editing.
- **US-2.3**: As a developer, I want my edits to never conflict with or overwrite my collaborator's edits so no work is lost.
- **US-2.4**: As a developer, I want to undo my own changes without undoing my collaborator's changes.

### Epic 3 — Language & Syntax
- **US-3.1**: As a developer, I want to choose the programming language so I get correct syntax highlighting.
- **US-3.2**: As a developer, I want my language selection to apply to all users in the room so we all see the same highlighting.

### Epic 4 — Code Execution
- **US-4.1**: As a developer, I want to run JavaScript code directly in the browser so I can see output without a backend.
- **US-4.2**: As a developer, I want all users in the room to see the run output so we can debug together.
- **US-4.3**: As a developer, I want to see who ran the code in the output panel so I know which user triggered the run.

### Epic 5 — Presence & Awareness
- **US-5.1**: As a developer, I want to see a list of all active users in the room so I know who is present.
- **US-5.2**: As a developer, I want to be notified when someone joins or leaves so I am aware of the room state.
- **US-5.3**: As a developer, I want to see the WebSocket connection status so I know if I am synced.
- **US-5.4**: As a developer, I want the room to automatically restore my presence after a network drop so I do not need to refresh.

### Epic 6 — Utility
- **US-6.1**: As a developer, I want a copy-URL button so I can share the room without selecting the address bar.
- **US-6.2**: As a developer, I want a warning that content is temporary so I know to copy my code before leaving.
- **US-6.3**: As a developer, I want the editor to open at `/` if I navigate to a room with an invalid or missing room ID so I am not stranded on a broken page.

---

## Feature List

| # | Feature | Priority | Notes |
|---|---|---|---|
| F-01 | Generate room ID + redirect to /room/:roomId | Must-have | nanoid-generated ID |
| F-02 | Display name entry before joining room | Must-have | |
| F-03 | Random cursor colour assignment from pool (modulo 8) | Must-have | Documents wrap behaviour for >8 users |
| F-04 | Monaco Editor rendered in room | Must-have | |
| F-05 | Yjs Y.Text bound to Monaco via MonacoBinding (y-monaco or manual fallback) | Must-have | Verify y-monaco 0.1.6 + Monaco 0.52.0 compatibility first |
| F-06 | y-websocket provider — real-time CRDT sync via `/yjs` path | Must-have | Single-port deployment |
| F-07 | Remote cursor overlays with name labels (Awareness) | Must-have | Auto-fade 3s inactivity |
| F-08 | Active user list (avatars with initials + colour) | Must-have | Max 5 + "+N more" chip |
| F-09 | Join/leave toast notifications (Socket.io) | Must-have | Auto-dismiss 3s |
| F-10 | Language selector — synced to all users | Must-have | |
| F-11 | Run code (JS browser eval) + output panel | Must-have | console.log captured; console.warn/error captured |
| F-12 | Run output broadcast to all room users (Socket.io) | Must-have | |
| F-13 | Copy room URL button | Must-have | |
| F-14 | WebSocket connection status indicator | Must-have | Connected / Reconnecting / Disconnected |
| F-15 | "Content is temporary" warning banner | Must-have | Dismissible amber banner |
| F-16 | Reconnect auto-rejoin (socket.on('connect') re-emits join-room) | Must-have | Prevents stale user list after network drop |
| F-17 | roomId null guard in EditorPage → redirect to / | Must-have | Prevents broken page on invalid URL |
| F-18 | roomStore Map cleanup on last user disconnect | Must-have | Prevents server memory leak |
| F-19 | Socket.io join-room rate limit (10/socket/min) | Must-have | Prevents room spam / memory exhaustion |
| F-20 | CSP header via vercel.json (unsafe-eval scoped to script-src) | Must-have | Required for browser eval() |
| F-21 | WS origin check on y-websocket connection | Must-have | Enforced before setupWSConnection() |
| F-22 | Local undo/redo (own changes only — Yjs userOnly history) | Should-have | |
| F-23 | Room participant count in tab title | Could-have | |
| F-24 | Clear output button | Could-have | |
| F-25 | Keyboard shortcut: Ctrl+Enter to run code | Could-have | |

---

## Pages — 2 Total

---

### Page 1 — Landing (`/`)

**Purpose**: Entry point. Create or join a room in one action.

| Section | Content |
|---|---|
| **Header** | Forkroom logo + wordmark (left). GitHub, Terms, and Privacy links (right) with collapsible mobile drawer toggle trigger. |
| **Hero** | H1: "Code together. Instantly." Subline: "Paste a room link or create one — no sign up, no installs." Two actions: [Create Room] button (generates nanoid UUID, redirects) + [Join Room] text input (enter room ID) + [Join] button. |
| **Features Grid** | 3 cards: "Real-time sync" (CRDT — zero conflicts), "Live cursors" (see who's where), "Run code" (instant JS output). Each with icon + 2-line description. |
| **Footer** | Community column (GitHub, LinkedIn, Twitter/X profiles, and Report an issue on GitHub link), Share widget column (X, Instagram, Facebook, LinkedIn, WhatsApp, Telegram, Reddit share triggers), Copyright footer details, and Terms/Privacy links. |

**SEO (landing page only):**
```html
<title>Forkroom — Real-Time Collaborative Code Editor, No Login Required</title>
<meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync. No signup, no install. The Google Docs for code.">
```

---

### Page 2 — Editor Room (`/room/:roomId`)

**Purpose**: The entire product. Real-time collaborative editor.

> **roomId guard**: On mount, `EditorPage` checks `useParams<{ roomId: string }>()`. If `roomId` is `undefined` or empty string, immediately navigate to `/`. This prevents a broken editor state from an invalid URL.

| Section | Content |
|---|---|
| **EditorHeader** | Left: Forkroom interactive SVG logo + room ID chip with stateful copy button. Centre: Language selector dropdown (JavaScript, TypeScript, Python, HTML, CSS, JSON). Right: User avatar list (coloured initials badges, max 5 + "+N more") + Run button (green, Ctrl+Enter shortcut) + mobile navigation dropdown menu trigger button. |
| **ConnectionStatusBar** | Thin bar below header. Green dot "Connected" / Amber dot "Reconnecting..." / Red dot "Disconnected". |
| **EditorPanel (main — left ~70%)** | Monaco Editor filling remaining height. Dark theme (vs-dark). Remote cursors rendered as coloured vertical bars with floating name labels (via Awareness). Name pill auto-fades after 3 seconds of cursor inactivity. Local cursor is normal Monaco cursor. |
| **OutputPanel (right ~30%)** | Header: "Output" + Clear output button + Copy output clipboard button. Body: monospace output lines. Each run shows: `[Name] ran (Latency: Xms)` header line + output lines below (including captured console.warn/error). Scroll to bottom on new output. |
| **ToastContainer** | Top-right corner. Slide-in toasts: "[Name] joined the room" (green) / "[Name] left the room" (grey). Auto-dismiss 3 seconds. |
| **TemporaryContentBanner** | Amber banner below header on first load: "Room content is temporary — copy your code before everyone leaves." Dismissible via React `useState`. |

**SEO (editor page):**
```html
<title>Coding Room — Forkroom Collaborative Editor</title>
<meta name="robots" content="noindex">
```
> Room pages must be `noindex` — content is ephemeral and URL-per-session has no SEO value.

**Layout**: Header (fixed, 56px) + StatusBar (4px) + [EditorPanel | OutputPanel] filling remaining viewport height. No page scroll. Resize handle between panels (drag to adjust split — default 70/30).

**Mobile layout** (< 768px): Stack vertically — Editor (60vh) + Output (collapsed, expandable toggle).

---

## Page Count: 4 (+ 404 fallback)

| Route | Page | Component | SEO |
|---|---|---|---|
| `/` | Landing | `LandingPage` | ✅ indexed, canonical set |
| `/room/:roomId` | Editor | `EditorPage` | ❌ noindex, nofollow |
| `/terms` | Terms of Service | `TermsPage` | ✅ indexed, canonical set |
| `/privacy` | Privacy Policy | `PrivacyPage` | ✅ indexed, canonical set |
| `*` | 404 Not Found | `NotFoundPage` | ❌ noindex |

All routes registered in `App.tsx`. Route constants in `client/src/constants/routes.ts`:
```typescript
export const ROUTES = {
  LANDING: '/',
  ROOM: '/room/:roomId',
  TERMS: '/terms',
  PRIVACY: '/privacy',
} as const
```

---

### Page 3 — Terms of Service (`/terms`)

**Purpose**: Legal. Indexed. Linked from footer on all non-editor pages.

| Section | Content |
|---|---|
| **Header** | Same nav as Landing — Forkroom logo + GitHub + Terms (active) + Privacy |
| **H1** | "Terms of Service" |
| **Last updated** | "Last updated: 1 August 2026" |
| **Body** | 10 numbered sections — see doc 06 Section 7.6 for full copy |
| **Footer** | Same footer as Landing |

**SEO**: `<title>Terms of Service — Forkroom</title>` · `robots: index, follow` · `canonical: https://forkroom.dev/terms`

---

### Page 4 — Privacy Policy (`/privacy`)

**Purpose**: Legal. Indexed. Linked from footer on all non-editor pages.

| Section | Content |
|---|---|
| **Header** | Same nav as Landing — Forkroom logo + GitHub + Terms + Privacy (active) |
| **H1** | "Privacy Policy" |
| **Last updated** | "Last updated: 1 August 2026" |
| **Body** | 11 numbered sections — see doc 06 Section 7.7 for full copy |
| **Footer** | Same footer as Landing |

**SEO**: `<title>Privacy Policy — Forkroom</title>` · `robots: index, follow` · `canonical: https://forkroom.dev/privacy`

---

Simple by design — the product IS the editor page. /terms and /privacy are static content pages required for trust, SEO, and legal compliance.

---

## Additional Epics & User Stories (Added August 2026)

### Epic 5 — Advanced Code Transpilation & Execution
- **US-5.1**: As a developer, I want to write modern TypeScript containing switch-case statements, type assertions (`as Type`), and non-null properties (`!`) without JS eval throwing syntax errors.
- **US-5.2**: As a python developer, I want to use standard Python operations (like `len()`, `max()`, `min()`, `sum()`, and `range()`) and list comprehensions (like `[x for x in items]`) to run Python code smoothly in the browser sandbox.

### Epic 6 — Social, Share & Support Features
- **US-6.1**: As a pair programmer, I want to copy the console output with one click, without warning/error tags, to share logs with my coworker.
- **US-6.2**: As a developer, I want to see how fast my code executed in milliseconds to verify execution performance.
- **US-6.3**: As an active user, I want to share Forkroom instantly across major social media networks (X, Facebook, LinkedIn, WhatsApp, Telegram, Reddit) and report issues directly to the GitHub repository.

