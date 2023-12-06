import { ObjectId } from "mongodb";

export type Relation = {
  _id: string;
  firstUserId: string;
  secondUserId: string;
  kind: "friend" | "block";
  since: number;
};

export type FriendRelation = Relation & { kind: "friend" };

export type BlockRelation = Relation & { kind: "block" };

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
