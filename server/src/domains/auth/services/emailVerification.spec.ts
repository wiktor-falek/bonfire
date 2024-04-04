import { beforeEach, describe, it, expect } from "vitest";
import { EmailVerificationService } from "./emailVerification.js";
import { NoOpEmailService } from "../../emails/services/email.no-op.js";
import { UserModel, createUser } from "../../users/index.js";
import { getInMemoryMongoDb } from "../../../tests/utils.js";
import type { Db } from "mongodb";
import type { IUserModel } from "../../users/models/user.interface.js";
import { generateEmailVerificationToken } from "../helpers/emailVerification.js";

// Why is this shit breaking? Class is not a constructor my ass why the fuck is it undefined

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
