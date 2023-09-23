import UserModel from "../models/userModel.js";

class AuthService {
  static async register(
    email: string,
    password: string,
    username: string,
    displayName: string
  ) {
    return await UserModel.register(email, password, username, displayName);
  }

  static async login(email: string, password: string) {
    return await UserModel.login(email, password);
  }

  static async isAuthorized(username: string) {
    const user = await UserModel.findByUsername(username);
    return user !== null;
  }
}

export default AuthService;
