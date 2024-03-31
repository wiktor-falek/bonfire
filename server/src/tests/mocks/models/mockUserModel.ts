import { Ok } from "resultat";
import type { IUserModel } from "../../../domains/users/models/user.interface.js";
import {
  createUser,
  type User,
  type UserStatus,
} from "../../../domains/users/index.js";

class MockUserModel implements IUserModel {
  createUser(user: User) {
    return Promise.resolve(Ok());
  }

  findByUsername(username: string) {
    return Promise.resolve(
      Ok(createUser({ username: "", displayName: "", email: "", hash: "" }))
    );
  }

  findByEmail(email: string) {
    return Promise.resolve(
      Ok(createUser({ username: "", displayName: "", email, hash: "" }))
    );
  }

  findById(id: string) {
    return Promise.resolve(
      Ok(createUser({ username: "", displayName: "", email: "", hash: "" }))
    );
  }

  findAllByIds(ids: string[]) {
    return Promise.resolve(
      Ok([
        createUser({ username: "", displayName: "", email: "", hash: "" }),
        createUser({ username: "", displayName: "", email: "", hash: "" }),
      ])
    );
  }

  emailExists(email: string) {
    return Promise.resolve(Ok(true));
  }

  updateStatus(userId: string, status: UserStatus) {
    return Promise.resolve(Ok());
  }
}

export default MockUserModel;
