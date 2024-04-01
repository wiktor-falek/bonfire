import { generateNumericId } from "../../../helpers/id.js";
import type { User } from "../interfaces/user.js";

export function createUser(input: {
  email: string;
  username: string;
  displayName: string;
  hash: string;
}): User {
  return {
    id: generateNumericId(21),
    account: {
      ...input,
      registrationTimestamp: Date.now(),
    },
    status: "offline",
  };
}
