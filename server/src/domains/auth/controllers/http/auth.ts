import type { Response } from "express";
import type { ValidatedRequest } from "../../../../types.js";
import type {
  postLoginSchema,
  postRegisterSchema,
} from "../../validators/auth.js";
import { type AuthService } from "../../services/auth.js";
import config from "../../../../config.js";

export class AuthControllerHttp {
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
      secure: config.NODE_ENV === "production",
      maxAge: 30 * 60 * 60 * 24 * 1000, // one month
    });

    return res.status(200).json({ username, displayName, email });
  }

  async register(
    req: ValidatedRequest<typeof postRegisterSchema>,
    res: Response
  ) {
    const { email, password, username, displayName } = req.body;

    const registerResult = await this.authService.register(
      email,
      password,
      username,
      displayName.length === 0 ? username : displayName
    );

    if (!registerResult.ok) {
      return res.status(400).json({ error: registerResult.err });
    }

    // Automatically log the user in
    const loginResult = await this.authService.login(email, password);

    if (!loginResult.ok) {
      console.error(
        "User registered but automatic login failed, this should have not happened"
      );
      return res.status(401).json({ error: loginResult.err });
    }

    const { user, sessionId } = loginResult.val;

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      maxAge: 30 * 60 * 60 * 24 * 1000, // one month
    });

    return res.status(200).json({
      username: user.account.username,
      displayName: user.account.displayName,
      email: user.account.email,
    });
  }
}
