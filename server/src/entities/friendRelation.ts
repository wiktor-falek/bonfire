import { ObjectId } from "mongodb";

export type FriendRelation = {
  _id: string;
  firstUserId: string;
  secondUserId: string;
  since: number;
};

export function createFriendRelation(
  firstUserId: string,
  secondUserId: string
) {
  return {
    _id: new ObjectId().toString(),
    firstUserId,
    secondUserId,
    since: Date.now(),
  };
}
