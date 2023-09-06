import { MongoClient, ServerApiVersion } from "../node_modules/mongodb/mongodb";

const URI = "mongodb://localhost:27017";

class Mongo {
  private static client: MongoClient;

  static isInitialized() {
    return this.client !== undefined;
  }

  static getClient(): MongoClient {
    if (!this.isInitialized()) {
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

  static async connect() {
    try {
      const client = await this.getClient().connect();
      console.log(`Connected to ${process.env.NODE_ENV ?? "development"} db`);
      return client;
    } catch (err) {
      console.log("Failed to connect to db");
      throw err;
    }
  }
}

export default Mongo;
