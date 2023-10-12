import type { RedisClientType } from "redis";
import { Err, Ok } from "resultat";

type SessionData = { userId: string };

class SessionStore {
  constructor(private client: RedisClientType) {}

  /**
   * Creates a user session using the provided data.
   */
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

  /**
   * Retrieves the user session data associated with the session ID.
   */
  async getSession(sessionId: string) {
    try {
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

  async deleteAllExpiredSessions() {
    return Err("Not Implemented");
  }
}

export default SessionStore;
