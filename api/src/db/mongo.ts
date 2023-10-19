import { MongoClient, ServerApiVersion } from "mongodb";

class Mongo {
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  connect() {
    return this.client.connect();
  }

  async close() {
    return this.client.close();
  }
}

export default Mongo;
