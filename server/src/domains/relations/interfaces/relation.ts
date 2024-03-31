export type Relation = {
  _id: string;
  firstUserId: string;
  secondUserId: string;
  kind: "friend" | "block";
  since: number;
};

export type FriendRelation = Relation & { kind: "friend" };

export type BlockRelation = Relation & { kind: "block" };
