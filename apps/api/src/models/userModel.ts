import bcrypt from "bcrypt";
import Mongo from "../mongo.js";
import { v4 as uuidv4 } from "uuid";
import { Ok, Err } from "resultat";
import { z } from "zod";
import { email, username, displayName } from "../validators/userValidators.js";

const userSchema = z.object({
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

class User {
  private static db = Mongo.getClient().db("bonfire");
  private static collection = this.db.collection("users");

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
      account: {
        email,
        username,
        displayName,
        hash,
      },
    });

    if (!validation.success) {
      console.error("Registration validation failed, this should not happen");
      return Err("Something went wrong");
    }

    const user = validation.data;

    const result = await this.collection.insertOne(user);
    if (!result.acknowledged) {
      return Err("Database write failed");
    }

    return Ok(1);
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

    if (result.modifiedCount !== 1) {
      return Err("Database write failed");
    }
    return Ok({ sessionId });
  }

  // static async verify(token: string) {
  //   const payload = decode(token);

  //   if (payload === null) {
  //     return Err("Invalid token");
  //   }

  //   const { username, email, iat, exp } = payload;

  //   const userWithEmailTaken = await this.collection.findOne(
  //     {
  //       "account.email": email,
  //       "account.hasConfirmedEmail": true,
  //     },
  //     { projection: { "account.username": 1, _id: 0 } }
  //   );

  //   if (userWithEmailTaken?.account.username === username) {
  //     return Err("Your email is already verified");
  //   }

  //   if (userWithEmailTaken !== null) {
  //     return Err("Something went wrong");
  //   }

  //   const result = await this.collection.updateOne(
  //     {
  //       "account.username": username,
  //       "account.email": email,
  //       "account.hasConfirmedEmail": false,
  //     },
  //     { $set: { "account.hasConfirmedEmail": true } }
  //   );

  //   if (result.modifiedCount === 0) {
  //     return Err("Something went wrong");
  //   }

  //   return Ok({ username, verified: true });
  // }

  // static async recoverPassword(email: string) {
  //   const user = await this.findByEmail(email);

  //   if (user === null) {
  //     return;
  //   }

  //   const username = user.account.username;

  //   const token = encode({ username: username, email: email });

  //   const url = `http://localhost:5173/recovery/?token=${token}`;

  //   if (process.env.NODE_ENV === "production") {
  //     sendEmail(
  //       email,
  //       "Account Recovery",
  //       `Hi ${username}\nClick the link below to change your password.\n${url}\nIf you did not try to recover you account simply ignore this email.`,
  //       `<h1>Hi ${username}</h1>\n<h2>Click the link below to change your password.</h2>\n<a href="${url}">Reset Password</a>\nIf you did not try to recover you account simply ignore this email.`
  //     );
  //   } else {
  //     console.log(`Account recovery link:\n${url}`);
  //   }
  // }

  //   static async changePassword(token: string, password: string) {
  //     const payload = decode(token);
  //     if (payload === null) {
  //       return Err("Invalid token");
  //     }
  //     const { username, email } = payload;

  //     const saltRounds = 10;
  //     const salt = await bcrypt.genSalt(saltRounds);
  //     const hash = await bcrypt.hash(password, salt);

  //     const result = await this.collection.updateOne(
  //       {
  //         "account.username": username,
  //       },
  //       { $set: { "account.hash": hash } }
  //     );

  //     if (result.modifiedCount === 0) {
  //       return Err("Failed to change the password");
  //     }

  //     return Ok(1);
  //   }
  // }

  // Indexes
  // await User.collection.createIndexes([
  //   {
  //     key: {
  //       "account.sessionId": 1,
  //     },
  //   },
  //   {
  //     key: {
  //       "account.username": 1,
  //     },
  //   },
  // ]);
}

export default User;
