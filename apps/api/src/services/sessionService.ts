import type UserModel from "../models/userModel.js";

class SessionService {
  constructor(private userModel: UserModel) {}

  /**
   * Clears session of the user that matches sessionId.
   */
  async clearSession(userId: string, sessionId: string) {}

  /**
   * Clears all sessions of the user.
   */
  async clearAllSessions(userId: string) {}

  /**
   * Clears all expired sessions of all users. Meant to run in a cron job.
   */
  async clearExpiredSessions() {
    const now = Date.now();
  }
}

export default SessionService;
