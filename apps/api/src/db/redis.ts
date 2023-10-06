import { createClient, type RedisClientType } from "redis";

class Redis {
  private client: RedisClientType;
  
  constructor() {
    this.client = createClient();
  }

  async connect() {
    return await this.client.connect().catch((err) => {
      throw err;
    });
  }
}

export default Redis;
