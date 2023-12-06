import { Err, Ok } from "resultat";
import { createFriendInvite } from "../entities/friendInvite.js";
import { createFriendRelation } from "../entities/relations.js";
import type FriendInviteModel from "../models/friendInviteModel.js";
import type RelationModel from "../models/relationModel.js";
import type NotificationService from "./notificationService.js";
import type UserModel from "../models/userModel.js";

class RelationshipService {
  constructor(
    private userModel: UserModel,
    private friendInviteModel: FriendInviteModel,
    private relationModel: RelationModel,
    private notificationService: NotificationService
  ) {}

  async getAllUserRelations(userId: string) {
    const [friendsResult, blockedResult, pendingFriendsResult] =
      await Promise.all([
        this.relationModel.findAllFriendRelations(userId),
        this.relationModel.findAllBlockRelationsByUser(userId),
        this.friendInviteModel.findAllInvitesByUserId(userId),
      ] as const);

    if (!friendsResult.ok || !blockedResult.ok || !pendingFriendsResult.ok) {
      return Err("Failed to get relations");
    }

    const friends = friendsResult.val;
    const blocked = blockedResult.val;
    const pending = pendingFriendsResult.val;

    return Ok({ friends, pending, blocked });
  }

  async sendFriendInviteByUsername(
    senderId: string,
    recipientUsername: string
  ) {
    const recipient = await this.userModel.findByUsername(recipientUsername);

    if (recipient === null) {
      return Err("Incorrect username");
    }

    return this.sendFriendInvite(senderId, recipient.id);
  }

  async sendFriendInvite(senderId: string, recipientId: string) {
    const friendInvite = createFriendInvite(senderId, recipientId);
    const result = await this.friendInviteModel.createInvite(friendInvite);

    if (!result.ok) {
      return result;
    }

    // TODO: handle users already being friends

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

      return Ok({ friendRelation });
    }

    // TODO: only if recipient did not block the sender
    this.notificationService.notify(recipientId, "friend-invite", {
      from: senderId,
    });

    return Ok({ friendInvite });
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

  async rejectFriendInvite(userId: string, inviteId: string) {
    return Err("Not Implemented");
  }

  async blockUser(blockingUserId: string, blockedUserId: string) {
    return Err("Not Implemented");
  }

  async unblockUser(blockingUserId: string, blockedUserId: string) {
    return Err("Not Implemented");
  }
}

export default RelationshipService;
