import { describe, it, expect, assert } from "vitest";
import FriendInviteModel from "./friendInviteModel.js";
import { getInMemoryMongoDb } from "../tests/utils.js";
import { createFriendInvite } from "../entities/friendInvite.js";

describe("friend invite operations", async () => {
  const inMemoryDb = await getInMemoryMongoDb();
  const friendInviteModel = new FriendInviteModel(inMemoryDb);

  it("creates an invite", async () => {
    const friendInvite = createFriendInvite("user_A_ID", "user_B_ID")
    
    const result = await friendInviteModel.createInvite(friendInvite)

    expect(result.ok).toBe(true)
  });

  it("prevents duplicate invites from user A to user B", async () => {});

  it("does not create new invite if user B already invited user A (but returns Ok)", async () => {});

  it("deletes an invite", async () => {});
});
