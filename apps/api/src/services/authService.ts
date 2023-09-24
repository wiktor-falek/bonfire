import UserModel from "../models/userModel.js";

class AuthService {
  constructor(public userModel: UserModel) {}

  register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    return this.userModel.register(email, password, username, displayName);
  }

  login(email: string, password: string) {
    return this.userModel.login(email, password);
  }

  isSessionValid(sessionId: string) {
    return this.userModel.sessionExists(sessionId);
  }
}

export default AuthService;
