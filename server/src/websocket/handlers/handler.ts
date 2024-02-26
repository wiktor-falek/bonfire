import type { AnyZodObject, z } from "zod";
import type WsClient from "../wsClient.js";
import type { ServerToClientEvents } from "../types.js";

export type Handler = {
  cb: (
    client: WsClient<ServerToClientEvents>,
    data: any,
    userId: string
  ) => any;
  schema: AnyZodObject;
};

export type Handlers = {
  [key: string]: Handler;
};

export function createHandler(
  cb: (
    client: WsClient<ServerToClientEvents>,
    data: any,
    userId: string
  ) => any,
  schema: AnyZodObject
) {
  return {
    cb,
    schema,
  };
}
