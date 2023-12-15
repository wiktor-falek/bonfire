import { generateNumericId } from "../utils/id.js";

export type UserStatus = "online" | "away" | "dnd" | "offline";

export type User = {
  id: string;
  account: {
    email: string;
    username: string;
    displayName: string;
    registrationTimestamp: number;
    hash: string;
  };
  status: UserStatus;
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
    status: "offline"
  };
}
