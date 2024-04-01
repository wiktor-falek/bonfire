import type { Result } from "resultat";
import type { User, UserStatus } from "../interfaces/user.js";

export type IUserModel = {
  createUser(user: User): Promise<Result<unknown, string>>;
  findByUsername(username: string): Promise<Result<User | null, string>>;
  findByEmail(email: string): Promise<Result<User | null, string>>;
  findById(id: string): Promise<Result<User | null, string>>;
  findAllByIds(ids: string[]): Promise<Result<User[], string>>;
  emailExists(email: string): Promise<Result<boolean, string>>;
  updateStatus(userId: string, status: UserStatus): Promise<Result<unknown, string>>;
};
