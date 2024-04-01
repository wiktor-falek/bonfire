import { ObjectId } from "mongodb";
import type { FriendInvite } from "../interfaces/invite.js";

export function createFriendInvite(
  senderId: string,
  recipientId: string
): FriendInvite {
  return {
    _id: new ObjectId().toString(),
    senderId,
    recipientId,
    timestamp: Date.now(),
  };
}
