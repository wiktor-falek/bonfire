import type { ValidatedRequest } from "../types.js";
import type { Response } from "express";
import type {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import type AuthService from "src/services/authService.js";

class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: ValidatedRequest<typeof postLoginSchema>, res: Response) {
    const { email, password } = req.body;

    const result = await this.authService.login(email, password);

    if (!result.ok) {
      console.error(result.err);
      return res.status(401).json({ error: result.err });
    }

    const { user, sessionId } = result.val;
    const { username, displayName } = user.account;

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 60 * 60 * 24 * 1000, // one month
    });

    return res.status(200).json({ username, displayName, email });
  }

  async register(
    req: ValidatedRequest<typeof postRegisterSchema>,
    res: Response
  ) {
    const { email, password, username, displayName } = req.body;

    const result = await this.authService.register(
      email,
      password,
      username,
      displayName ?? ""
    );

    if (!result.ok) {
      return res.status(401).json({ error: result.err });
    }

    return res.status(200).json({ success: true });
  }
}

export default AuthController;
