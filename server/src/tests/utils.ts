import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongo } from "../db/mongo.js";
import createIndexes from "../db/helpers/createIndexes.js";

export async function getInMemoryMongoDb() {
  const server = await MongoMemoryServer.create();
  const uri = server.getUri();
  const mongoClient = await new Mongo(uri).connectOrThrow();
  const mongoDb = mongoClient.db("bonfire");
  await createIndexes(mongoDb);
  return mongoDb;
}
