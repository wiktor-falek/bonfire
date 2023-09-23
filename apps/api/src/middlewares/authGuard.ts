import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService.js";
import { decryptSessionToken } from "../helpers/sessionToken.js";

function authGuard(req: Request, res: Response, next: NextFunction) {
  const { sessionId, sessionToken } = req.cookies;

  if (typeof sessionId !== "string" || typeof sessionToken !== "string") {
    return res.status(401).json({ authenticated: false });
  }

  const isAuthenticated = AuthService.isSessionValid(sessionId);

  const session = decryptSessionToken(sessionToken);

  if (session.ok) {
    const { id, username } = session.val;
    res.locals.user = { id, username };
  }

  return !isAuthenticated
    ? res.status(401).json({ authenticated: false })
    : next();
}

export default authGuard;
