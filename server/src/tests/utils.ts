import { MongoMemoryServer } from "mongodb-memory-server";
import Mongo from "../db/mongo.js";
import createIndexes from "../helpers/createIndexes.js";

export async function getInMemoryMongoDb() {
  const server = await MongoMemoryServer.create();
  const uri = server.getUri();
  const mongoClient = await new Mongo(uri).connect();
  const mongoDb = mongoClient.db("bonfire");
  await createIndexes(mongoDb);
  return mongoDb;
}
