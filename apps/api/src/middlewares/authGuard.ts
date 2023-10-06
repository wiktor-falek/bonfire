import type { NextFunction, Request, Response } from "express";
import { sessionStore } from "../instances.js";

async function authGuard(req: Request, res: Response, next: NextFunction) {
  const { sessionId } = req.cookies;
  console.log({ sessionId });

  if (typeof sessionId !== "string") {
    return res.status(401).json({ authenticated: false });
  }

  const result = await sessionStore.getSession(sessionId);

  if (!result.ok) {
    console.log(result.err);
    return res.status(401).json({ authenticated: false });
  }

  const { userId } = result.val;
  res.locals.user = { id: userId };

  return next();
}

export default authGuard;
