import type { ZodSchema, z } from "zod";
import type { Request } from "express";

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
