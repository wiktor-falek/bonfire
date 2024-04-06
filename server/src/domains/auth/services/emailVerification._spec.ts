import type { Db } from "mongodb";
import { beforeEach, describe, expect, it } from "vitest";
import { getInMemoryMongoDb } from "../../../tests/utils.js";
import { NoOpEmailService } from "../../emails/services/email.no-op.js";
import { UserModel, createUser, type IUserModel } from "../../users/index.js";
import { generateEmailVerificationToken } from "../helpers/emailVerification.js";
import { EmailVerificationService } from "./emailVerification.js";

let inMemoryDb: Db;
let userModel: IUserModel;
let emailVerificationService: EmailVerificationService;

beforeEach(async () => {
  inMemoryDb = await getInMemoryMongoDb();
  userModel = new UserModel(inMemoryDb);
  emailVerificationService = new EmailVerificationService(
    userModel,
    new NoOpEmailService()
  );
});

describe("email verification", async () => {
  it("prevents registering with an email that already is verified", async () => {
    const firstUser = createUser({
      email: "taken@email.com",
      username: "firstUser",
      displayName: "whatever",
      hash: "whatever",
    });

    const secondUser = createUser({
      email: "taken@email.com",
      username: "secondUser",
      displayName: "whatever",
      hash: "whatever",
    });

    (await userModel.createUser(firstUser)).unwrap();

    const token = generateEmailVerificationToken({
      email: "taken@gmail.com",
      username: "firstUser",
    });

    (await emailVerificationService.verifyEmail(token)).unwrap();

    const createUserWithTakenEmailResult = await userModel.createUser(
      secondUser
    );

    expect(createUserWithTakenEmailResult.ok).toBe(false);
  });
});
