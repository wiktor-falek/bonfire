import { Ok, type ResultOk } from "resultat";
import User from "../../../entities/user.js";
import UserModel from "../../../models/userModel.js";

// TODO: make an interface and have UserModel and MockUserModel implement them

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

  findByUsername(username: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve(new User({ username: "", displayName: "", email: "", hash: "" }))
    );
  }

  emailExists(email: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }
}

export default MockUserModel;
