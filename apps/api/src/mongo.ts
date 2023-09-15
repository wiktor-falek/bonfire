import { MongoClient, ServerApiVersion } from "mongodb";

const URI = "mongodb://localhost:27017";

class Mongo {
  private static client?: MongoClient;

  static isInitialized() {
    return this.client !== undefined;
  }

  static getClient(): MongoClient {
    if (this.client === undefined) {
      this.client = new MongoClient(URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
    }
    return this.client;
  }

  static connect() {
    return this.getClient().connect();
  }

  static async close() {
    await this.client?.close();
    this.client = undefined;
  }
}

export default Mongo;
