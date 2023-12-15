import type { Result } from "resultat";
import type { User } from "../entities/user.js";

export type IUserModel = {
  findByUsername(username: string): Promise<Result<User | null, string>>;
  findByEmail(email: string): Promise<Result<User | null, string>>;
  findById(id: string): Promise<Result<User | null, string>>;
  findAllByIds(ids: string[]): Promise<Result<User[], string>>;
  emailExists(email: string): Promise<Result<boolean, string>>;
  createUser(user: User): Promise<Result<unknown, string>>;
};
