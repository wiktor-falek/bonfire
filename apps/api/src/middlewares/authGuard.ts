import type { NextFunction, Request, Response } from "express";
import { sessionStore } from "../instances.js";

async function authGuard(req: Request, res: Response, next: NextFunction) {
  const { sessionId } = req.cookies;

  if (typeof sessionId !== "string") {
    return res.status(401).json({ authenticated: false });
  }

  const session = await sessionStore.getSession(sessionId);

  if (session) {
    const { id } = session;
    res.locals.user = { id };
  }

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  return next();
}

export default authGuard;
