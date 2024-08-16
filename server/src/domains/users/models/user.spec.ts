import { assert, describe, expect, it, beforeEach, afterEach } from "vitest";
import { getInMemoryMongoDb } from "../../../tests/utils.js";
import { UserModel, createUser } from "../index.js";
import type { MongoMemoryServer } from "mongodb-memory-server";

describe("user operations", async () => {
  let mongoServer: MongoMemoryServer;
  let userModel: UserModel;

  beforeEach(async () => {
    const [server, db] = await getInMemoryMongoDb();
    mongoServer = server;
    userModel = new UserModel(db);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

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

  it("allows registering with duplicate but unverified email", async () => {
    const firstUser = createUser({
      username: "firstUser",
      displayName: "displayName",
      email: "test@email.com",
      hash: "whatever",
    });

    const secondUser = createUser({
      username: "secondUser",
      displayName: "displayName",
      email: "test@email.com",
      hash: "whatever",
    });

    const firstResult = await userModel.createUser(firstUser);
    expect(firstResult.ok).toBe(true);

    const secondResult = await userModel.createUser(secondUser);
    expect(secondResult.ok).toBe(true);
  });

  it("disallows registering with email that is already verified", async () => {
    const firstUser = createUser({
      username: "firstuser",
      displayName: "first",
      email: "duplicate@email.com",
      hash: "whatever",
    });

    const secondUser = createUser({
      username: "seconduser",
      displayName: "second",
      email: "duplicate@email.com",
      hash: "whatever",
    });

    (await userModel.createUser(firstUser)).unwrap();

    (
      await userModel.verifyEmail(
        firstUser.account.username,
        firstUser.account.email
      )
    ).unwrap();

    const createDuplicateUserResult = await userModel.createUser(secondUser);

    expect(createDuplicateUserResult.ok).toBe(false);
  });

  it("disallows registering with duplicate username", async () => {
    const firstUser = createUser({
      username: "duplicate",
      displayName: "first",
      email: "first@email.com",
      hash: "whatever",
    });

    const secondUser = createUser({
      username: "duplicate",
      displayName: "second",
      email: "second@email.com",
      hash: "whatever",
    });

    const firstResult = await userModel.createUser(firstUser);
    expect(firstResult.ok).toBe(true);

    const secondResult = await userModel.createUser(secondUser);
    expect(secondResult.ok).toBe(false); // already in use
  });

  it("finds the existing user", async () => {
    const user = createUser({
      email: "user@email.com",
      username: "username",
      displayName: "whatever",
      hash: "whatever",
    });

    (await userModel.createUser(user)).unwrap();

    const userByUsername = (
      await userModel.findByUsername(user.account.username)
    ).unwrap();

    assert(userByUsername !== null);

    const userByEmail = (
      await userModel.findByEmail(user.account.email)
    ).unwrap();

    assert(userByEmail !== null);

    const userById = (await userModel.findById(userByUsername.id)).unwrap();

    assert(userById !== null);
  });
});
