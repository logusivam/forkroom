# 02 — Architecture & Workflow Diagrams (Eraser.io Code)
# Forkroom

Paste each block into eraser.io using the matching diagram type.

> **Deployment note on all diagrams**: Both Yjs WebSocket (`/yjs` path) and Socket.io run on the **same port** on the Node.js server. Railway free tier provides one public URL — single-port is mandatory. Client connects to `wss://server/yjs` for Yjs and `wss://server/` for Socket.io — same host, same port, different paths.

---

## A. System Architecture Diagram
**Eraser.io type: Cloud Architecture**

```eraser
title Forkroom - System Architecture (Single-Port)

ClientA [icon: react, label: "Client A\nReact SPA (Vite 8)"]
ClientB [icon: react, label: "Client B\nReact SPA (Vite 8)"]
ClientC [icon: react, label: "Client C\nReact SPA (Vite 8)"]

NodeServer [icon: nodejs, label: "Node.js Server\nExpress + y-websocket(/yjs) + Socket.io\nSingle port $PORT\nOrigin check on WS upgrade"]
YjsStore [icon: database, label: "Yjs In-Memory\nDoc Store (per room)\nAuto-cleanup on last disconnect"]
RoomStore [icon: database, label: "roomStore Map\nSocket.io user state\nCleaned on disconnect"]
CodeRunner [icon: code, label: "Code Runner\nbrowser eval() sandbox\nConsole.log capture"]

ClientA > NodeServer: WS /yjs — Yjs CRDT updates + awareness
ClientB > NodeServer: WS /yjs — Yjs CRDT updates + awareness
ClientC > NodeServer: WS /yjs — Yjs CRDT updates + awareness
ClientA > NodeServer: WS / — Socket.io (room join/leave/lang/run)
ClientB > NodeServer: WS / — Socket.io (room join/leave/lang/run)
NodeServer > YjsStore: read/write Y.Doc per roomName
NodeServer > RoomStore: read/write user list per roomId
NodeServer > ClientA: broadcast merged CRDT state
NodeServer > ClientB: broadcast merged CRDT state
NodeServer > ClientC: broadcast merged CRDT state
ClientA > CodeRunner: run code locally in browser
CodeRunner > ClientA: output result (console captured)
ClientA > NodeServer: Socket.io emit run-result
NodeServer > ClientB: Socket.io broadcast run-result
NodeServer > ClientC: Socket.io broadcast run-result
```

---

## B. Yjs CRDT Sync Sequence
**Eraser.io type: Sequence**

```eraser
title Forkroom - CRDT Document Sync Flow

ClientA [icon: react, label: "Client A (Monaco)"]
YjsA [icon: database, label: "Y.Doc A (local)"]
Server [icon: nodejs, label: "y-websocket Server (/yjs path)"]
YjsB [icon: database, label: "Y.Doc B (local)"]
ClientB [icon: react, label: "Client B (Monaco)"]

ClientA > YjsA: User types "hello" at position 5
activate YjsA
YjsA > YjsA: Create Y.Text insert operation (CRDT)
YjsA > Server: WS /yjs — binary encoded CRDT update
deactivate YjsA
activate Server
Server > Server: Origin check passes
Server > Server: Merge update into room Y.Doc
Server > YjsB: Broadcast CRDT update to all other clients
deactivate Server
activate YjsB
YjsB > YjsB: Apply update (guaranteed convergence)
YjsB > ClientB: Trigger Monaco editor update
deactivate YjsB
ClientB > ClientB: Show "hello" at position 5
```

---

## C. Room Join + Awareness Sequence
**Eraser.io type: Sequence**

