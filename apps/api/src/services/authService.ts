import UserModel from "../models/userModel.js";

class AuthService {
  static register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    return UserModel.register(email, password, username, displayName);
  }

  static login(email: string, password: string) {
    return UserModel.login(email, password);
  }

  static isSessionValid(sessionId: string) {
    return UserModel.sessionExists(sessionId);
  }
}

export default AuthService;
