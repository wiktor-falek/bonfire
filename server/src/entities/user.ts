import { generateNumericId } from "../utils/id.js";

export type User = {
  id: string;
  account: {
    email: string;
    username: string;
    displayName: string;
    registrationTimestamp: number;
    hash: string;
  };
};

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
  };
}
