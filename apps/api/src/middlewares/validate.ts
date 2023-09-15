import type { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";

export default function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req);

    return result.success
      ? next()
      : res.status(422).json({ errors: result.error.errors });
  };
}
