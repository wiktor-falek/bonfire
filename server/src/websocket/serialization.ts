import type { RawData } from "ws";
import { z } from "zod";

const websocketEventSchema = z.strictObject({
  type: z.string().min(1).max(128),
  data: z.any(),
});

export type WebSocketEvent = z.infer<typeof websocketEventSchema>;

export type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | JSONSerializable[]
  | { [key: string]: JSONSerializable };

export function serialize(eventName: string, data: JSONSerializable) {
  const event: WebSocketEvent = { type: eventName, data };
  return JSON.stringify(event);
}

export function deserialize(data: RawData): WebSocketEvent | null {
  try {
    const event = websocketEventSchema.parse(JSON.parse(data.toString()));
    return event;
  } catch (_) {
    return null;
  }
}
