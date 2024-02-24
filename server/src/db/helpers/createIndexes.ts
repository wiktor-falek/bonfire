import type { Db } from "mongodb";

async function createIndexes(mongoDb: Db) {
  try {
    await Promise.all([
      mongoDb.collection("users").dropIndexes(),
      mongoDb.collection("channels").dropIndexes(),
    ]);

    const results = await Promise.all([
      mongoDb.collection("users").createIndexes([
        {
          key: { id: 1 },
          unique: true,
        },
        {
          key: { "account.username": 1 },
          unique: true,
        },
        {
          key: { "account.email": 1 },
          unique: true,
        },
      ]),
      mongoDb.collection("channels").createIndexes([
        {
          key: { id: 1 },
          unique: true,
        },
        {
          key: { "messages.timestamp": 1 },
        },
        {
          key: { participants: 1 },
        },
      ]),
    ]);

    return Promise.resolve(results.flat());
  } catch (error) {
    return Promise.reject(error);
  }
}

export default createIndexes;
