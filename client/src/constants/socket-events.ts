export const SOCKET_EVENTS = {
  // CLIENT -> SERVER
  JOIN_ROOM: 'join-room',
  LANGUAGE_CHANGE: 'language-change',
  RUN_CODE: 'run-code',

  // SERVER -> CLIENT
  ROOM_STATE: 'room-state',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  LANGUAGE_CHANGED: 'language-changed',
  CODE_OUTPUT: 'code-output',
  ERROR: 'error',
} as const
