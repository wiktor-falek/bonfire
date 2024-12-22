import { Ok, type Result } from "resultat";
import {
  createUser,
  type IUserModel,
  type SelectableUserStatus,
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

  emailIsVerified(email: string) {
    return Promise.resolve(Ok(true));
  }

  usernameExists(username: string): Promise<Result<boolean, string>> {
    return Promise.resolve(Ok(true));
  }

  verifyEmail(username: string, email: string) {
    return Promise.resolve(Ok());
  }

  changeEmail(username: string, email: string) {
    return Promise.resolve(Ok());
  }

  setDisplayName(userId: string, displayName: string) {
    return Promise.resolve(Ok());
  }

  getStatus(userId: string): Promise<Result<UserStatus, string>> {
    return Promise.resolve(Ok("online"));
  }

  updateStatus(userId: string, status: SelectableUserStatus) {
    return Promise.resolve(Ok());
  }

  setIsOnline(userId: string, isOnline: boolean) {
    return Promise.resolve(Ok());
  }
}

export default MockUserModel;
