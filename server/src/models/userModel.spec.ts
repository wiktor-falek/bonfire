import { describe, it, expect, assert } from "vitest";
import UserModel from "./userModel.js";
import { getInMemoryMongoDb } from "../tests/utils.js";
import { createUser } from "../entities/user.js";

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

    const duplicateEmailUser = createUser({
      username: "whatever",
      displayName: "whatever",
      email: "test@email.com",
      hash: "whatever",
    });

    const duplicateUsernameResult = await userModel.createUser(
      duplicateUsernameUser
    );
    const duplicateEmailResult = await userModel.createUser(duplicateEmailUser);

    expect(duplicateUsernameResult.ok).toBe(false);
    expect(duplicateEmailResult.ok).toBe(false);
  });

  it("finds the existing user", async () => {
    const userByUsername = (await userModel.findByUsername("username")).unwrap();
    assert(userByUsername !== null);

    const userByEmail = (await userModel.findByEmail("test@email.com")).unwrap();
    assert(userByEmail !== null);

    const userById = (await userModel.findById(userByUsername.id)).unwrap();
    assert(userById !== null);
  });
});
