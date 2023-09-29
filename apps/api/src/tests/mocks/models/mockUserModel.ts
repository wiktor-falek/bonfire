import { Ok, type Result, type ResultErr, type ResultOk } from "resultat";
import User from "../../../entities/user.js";
import UserModel from "../../../models/userModel.js";

class MockUserModel extends UserModel {
  createIndexes(): Promise<string[]> {
    return new Promise((resolve) => resolve([]));
  }

  createUser(user: User): Promise<ResultOk<number>> {
    return new Promise((resolve) => resolve(Ok(1)));
  }

  findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve(new User({ username: "", displayName: "", email, hash: "" }))
    );
  }
  findBySessionId(sessionId: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve(new User({ username: "", displayName: "", email: "", hash: "" }))
    );
  }

  findByUsername(username: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve(new User({ username: "", displayName: "", email: "", hash: "" }))
    );
  }

  emailExists(email: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }

  sessionExists(sessionId: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }

  updateSession(
    sessionId: string,
    email: string
  ): Promise<Result<number, string>> {
    return new Promise((resolve) => resolve(Ok(1)));
  }
}

export default MockUserModel;
