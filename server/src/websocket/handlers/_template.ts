import { z } from "zod";
import type WsClient from "../wsClient.js";
import type { ServerToClientEvents } from "../types.js";
import type { Handlers } from "./types.js";

const exampleSchema = z.strictObject({
  foo: z.string(),
});

async function exampleHandler(
  client: WsClient<ServerToClientEvents>,
  data: z.infer<typeof exampleSchema>,
  userId: string
) {
  const { foo } = data;
}

const handlers = {
  directMessage: {
    cb: exampleHandler,
    schema: exampleSchema,
  },
} satisfies Handlers;

export default handlers;
