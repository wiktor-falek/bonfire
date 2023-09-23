import type { NextFunction, Request, Response } from "express";

function authGuard(req: Request, res: Response, next: NextFunction) {
  const { sessionId } = req.cookies;
  // AuthService.isAuthorized()
}

export default authGuard;
