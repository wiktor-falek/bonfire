import type { RedisClientType } from "redis";
import { Err, Ok } from "resultat";
import { v4 as uuidv4 } from "uuid";

type SessionData = { userId: string };

class SessionStore {
  constructor(private client: RedisClientType) {}

  async createSession(sessionId: string, data: SessionData) {
    // const sessionCount = await this.getAllUserSessionsCount(data.userId);
    // if (sessionCount >= 5) {
    //   return Err("User has reached the maximum session limit.");
    // }

    try {
      await this.client.hSet("userSessions", sessionId, JSON.stringify(data));
      return Ok(sessionId);
    } catch (error) {
      return Err("Failed to create a session");
    }
  }

  async getSession(sessionId: string) {
    try {
      // Retrieve the user ID associated with the session ID from Redis
      const data = await this.client.hGet("userSessions", sessionId);
      if (!data) {
        return Err("Session not found or has expired");
      }

      const sessionData = JSON.parse(data) as SessionData;
      return Ok(sessionData);
    } catch (error) {
      return Err("Failed to retrieve session");
    }
  }
}

export default SessionStore;
