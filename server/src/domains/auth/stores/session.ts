import type { RedisClientType } from "redis";
import { Err, Ok } from "resultat";
import type { Session } from "../interfaces/session.js";

export class SessionStore {
  keyspace: string;
  constructor(private client: RedisClientType) {
    this.keyspace = "userSessions";
  }

  /**
   * Creates a user session using the provided data.
   */
  async addSession(sessionId: string, data: Session) {
    try {
      await this.client.hSet(this.keyspace, sessionId, JSON.stringify(data));
      return Ok(sessionId);
    } catch (_) {
      return Err("Failed to create a session");
    }
  }

  /**
   * Retrieves the user session associated with the sessionId.
   */
  async getSession(sessionId?: string) {
    if (sessionId === undefined) {
      return Err("Session does not exist");
    }
    try {
      const data = await this.client.hGet(this.keyspace, sessionId);
      if (!data) {
        return Err("Session not found or has expired");
      }

      const sessionData = JSON.parse(data) as Session;
      return Ok(sessionData);
    } catch (_) {
      return Err("Failed to retrieve session");
    }
  }

  async deleteAllExpiredSessions() {
    return Err("Not Implemented");
  }
}
