import { MongoMemoryServer } from "mongodb-memory-server";
import Mongo from "src/db/mongo.js";

export async function getInMemoryMongoDb() {
  const server = await MongoMemoryServer.create();
  const uri = server.getUri();
  const mongoClient = await new Mongo(uri).connect();
  return mongoClient.db("bonfire");
}
