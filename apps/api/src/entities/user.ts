import { generateNumericId } from "../utils/id.js";

class User {
  id: string;
  account: {
    email: string;
    username: string;
    displayName: string;
    registrationTimestamp: number;
    hash: string;
  };

  constructor({
    email,
    username,
    displayName,
    hash,
  }: {
    email: string;
    username: string;
    displayName: string;
    hash: string;
  }) {
    this.id = generateNumericId(21);
    this.account = {
      email,
      username,
      displayName,
      hash,
      registrationTimestamp: Date.now(),
    };
  }
}

export default User;
