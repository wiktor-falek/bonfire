import type { Result } from "resultat";
import type User from "../entities/user.js";

export type IUserModel = {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  emailExists(email: string): Promise<boolean>;
  createUser(user: User): Promise<Result<number, string>>;
};
