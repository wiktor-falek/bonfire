import { Err, Ok } from "resultat";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import User from "../entities/user.js";
import { v4 as uuidv4 } from "uuid";

class AuthService {
  constructor(private userModel: UserModel) {}

  async register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    const emailIsInUse = await this.userModel.emailExists(email);

    if (emailIsInUse) {
      return Err("Email is already in use");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ email, username, displayName, hash });

    return this.userModel.createUser(user);
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findByEmail(email);

    if (user === null) {
      return Err("Incorrect username or password");
    }

    const isAuthenticated = await bcrypt.compare(password, user.account.hash);

    if (!isAuthenticated) {
      return Err("Incorrect username or password");
    }

    const sessionId = uuidv4();

    // TODO: sessionStore.updateSession
    const result = await this.userModel.updateSession(sessionId, email);

    if (!result.ok) {
      return result;
    }

    return Ok({ user, sessionId });
  }
}

export default AuthService;
