import type { NextFunction, Request, Response } from "express";
import { decryptSessionToken } from "../helpers/sessionToken.js";
import { authService } from "../instances.js";

async function authGuard(req: Request, res: Response, next: NextFunction) {
  const { sessionId, sessionToken } = req.cookies;

  if (typeof sessionId !== "string" || typeof sessionToken !== "string") {
    return res.status(401).json({ authenticated: false });
  }

  const sessionIsValid = await authService.isSessionValid(sessionId);

  const session = decryptSessionToken(sessionToken).unwrapOrElse((err) => {
    console.error(err);
    return null;
  });

  if (session) {
    const { id, username } = session;
    res.locals.user = { id, username };
  }

  const isAuthenticated = sessionIsValid && session;

  if (!isAuthenticated) {
    return res.status(401).json({ authenticated: false });
  }

  return next();
}

export default authGuard;
