import { expect, it, test } from "vitest";
import UserModel from "./userModel.js";
import { getInMemoryMongoDb } from "src/tests/utils.js";

test("it works", () => {
  it("ballin", async () => {
    const inMemoryDb = await getInMemoryMongoDb();
    const userModel = new UserModel(inMemoryDb);
  });
});