```eraser
title Forkroom - Room Join, Cursor Awareness, and Reconnect

NewUser [icon: user, label: "New User"]
ReactApp [icon: react, label: "React App"]
SocketServer [icon: nodejs, label: "Socket.io Server"]
YjsServer [icon: nodejs, label: "y-websocket Server (/yjs)"]
OtherClients [icon: react, label: "Other Clients"]

NewUser > ReactApp: Enter room name + display name
ReactApp > SocketServer: socket.on('connect') fires → emit('join-room', {room, name, colour})
note: connect event handles both initial connect AND reconnect
activate SocketServer
SocketServer > SocketServer: rate limit check (max 10/min per socket)
SocketServer > SocketServer: socket.join(room), store in roomStore
SocketServer > OtherClients: socket.to(room).emit('user-joined', {id, name, colour})
SocketServer > ReactApp: emit('room-state', {users[]})
deactivate SocketServer
ReactApp > YjsServer: WebsocketProvider connect (wss://server/yjs, roomName)
activate YjsServer
YjsServer > YjsServer: Origin check enforced
YjsServer > ReactApp: Send full current Y.Doc state (initial sync)
deactivate YjsServer
ReactApp > ReactApp: Set awareness state {name, colour, cursor}
ReactApp > YjsServer: awareness update broadcast
YjsServer > OtherClients: Forward awareness state
OtherClients > OtherClients: Render new user cursor + label

note: On network drop + reconnect, socket.on('connect') fires again → re-emits join-room → roomStore stays consistent
```

---

## D. User Workflow Flowchart
**Eraser.io type: Flowchart**

```eraser
title Forkroom - User Workflow

Start [shape: oval, color: green]
EnterRoom [shape: rectangle, label: "Enter room name + display name"]
RoomExists [shape: diamond, label: "Room exists?"]
CreateRoom [shape: rectangle, label: "Create new room\n(new Y.Doc in memory)"]
JoinRoom [shape: rectangle, label: "Join existing room\n(sync current Y.Doc state)"]
LoadEditor [shape: rectangle, label: "Load Monaco editor\nwith current room content"]
UserAction [shape: diamond, label: "User action?"]
TypeCode [shape: rectangle, label: "Type in editor\n→ Y.Text CRDT op\n→ sync to all users"]
ChangeLanguage [shape: rectangle, label: "Select language\n→ Socket.io emit\n→ all clients update syntax"]
RunCode [shape: rectangle, label: "Click Run (or Ctrl+Enter)\n→ eval() in browser sandbox\n→ console.log captured\n→ broadcast output via Socket.io"]
ShareURL [shape: rectangle, label: "Copy room URL\n→ share with collaborator"]
NetworkDrop [shape: diamond, label: "Network drop?"]
Reconnect [shape: rectangle, label: "socket.on('connect') fires\n→ re-emit join-room\n→ roomStore restored"]
UserLeave [shape: diamond, label: "Last user leaves?"]
DestroyRoom [shape: rectangle, label: "socket.on('disconnect')\n→ remove from roomStore\n→ delete room if empty\n(Y.Doc also auto-cleaned by y-websocket)"]
Done [shape: oval, color: green]

Start > EnterRoom
EnterRoom > RoomExists
RoomExists > CreateRoom: No
RoomExists > JoinRoom: Yes
CreateRoom > LoadEditor
JoinRoom > LoadEditor
LoadEditor > UserAction
UserAction > TypeCode: Type
UserAction > ChangeLanguage: Change language
UserAction > RunCode: Run code
UserAction > ShareURL: Share URL
TypeCode > UserAction
ChangeLanguage > UserAction
RunCode > UserAction
ShareURL > UserAction
UserAction > NetworkDrop: Network event
NetworkDrop > Reconnect: Yes
Reconnect > UserAction
UserAction > UserLeave: Disconnect
UserLeave > DestroyRoom: Yes (last user)
UserLeave > Done: No (others still in room)
DestroyRoom > Done
```

---

## E. Frontend Component Tree (reference)

```
App
├── Routes
│   ├── / → LandingPage
│   │   ├── HeroSection (RoomInputForm)
│   │   └── FeaturesSection
│   │
│   └── /room/:roomId → EditorPage
│       │   (roomId null-checked → redirect to / if missing)
│       ├── EditorHeader
│       │   ├── RoomNameDisplay + CopyURLButton
│       │   ├── LanguageSelector
│       │   ├── UserAvatarList (active users with colour badges)
│       │   └── RunButton (Ctrl+Enter shortcut)
│       ├── EditorPanel
│       │   ├── MonacoEditor (bound to Y.Text via MonacoBinding / manual fallback)
│       │   └── CursorOverlay (Awareness cursor labels — auto-fade 3s inactivity)
│       └── OutputPanel
│           ├── OutputDisplay (run results — scroll to bottom on new output)
│           └── ClearOutputButton
│
├── ConnectionStatusBar (WebSocket connected/reconnecting/disconnected indicator)
└── ToastProvider (join/leave notifications — auto-dismiss 3s)
```
