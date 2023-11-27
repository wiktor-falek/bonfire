import { Err, Ok } from "resultat";
import { createFriendInvite } from "../entities/friendInvite.js";
import { createFriendRelation } from "../entities/friendRelation.js";
import type FriendInviteModel from "../models/friendInviteModel.js";
import type FriendRelationModel from "../models/friendRelationModel.js";

// TODO: check if it actually works lmao

class RelationshipService {
  constructor(
    private friendInviteModel: FriendInviteModel,
    private friendRelationModel: FriendRelationModel
  ) {}

  async sendFriendInvite(senderId: string, recipientId: string) {
    const friendInvite = createFriendInvite(senderId, recipientId);
    const result = await this.friendInviteModel.createInvite(friendInvite);

    if (!result.ok) {
      return result;
    }

    if (result.val === "Recipient Already Invited Sender") {
      const friendRelation = createFriendRelation(senderId, recipientId);
      this.friendRelationModel.createRelation(friendRelation);
    }

    return Ok();
  }

  async acceptFriendInvite(userId: string, inviteId: string) {
    const findInviteResult = await this.friendInviteModel.findInviteById(
      inviteId
    );

    if (!findInviteResult.ok) {
      return findInviteResult;
    }

    const invite = findInviteResult.val;

    const relationExistsResult = await this.friendRelationModel.relationExists(
      inviteId
    );

    if (!relationExistsResult.ok) {
      return relationExistsResult;
    }

    const relationExists = relationExistsResult.val;

    if (relationExists) {
      return Err("Already a friend");
    }

    const relation = createFriendRelation(userId, invite.senderId);
    return this.friendRelationModel.createRelation(relation);
  }

  rejectFriendInvite(friendInviteId: string) {}

  blockUser(blockingUserId: string, blockedUserId: string) {}

  unblockUser(blockingUserId: string, blockedUserId: string) {}
}

export default RelationshipService;
