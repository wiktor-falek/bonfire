import bcrypt from "bcrypt";
import { Err, Ok } from "resultat";
import { v4 as uuidv4 } from "uuid";
import { createUser } from "../../users/index.js";
import type { SessionStore } from "../stores/session.js";
import { generateEmailVerificationToken } from "../helpers/emailVerification.js";
import type { IEmailService } from "../../emails/services/email.interface.js";
import type { IUserModel } from "../../users/models/user.interface.js";

export class AuthService {
  constructor(
    private userModel: IUserModel,
    private sessionStore: SessionStore,
    private emailService: IEmailService
  ) {}

  async register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    // Avoid pre-emptive hashing by checking if username or password is already in use
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

    const createUserResult = await this.userModel.createUser(user);

    if (createUserResult.ok) {
      const verificationToken = generateEmailVerificationToken({
        username,
        email,
      });
      this.emailService.sendSignupEmail(email, { username, verificationToken });
    }

    return createUserResult;
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
