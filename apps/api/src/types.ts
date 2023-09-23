import type { ZodSchema, z } from "zod";
import type { Request } from "express";

export type RequestInfer<S extends ZodSchema<any>> = Request<
  z.infer<S>["params"],
  z.infer<S>["query"],
  z.infer<S>["body"]
>;

declare global {
  namespace Express {
    interface Locals {
      user: {
        id: string;
        username: string;
      };
    }
  }
}

export {};
