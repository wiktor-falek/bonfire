export type User = {
  id: string;
  account: {
    email: string;
    verifiedEmail: boolean;
    username: string;
    displayName: string;
    registrationTimestamp: number;
    hash: string;
  };
  status: UserStatus;
};

export type UserStatus = "online" | "away" | "dnd" | "offline";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  imgSrc?: string;
};
