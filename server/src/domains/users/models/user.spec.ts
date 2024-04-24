import test from "ava";

import { getInMemoryMongoDb } from "../../../tests/utils.js";
import { UserModel, createUser } from "../index.js";

const inMemoryDb = await getInMemoryMongoDb();
const userModel = new UserModel(inMemoryDb);

test("creating a user", async (t) => {
  const user = createUser({
    username: "username",
    displayName: "displayName",
    email: "test@email.com",
    hash: "whatever",
  });

  const result = await userModel.createUser(user);
  t.true(result.ok);
});

test("prevent duplicate username or email", async (t) => {
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

  t.false(createDuplicateUsernameResult.ok);
  t.true(createDuplicateEmailResult.ok);
});

test("retrieving existing user", async (t) => {
  const userByUsername = (await userModel.findByUsername("username")).unwrap()!;
  t.assert(userByUsername !== null);

  const userByEmail = (await userModel.findByEmail("test@email.com")).unwrap();
  t.assert(userByEmail !== null);

  const userById = (await userModel.findById(userByUsername.id)).unwrap();
  t.assert(userById !== null);
});
