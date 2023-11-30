import { Err, Ok } from "resultat";
import { createFriendInvite } from "../entities/friendInvite.js";
import { createFriendRelation } from "../entities/friendRelation.js";
import type FriendInviteModel from "../models/friendInviteModel.js";
import type RelationModel from "../models/relationModel.js";
import type NotificationService from "./notificationService.js";

class RelationshipService {
  constructor(
    private friendInviteModel: FriendInviteModel,
    private relationModel: RelationModel,
    private notificationService: NotificationService
  ) {}

  async sendFriendInvite(senderId: string, recipientId: string) {
    const friendInvite = createFriendInvite(senderId, recipientId);
    const result = await this.friendInviteModel.createInvite(friendInvite);

    if (!result.ok) {
      return result;
    }

    if (result.val === "Recipient Already Invited Sender") {
      // The invite was not created, but relationship will be created because both users invited each other.
      const friendRelation = createFriendRelation(senderId, recipientId);
      const createRelationResult = await this.relationModel.createRelation(
        friendRelation
      );

      if (!createRelationResult.ok) {
        return Err("Failed to create relationship");
      }

      // TODO: Invite from the recipient to sender still exists after accepting the invite, needs to be deleted
    }

    this.notificationService.notify(recipientId, "friend-invite", {
      from: senderId,
    });

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

    const relationExistsResult = await this.relationModel.relationExists(
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
    return this.relationModel.createRelation(relation);
  }

  rejectFriendInvite(friendInviteId: string) {}

  blockUser(blockingUserId: string, blockedUserId: string) {}

  unblockUser(blockingUserId: string, blockedUserId: string) {}
}

export default RelationshipService;
