import type { Session } from "../interfaces/session.js";

export function createSession(userId: string): Session {
  return { userId };
}
