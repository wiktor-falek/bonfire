import type { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";

export default function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req);
    
    if (!validation.success) {
      return res.status(422).json({ error: validation.error.issues });
    }

    return next();
  };
}
