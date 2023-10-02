import { Ok, type Result, type ResultErr, type ResultOk } from "resultat";
import User from "../../../entities/user.js";
import UserModel from "../../../models/userModel.js";

class MockUserModel extends UserModel {
  createIndexes() {
    return Promise.resolve([]);
  }

  createUser(user: User) {
    return Promise.resolve(Ok(1));
  }

  findByEmail(email: string) {
    return Promise.resolve(
      new User({ username: "", displayName: "", email, hash: "" })
    );
  }

  findBySessionId(sessionId: string) {
    return Promise.resolve(
      new User({ username: "", displayName: "", email: "", hash: "" })
    );
  }

  findByUsername(username: string) {
    return Promise.resolve(
      new User({ username: "", displayName: "", email: "", hash: "" })
    );
  }

  emailExists(email: string) {
    return Promise.resolve(true);
  }

  sessionExists(sessionId: string) {
    return Promise.resolve(true);
  }

  updateSession(sessionId: string, email: string) {
    return Promise.resolve(Ok(1));
  }
}

export default MockUserModel;
