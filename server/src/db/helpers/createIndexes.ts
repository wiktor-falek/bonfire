import type { Db } from "mongodb";
import { Err, Ok } from "resultat";

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

    return Ok(results.flat());
  } catch (e) {
    return Err(e);
  }
}

export default createIndexes;
