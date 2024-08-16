export type User = {
  id: string;
  account: {
    email: string;
    hasVerifiedEmail: boolean;
    username: string;
    displayName: string;
    registrationTimestamp: number;
    hash: string;
  };
  status: SelectableUserStatus;
  isOnline: boolean;
};

export type UserStatus = "online" | "away" | "dnd" | "offline";

export type SelectableUserStatus = Exclude<UserStatus, "offline"> | "invisible";

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  imgSrc?: string;
};
