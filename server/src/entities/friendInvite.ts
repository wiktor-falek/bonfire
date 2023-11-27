import { ObjectId } from "mongodb";

export type FriendInvite = {
  _id: string;
  senderId: string;
  recipientId: string;
  timestamp: number;
};

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
