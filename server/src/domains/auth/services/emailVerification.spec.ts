import type { Db } from "mongodb";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { getInMemoryMongoDb } from "../../../tests/utils.js";
import { NoOpEmailService } from "../../emails/services/email.no-op.js";
import { UserModel, createUser, type IUserModel } from "../../users/index.js";
import { generateEmailVerificationToken } from "../helpers/emailVerification.js";
import { EmailVerificationService } from "./emailVerification.js";
import type { MongoMemoryServer } from "mongodb-memory-server";

describe("email verification", async () => {
  let mongoServer: MongoMemoryServer;
  let mongoDb: Db;
  let userModel: IUserModel;
  let emailVerificationService: EmailVerificationService;
  
  beforeEach(async () => {
    const [server, db] = await getInMemoryMongoDb();
    mongoServer = server;
    mongoDb = db;
    userModel = new UserModel(db);
    emailVerificationService = new EmailVerificationService(
      userModel,
      new NoOpEmailService()
    );
  });
  
  afterEach(async () => {
    await mongoDb.dropDatabase();
    await mongoServer.stop();
  });

  it("disallow confirming an email that is already in use", async () => {  
    const firstUser = createUser({
      email: "duplicate@email.com",
      username: "firstuser",
      displayName: "whatever",
      hash: "whatever",
    });

    const secondUser = createUser({
      email: "duplicate@email.com",
      username: "seconduser",
      displayName: "whatever",
      hash: "whatever",
    });

    (await userModel.createUser(firstUser)).unwrap();
    (await userModel.createUser(secondUser)).unwrap();
    
    const firstUserVerificationToken = generateEmailVerificationToken({
      email: "duplicate@email.com",
      username: "firstuser",
    });

    const secondUserVerificationToken = generateEmailVerificationToken({
      email: "duplicate@email.com",
      username: "seconduser",
    });

    (await emailVerificationService.verifyEmail(firstUserVerificationToken)).unwrap();

    const duplicateEmailVerificationResult = await emailVerificationService.verifyEmail(secondUserVerificationToken);
    expect(duplicateEmailVerificationResult.ok).toBe(false);
  });
});
