import { roomStore } from "./roomStore.js";
import { logger } from "../utils/logger.js";

// Per-socket rate limiting for join-room
const joinAttempts = new Map(); // socketId → { count, resetAt }

// Evict expired rate-limit entries in bulk every 10 seconds to avoid GC pressure
setInterval(() => {
  const now = Date.now();
  for (const [socketId, entry] of joinAttempts.entries()) {
    if (now > entry.resetAt) {
      joinAttempts.delete(socketId);
    }
  }
}, 10_000).unref();

// Bidirectional mapping to convert string room IDs to fast 32-bit integers
const roomStringToInt = new Map();
let nextRoomIdInt = 1;

function getRoomInt(roomIdStr) {
  let id = roomStringToInt.get(roomIdStr);
  if (id === undefined) {
    id = nextRoomIdInt++;
    roomStringToInt.set(roomIdStr, id);
  }
  return id;
}

// Pre-allocate and serialize user array tuples into a fast binary Buffer payload
function serializeUsers(users) {
  let size = 2; // count (uint16)
  for (const u of users) {
    size += 3; // 3 length prefixes (uint8)
    size += Buffer.byteLength(u[0], "utf8");
    size += Buffer.byteLength(u[1], "utf8");
    size += Buffer.byteLength(u[2], "utf8");
  }

  const buf = Buffer.allocUnsafe(size);
  let offset = 0;
  buf.writeUInt16BE(users.length, offset);
  offset += 2;

  for (const u of users) {
    const idBuf = Buffer.from(u[0], "utf8");
    const nameBuf = Buffer.from(u[1], "utf8");
    const colourBuf = Buffer.from(u[2], "utf8");

    buf.writeUInt8(idBuf.length, offset);
    offset += 1;
    idBuf.copy(buf, offset);
    offset += idBuf.length;

    buf.writeUInt8(nameBuf.length, offset);
    offset += 1;
    nameBuf.copy(buf, offset);
    offset += nameBuf.length;

    buf.writeUInt8(colourBuf.length, offset);
    offset += 1;
    colourBuf.copy(buf, offset);
    offset += colourBuf.length;
  }
  return buf;
}

// Pre-allocate and serialize the entire room-state event into a single binary Buffer
function serializeRoomState(usersBuf, language, clientTimestamp) {
  const langBuf = Buffer.from(language, "utf8");
  const size = 8 + 1 + langBuf.length + usersBuf.length;

  const buf = Buffer.allocUnsafe(size);
  buf.writeDoubleBE(clientTimestamp, 0);
  buf.writeUInt8(langBuf.length, 8);
  langBuf.copy(buf, 9);
  usersBuf.copy(buf, 9 + langBuf.length);

  return buf;
}

export function registerRoomHandler(io, socket) {
  socket.on("join-room", ({ roomId, name, colour, clientTimestamp }) => {
    // 1. Process sync state updates immediately (O(1))
    const now = Date.now();
    const entry = joinAttempts.get(socket.id);
    if (!entry) {
      joinAttempts.set(socket.id, {
        count: 1,
        resetAt: now + 60_000,
      });
    } else {
      entry.count++;
      if (entry.count > 10) {
        socket.emit("error", {
          message: "Too many join attempts. Please wait 1 minute.",
        });
        return;
      }
    }

    // Fast Numeric Hashes for Room ID Lookups in memory
    const roomKey = getRoomInt(roomId);

    // Update roomStore
    if (!roomStore.has(roomKey)) {
      roomStore.set(roomKey, {
        roomId,
        users: new Map(),
        language: "javascript",
      });
    }
    const room = roomStore.get(roomKey);

    // Room size cap check (OPT-04)
    const MAX_ROOM_SIZE = 15;
    if (room.users.size >= MAX_ROOM_SIZE) {
      socket.emit("error", {
        code: "ROOM_FULL",
        message: `Room is full (max ${MAX_ROOM_SIZE} users).`,
      });
      return;
    }

    // Store on socket for disconnect handler
    socket.roomId = roomId;
    socket.userName = name;

    // Store user in Map immediately (OPT-08)
    room.users.set(socket.id, {
      id: socket.id,
      name,
      colour,
      joinedAt: Date.now(),
    });

    // 2. Immediate confirmation back to the connecting client
    const compactUsers = [...room.users.values()].map((u) => [
      u.id,
      u.name,
      u.colour,
    ]);
    const serializedUsers = serializeUsers(compactUsers);
    const roomStateBin = serializeRoomState(
      serializedUsers,
      room.language,
      clientTimestamp,
    );

    const emitRoomState = () => {
      socket.emit("room-state", roomStateBin);
    };

    if (
      socket.conn &&
      socket.conn.transport &&
      !socket.conn.transport.writable
    ) {
      setImmediate(emitRoomState);
    } else {
      emitRoomState();
    }

    // 3. Defer Socket.io adapter join and broadcast to microtask queue (queueMicrotask)
    queueMicrotask(() => {
      socket.join(roomId);
      // Broadcast compact array tuple via binary buffer serialization
      const joinedUserBin = serializeUsers([[socket.id, name, colour]]);
      socket.to(roomId).emit("user-joined", joinedUserBin);
      logger.info({ roomId, name, userCount: room.users.size }, "user joined");
    });
  });

  socket.on("language-change", ({ roomId, language }) => {
    const roomKey = getRoomInt(roomId);
    const room = roomStore.get(roomKey);
    if (room) room.language = language;
    socket.to(roomId).emit("language-changed", { language });
  });

  socket.on("run-code", ({ roomId, output, runBy, latency }) => {
    socket
      .to(roomId)
      .emit("code-output", { output, runBy, latency, timestamp: Date.now() });
  });

  socket.on("disconnect", () => {
    joinAttempts.delete(socket.id);

    const roomId = socket.roomId;
    if (!roomId) return;

    const roomKey = getRoomInt(roomId);
    const room = roomStore.get(roomKey);
    if (!room) return;

    room.users.delete(socket.id); // O(1) delete (OPT-08)

    if (room.users.size === 0) {
      roomStore.delete(roomKey); // prevent memory leak — last user gone
      roomStringToInt.delete(roomId);
      logger.info({ roomId }, "room destroyed — no users remain");
    } else {
      io.to(roomId).emit("user-left", { id: socket.id, name: socket.userName });
      logger.info(
        { roomId, name: socket.userName, userCount: room.users.size },
        "user left",
      );
    }
  });
}
