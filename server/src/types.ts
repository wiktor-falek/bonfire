import type { Request } from "express";
import type { z } from "zod";

export type ValidatedRequest<T> = T extends z.Schema<infer Schema>
  ? {
      [K in keyof Request]: K extends "body"
        ? Schema extends { body: infer Body }
          ? Body
          : unknown
        : K extends "params"
        ? Schema extends { params: infer Params }
          ? Params
          : unknown
        : K extends "query"
        ? Schema extends { query: infer Query }
          ? Query
          : unknown
        : Request[K];
    }
  : Request;

declare global {
  namespace Express {
    interface Locals {
      user: {
        id: string;
      };
    }
  }
}

export {};
