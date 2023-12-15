import { Ok } from "resultat";
import { createUser, type User } from "../../../entities/user.js";
import type { IUserModel } from "../../../interfaces/userModelInterface.js";

class MockUserModel implements IUserModel {
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
        createUser({ username: "", displayName: "", email: "", hash: "" })
      ])
    )
  }

  emailExists(email: string) {
    return Promise.resolve(Ok(true));
  }

  createUser(user: User) {
    return Promise.resolve(Ok());
  }
}

export default MockUserModel;
