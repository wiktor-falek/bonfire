import { describe, it, expect, assert, beforeEach } from "vitest";
import FriendInviteModel from "./friendInviteModel.js";
import { getInMemoryMongoDb } from "../tests/utils.js";
import { createFriendInvite } from "../entities/friendInvite.js";
import type { Db } from "mongodb";

describe("friend invite operations", async () => {
  let inMemoryDb: Db;
  let friendInviteModel: FriendInviteModel;

  beforeEach(async () => {
    inMemoryDb = await getInMemoryMongoDb();
    friendInviteModel = new FriendInviteModel(inMemoryDb);
  });

  it("creates an invite", async () => {
    const friendInvite = createFriendInvite("user_A_ID", "user_B_ID");

    const result = await friendInviteModel.createInvite(friendInvite);

    expect(result.ok).toBe(true);
  });

  it("prevents duplicate invites from user A to user B", async () => {
    const invite = createFriendInvite("user_A_ID", "user_B_ID");

    const originalResult = await friendInviteModel.createInvite(invite);
    const duplicateResult = await friendInviteModel.createInvite(invite);

    assert(originalResult.ok);
    assert(!duplicateResult.ok);

    assert(duplicateResult.err === "Invite Already Sent");
  });

  it("does not create new invite if user B already invited user A (but returns Ok)", async () => {
    const aToBInvite = createFriendInvite("user_A_ID", "user_B_ID");
    const bToAInvite = createFriendInvite("user_B_ID", "user_A_ID");

    const aToBInviteResult = await friendInviteModel.createInvite(aToBInvite);
    assert(aToBInviteResult.ok);

    const bToAInviteResult = await friendInviteModel.createInvite(bToAInvite);
    assert(bToAInviteResult.ok);

    expect(bToAInviteResult.val === "Recipient Already Invited Sender");

    const findBToAInviteResult = await friendInviteModel.findInviteById(
      bToAInvite._id
    );

    expect(findBToAInviteResult.ok).toBe(false);
  });

  it("deletes an invite by invite id", async () => {
    const friendInvite = createFriendInvite("user_A_ID", "user_B_ID");
    (await friendInviteModel.createInvite(friendInvite)).unwrap();

    const deleteResult = await friendInviteModel.deleteInviteById(
      friendInvite._id
    );
    const duplicateDeleteResult = await friendInviteModel.deleteInviteById(
      friendInvite._id
    );

    assert(deleteResult.ok);
    assert(!duplicateDeleteResult.ok);
  });

  it("deletes an invite by sender and recipient ids", async () => {
    const senderId = "user_A_ID";
    const recipientId = "user_B_ID";
    const friendInvite = createFriendInvite(senderId, recipientId);
    (await friendInviteModel.createInvite(friendInvite)).unwrap();

    const deleteResult =
      await friendInviteModel.deleteInviteBySenderAndRecipient(
        senderId,
        recipientId
      );

    const duplicateDeleteResult =
      await friendInviteModel.deleteInviteBySenderAndRecipient(
        senderId,
        recipientId
      );

    assert(deleteResult.ok);
    assert(!duplicateDeleteResult.ok);
  });
});
