import type { RedisClientType } from "redis";

class SessionStore {
  constructor(private redisClient: RedisClientType) {}

  createSession(fields: { userId: string }) {}

  getSession(sessionId: string): Promise<{ id: string }> {
    return new Promise((resolve) => {
      resolve({ id: "TODO" });
    });
  }

  findAllSessions(userId: string) {}

  deleteSession(sessionId: string) {}

  deleteAllUserSessions(userId: string) {}
}

export default SessionStore;
