import { Ok } from "resultat";
import { createUser, type User } from "../../../entities/user.js";
import type { IUserModel } from "../../../interfaces/userModelInterface.js";

class MockUserModel implements IUserModel {
  createIndexes() {
    return Promise.resolve([]);
  }

  createUser(user: User) {
    return Promise.resolve(Ok());
  }

  findByEmail(email: string) {
    return Promise.resolve(
      createUser({ username: "", displayName: "", email, hash: "" })
    );
  }

  findByUsername(username: string) {
    return Promise.resolve(
      createUser({ username: "", displayName: "", email: "", hash: "" })
    );
  }

  emailExists(email: string) {
    return Promise.resolve(true);
  }
}

export default MockUserModel;
