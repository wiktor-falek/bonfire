import type { Result } from "resultat";
import type { SelectableUserStatus, User, UserStatus } from "../interfaces/user.js";

export type IUserModel = {
  createUser(user: User): Promise<Result<unknown, string>>;
  findByUsername(username: string): Promise<Result<User | null, string>>;
  findByEmail(email: string): Promise<Result<User | null, string>>;
  findById(id: string): Promise<Result<User | null, string>>;
  findAllByIds(ids: string[]): Promise<Result<User[], string>>;
  emailIsVerified(email: string): Promise<Result<boolean, string>>;
  usernameExists(username: string): Promise<Result<boolean, string>>;
  verifyEmail(username: string, email: string): Promise<Result<unknown, string>>;
  changeEmail(username: string, email: string): Promise<Result<unknown, string>>;
  setDisplayName(userId: string, displayName: string): Promise<Result<unknown, string>>;
  getStatus(userId: string): Promise<Result<UserStatus, string>>
  updateStatus(userId: string, status: SelectableUserStatus): Promise<Result<unknown, string>>;
  setIsOnline(userId: string, isOnline: boolean): Promise<Result<unknown, string>>;
};
