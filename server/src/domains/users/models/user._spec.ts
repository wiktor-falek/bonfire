import { assert, describe, expect, it } from "vitest";
import { getInMemoryMongoDb } from "../../../tests/utils.js";
import { UserModel, createUser } from "../index.js";

describe("user operations", async () => {
  const inMemoryDb = await getInMemoryMongoDb();
  const userModel = new UserModel(inMemoryDb);

  it("creates a user", async () => {
    const user = createUser({
      username: "username",
      displayName: "displayName",
      email: "test@email.com",
      hash: "whatever",
    });

    const result = await userModel.createUser(user);
    expect(result.ok).toBe(true);
  });

  it("prevents duplicate credentials", async () => {
    const duplicateUsernameUser = createUser({
      username: "username",
      displayName: "whatever",
      email: "whatever@email.com",
      hash: "whatever",
    });

    const duplicateUnverifiedEmailUser = createUser({
      username: "whatever",
      displayName: "whatever",
      email: "test@email.com",
      hash: "whatever",
    });

    const createDuplicateUsernameResult = await userModel.createUser(
      duplicateUsernameUser
    );
    const createDuplicateEmailResult = await userModel.createUser(
      duplicateUnverifiedEmailUser
    );

    expect(createDuplicateUsernameResult.ok).toBe(false);
    expect(createDuplicateEmailResult.ok).toBe(true);
  });

  it("finds the existing user", async () => {
    const userByUsername = (
      await userModel.findByUsername("username")
    ).unwrap();
    assert(userByUsername !== null);

    const userByEmail = (
      await userModel.findByEmail("test@email.com")
    ).unwrap();
    assert(userByEmail !== null);

    const userById = (await userModel.findById(userByUsername.id)).unwrap();
    assert(userById !== null);
  });
});
