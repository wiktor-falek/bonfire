import { createClient, type RedisClientType } from "redis";

class Redis {
  private client: RedisClientType;

  constructor(url: string) {
    this.client = createClient({ url });
  }

  connectOrThrow() {
    return this.client.connect();
  }
}

export default Redis;
