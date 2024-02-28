import { Err, Ok } from "resultat";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { createUser } from "../entities/user.js";
import { v4 as uuidv4 } from "uuid";
import type SessionStore from "../stores/sessionStore.js";

class AuthService {
  constructor(
    private userModel: UserModel,
    private sessionStore: SessionStore
  ) {}

  async register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    // Check for existing username or email before hashing passwords.
    // This allows having distinctive error messages, and compared to
    // relying on unique indexes this also avoids pre-emptive hashing.
    const [usernameExistsResult, emailExistsResult] = await Promise.all([
      this.userModel.usernameExists(username),
      this.userModel.emailExists(email),
    ]);

    if (!emailExistsResult.ok || !usernameExistsResult.ok) {
      return Err("Something went wrong");
    }

    const emailIsTaken = emailExistsResult.val;
    const usernameIsTaken = usernameExistsResult.val;

    if (emailIsTaken) {
      return Err("Email is already in use");
    }

    if (usernameIsTaken) {
      return Err("Username is already in use");
    }

    const hash = await bcrypt.hash(password, 12);

    const user = createUser({ email, username, displayName, hash });

    return this.userModel.createUser(user);
  }

  async login(email: string, password: string) {
    const findUserResult = await this.userModel.findByEmail(email);

    if (!findUserResult.ok) {
      return findUserResult;
    }

    const user = findUserResult.val;

    if (user === null) {
      return Err("Incorrect email or password");
    }

    const isAuthenticated = await bcrypt.compare(password, user.account.hash);

    if (!isAuthenticated) {
      return Err("Incorrect email or password");
    }

    const sessionId = uuidv4();

    const result = await this.sessionStore.addSession(sessionId, {
      userId: user.id,
    });

    if (!result.ok) {
      return result;
    }

    return Ok({ user, sessionId });
  }
}

export default AuthService;
