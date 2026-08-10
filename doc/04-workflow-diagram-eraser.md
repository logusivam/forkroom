# 04 — Yjs Data Flow & Event System Diagrams (Eraser.io)
# Forkroom

---

## A. Yjs Shared Types Data Flow
**Eraser.io type: Flowchart**

```eraser
title Forkroom — Yjs Internal Data Flow

YDoc [shape: rectangle, label: "Y.Doc\n(root shared document per room)"]
YText [shape: rectangle, label: "Y.Text\n(shared text type)\ndoc.getText('monaco')"]
Awareness [shape: rectangle, label: "Awareness CRDT\n(separate from document)\nCursor pos, user name, colour"]

MonacoEditor [shape: rectangle, label: "Monaco Editor\n(UI layer)"]
MonacoBinding [shape: rectangle, label: "MonacoBinding\n(y-monaco or manual fallback)\nBridge: Y.Text ↔ Monaco model.applyEdits()"]
WSProvider [shape: rectangle, label: "WebsocketProvider (y-websocket)\nConnects to wss://server/yjs\nSyncs Y.Doc updates over WS"]
YjsServer [shape: rectangle, label: "y-websocket server\npath: '/yjs' on shared HTTP server\nOrigin check before setupWSConnection()\nIn-memory doc store — auto-cleaned on last disconnect"]

OtherClients [shape: rectangle, label: "Other connected clients\n(same room)"]

MonacoEditor > MonacoBinding: User keystroke
MonacoBinding > YText: Insert/delete CRDT operation (Y.transact local)
YText > YDoc: Update triggers
YDoc > WSProvider: Encode binary CRDT update
WSProvider > YjsServer: WebSocket send (path /yjs)
YjsServer > OtherClients: Broadcast to room
OtherClients > OtherClients: Apply update → Monaco reflects change

Awareness > WSProvider: Separate awareness update (cursor pos)
WSProvider > YjsServer: Awareness update
YjsServer > OtherClients: Broadcast awareness
OtherClients > OtherClients: Render remote cursor label (auto-fade 3s inactivity)
```

---

## B. Socket.io Event System (non-document events)
**Eraser.io type: Flowchart**

```eraser
title Forkroom — Socket.io Event Map (with reconnect + cleanup)

Client [shape: rectangle, label: "Client (React)\nuseRoom hook"]
Server [shape: rectangle, label: "Socket.io Server\nroomHandler.js\nroomStore Map"]
RoomClients [shape: rectangle, label: "Other clients in room"]

Client > Server: socket.on('connect') fires → join-room { roomId, name, colour }
note: 'connect' fires on initial connect AND every reconnect
Server > Server: rate limit check (max 10 join-room/socket/min)
Server > Server: socket.roomId = roomId; socket.userName = name
Server > Server: socket.join(roomId); roomStore.set/update
Server > RoomClients: user-joined { id, name, colour }
Server > Client: room-state { users[] }

Client > Server: language-change { roomId, language }
Server > RoomClients: language-changed { language }

Client > Server: run-code { roomId, output, runBy }
Server > RoomClients: code-output { output, runBy, timestamp }

Server > RoomClients: user-left { id, name } (on socket disconnect)
Server > Server: remove from roomStore; if last user → delete room entry
note: roomStore.delete(roomId) prevents unbounded memory growth
```

---

## C. Conflict Resolution Example (CRDT guarantee)
**Eraser.io type: Flowchart**

```eraser
title CRDT Conflict: Two Concurrent Edits

State [shape: rectangle, label: "Shared state: 'hello world'"]
UserA [shape: rectangle, label: "User A (offline 500ms)\nDeletes 'world' at pos 6\nLocal: 'hello '"]
UserB [shape: rectangle, label: "User B (offline 500ms)\nChanges 'world' → 'universe' at pos 6\nLocal: 'hello universe'"]

Reconnect [shape: rectangle, label: "Both reconnect — CRDT merge\ny-websocket broadcasts updates\nsocket.on('connect') → re-emit join-room"]
Result [shape: rectangle, label: "Final merged state: 'hello universe'\n(CRDT resolves: delete < insert at same pos)\nIdentical on ALL clients — no data loss\nroomStore user list restored via re-join"]

State > UserA: concurrent edit
State > UserB: concurrent edit
UserA > Reconnect: send CRDT update + rejoin room
UserB > Reconnect: send CRDT update + rejoin room
Reconnect > Result: deterministic merge
```

> **Note**: The exact merge result ("hello universe" vs "hello ") is deterministic based on Yjs CRDT rules (logical timestamps + actor IDs). Neither user's edit is silently dropped — the merge is always predictable and reproducible.

---

## D. TypeScript Types Reference (implement these)

```typescript
// types/room.ts
export interface RoomUser {
  id: string;           // socket.id
  name: string;         // display name chosen by user
  colour: string;       // random from CURSOR_COLOURS pool
  joinedAt: number;     // Date.now()
}

export interface RoomState {
  roomId: string;
  users: RoomUser[];
  language: string;     // Monaco language identifier e.g. "javascript", "typescript", "python"
}

// types/events.ts — Socket.io event payloads (type these on both client + server)
export interface JoinRoomPayload {
  roomId: string;
  name: string;
  colour: string;
}

export interface LanguageChangePayload {
  roomId: string;
  language: string;
}

export interface RunCodePayload {
  roomId: string;
  output: string;       // stringified result from browser eval() — console.log captured
  runBy: string;        // display name
  timestamp: number;
}

// Awareness state shape (set on provider.awareness.setLocalState())
export interface AwarenessState {
  name: string;
  colour: string;
  cursor: {
    anchor: { line: number; column: number } | null;
    head:   { line: number; column: number } | null;
  } | null;
}

// Cursor colour pool — assign by index % length (wraps for >8 users — documented limitation)
export const CURSOR_COLOURS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
] as const;
```

---

## E. evalSandbox Implementation Spec

```typescript
// client/src/lib/evalSandbox.ts
// Captures console.log output + return value + errors.
// Requires CSP: script-src 'self' 'unsafe-eval' in vercel.json.

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

## F. Socket.io roomStore Cleanup (server reference)

```javascript
// server/src/socket/roomHandler.js
// Attach to socket on join — used for cleanup on disconnect

socket.on('join-room', (payload) => {
  const { roomId, name, colour } = payload

  // Rate limit check
  // ... (see loophole-fixes L-11)

  socket.roomId = roomId      // store for disconnect handler
  socket.userName = name      // store for broadcast

  socket.join(roomId)
  // update roomStore ...
  io.to(roomId).emit('user-joined', { id: socket.id, name, colour })
  socket.emit('room-state', { users: roomStore.get(roomId)?.users ?? [] })
})

socket.on('disconnect', () => {
  // Clean up joinAttempts FIRST — before any early return.
  // If rate-limit fired and socket.roomId was never set, the socket
  // still has a joinAttempts entry that must be removed here.
  // Moving this after the roomId guard would leak memory on every
  // connect-without-join cycle (e.g. bots, scanners, rate-limited clients).
  joinAttempts.delete(socket.id)

  const roomId = socket.roomId
  if (!roomId) return   // connected but never successfully joined — nothing else to clean up

  const room = roomStore.get(roomId)
  if (!room) return

  room.users = room.users.filter(u => u.id !== socket.id)

  if (room.users.length === 0) {
    roomStore.delete(roomId)                                    // prevent memory leak
  } else {
    io.to(roomId).emit('user-left', { id: socket.id, name: socket.userName })
  }
})
```
