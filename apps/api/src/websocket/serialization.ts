import { z } from "zod";

const websocketEventSchema = z.object({
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
  return JSON.stringify({ type: eventName, data });
}

export function deserialize(cb: (event: WebSocketEvent) => void) {
  return (data: Buffer) => {
    try {
      const event = websocketEventSchema.parse(JSON.parse(data.toString()));
      cb(event);
    } catch (_) {}
  };
}
