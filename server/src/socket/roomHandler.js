import { roomStore } from "./roomStore.js";
import { logger } from "../utils/logger.js";

// Per-socket rate limiting for join-room
const joinAttempts = new Map(); // socketId → { count, resetAt }

export function registerRoomHandler(io, socket) {
  socket.on("join-room", ({ roomId, name, colour }) => {
    // Rate limit: max 10 join-room per socket per minute
    const now = Date.now();
    const entry = joinAttempts.get(socket.id) || {
      count: 0,
      resetAt: now + 60_000,
    };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + 60_000;
    }
    entry.count++;
    joinAttempts.set(socket.id, entry);
    if (entry.count > 10) {
      socket.emit("error", {
        message: "Too many join attempts. Please wait 1 minute.",
      });
      return;
    }

    // Update roomStore
    if (!roomStore.has(roomId)) {
      roomStore.set(roomId, {
        roomId,
        users: new Map(),
        language: "javascript",
      });
    }
    const room = roomStore.get(roomId);

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

    socket.join(roomId);

    // Store user in Map (OPT-08)
    room.users.set(socket.id, {
      id: socket.id,
      name,
      colour,
      joinedAt: Date.now(),
    });

    socket.to(roomId).emit("user-joined", { id: socket.id, name, colour });
    // Convert Map values to array for client transmission
    const userList = Array.from(room.users.values());
    socket.emit("room-state", { users: userList, language: room.language });

    logger.info({ roomId, name, userCount: room.users.size }, "user joined");
  });

  socket.on("language-change", ({ roomId, language }) => {
    const room = roomStore.get(roomId);
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

    const room = roomStore.get(roomId);
    if (!room) return;

    room.users.delete(socket.id); // O(1) delete (OPT-08)

    if (room.users.size === 0) {
      roomStore.delete(roomId); // prevent memory leak — last user gone
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
