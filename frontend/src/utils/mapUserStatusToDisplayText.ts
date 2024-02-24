import type { UserStatus } from "../api/users";

export function mapUserStatusToDisplayText(status?: UserStatus) {
  if (!status) return undefined;

  const userStatusTextMap: Record<UserStatus, string> = {
    online: "Online",
    away: "Away",
    dnd: "Do Not Disturb",
    offline: "Offline",
  };

  return userStatusTextMap[status];
}
