import { Ok } from "resultat";
import User from "../../../entities/user.js";
import UserModel from "../../../models/userModel.js";

// TODO: make an interface and have UserModel and MockUserModel implement them

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

  findByUsername(username: string) {
    return Promise.resolve(
      new User({ username: "", displayName: "", email: "", hash: "" })
    );
  }

  emailExists(email: string) {
    return Promise.resolve(true);
  }
}

export default MockUserModel;
