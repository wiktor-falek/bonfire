import bcrypt from "bcrypt";
import Mongo from "../mongo.js";
import { v4 as uuidv4 } from "uuid";
import { Ok, Err } from "resultat";
import { z } from "zod";
import { email, username, displayName } from "../validators/userValidators.js";
import { generateNumericId } from "../utils/id.js";

const userSchema = z.object({
  id: z.string().length(18),
  account: z.object({
    email,
    username,
    displayName,
    registrationTimestamp: z.number().int().default(Date.now()),
    sessionId: z.string().optional(),
    hash: z.string(),
  }),
});

export type UserType = z.infer<typeof userSchema>;

class UserModel {
  private static db = Mongo.getClient().db("bonfire");
  private static collection = this.db.collection("users");

  static createIndexes() {
    return this.collection.createIndexes([
      {
        key: { id: 1 },
        unique: true,
      },
    ]);
  }

  static async findByUsername(username: string) {
    const user = await this.collection.findOne<UserType>({
      "account.username": username,
    });

    return user;
  }

  static async findByEmail(email: string) {
    const user = await this.collection.findOne<UserType>({
      "account.email": email,
    });

    return user;
  }

  static async emailIsInUse(email: string) {
    const count = await this.collection.countDocuments(
      {
        "account.email": email,
      },
      { limit: 1 }
    );

    return Boolean(count);
  }

  static async register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    const emailIsInUse = await this.emailIsInUse(email);
    if (emailIsInUse) {
      return Err("Email is already in use");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const validation = userSchema.safeParse({
      id: generateNumericId(18),
      account: {
        email,
        username,
        displayName,
        hash,
      },
    });

    if (!validation.success) {
      console.error(
        "User validation failed during registration, this should not happen"
      );
      return Err(validation.error.issues)
    }

    const user = validation.data;

    const result = await this.collection.insertOne(user);

    return !result.acknowledged
      ? Err("Failed to create a user account")
      : Ok(1);
  }

  static async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (user === null) {
      return Err("Incorrect username or password");
    }

    const isAuthenticated = await bcrypt.compare(password, user.account.hash);
    if (!isAuthenticated) {
      return Err("Incorrect username or password");
    }

    const sessionId = uuidv4();

    const result = await this.collection.updateOne(
      { "account.email": email },
      { $set: { "account.sessionId": sessionId } }
    );

    return result.acknowledged
      ? Err("Something went wrong")
      : Ok({ sessionId, user });
  }
}

UserModel.createIndexes();

export default UserModel;
