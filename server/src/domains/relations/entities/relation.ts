import { ObjectId } from "mongodb";
import type { BlockRelation, FriendRelation } from "../interfaces/relation.js";

export function createFriendRelation(
  firstUserId: string,
  secondUserId: string
): FriendRelation {
  return {
    _id: new ObjectId().toString(),
    firstUserId,
    secondUserId,
    kind: "friend",
    since: Date.now(),
  };
}

export function createBlockRelation(
  firstUserId: string,
  secondUserId: string
): BlockRelation {
  return {
    _id: new ObjectId().toString(),
    firstUserId,
    secondUserId,
    kind: "block",
    since: Date.now(),
  };
}
