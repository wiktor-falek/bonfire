import { MongoClient, ServerApiVersion } from "mongodb";

export class Mongo {
  private client: MongoClient;

  constructor(url: string) {
    this.client = new MongoClient(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  connectOrThrow() {
    return this.client.connect();
  }

  close() {
    return this.client.close();
  }
}
