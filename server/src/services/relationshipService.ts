import { Err, Ok } from "resultat";
import { createFriendInvite } from "../entities/friendInvite.js";
import { createFriendRelation } from "../entities/relations.js";
import type FriendInviteModel from "../models/friendInviteModel.js";
import type RelationModel from "../models/relationModel.js";
import type NotificationService from "./notificationService.js";
import type UserModel from "../models/userModel.js";
import type UserService from "./userService.js";

class RelationshipService {
  constructor(
    private userModel: UserModel,
    private friendInviteModel: FriendInviteModel,
    private relationModel: RelationModel,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  async getAllRelatedUserProfiles(userId: string) {
    // TODO: handle individual profiles not being loaded successfully

    try {
      const relations = await Promise.all([
        this.relationModel.findAllUserFriendRelations(userId),
        this.relationModel.findAllUserBlockRelations(userId),
        this.friendInviteModel.findAllInvitesSentToUser(userId),
      ]);

      const friendRelationsIds = relations[0]
        .unwrap()
        .map((e) =>
          userId === e.firstUserId ? e.secondUserId : e.firstUserId
        );

      const blockedRelationsIds = relations[1]
        .unwrap()
        .map((e) => e.secondUserId);

      const pendingRelationsIds = relations[2].unwrap().map((e) => e.senderId);

      const profiles = await Promise.all([
        this.userService.getUserProfilesByIds(friendRelationsIds),
        this.userService.getUserProfilesByIds(blockedRelationsIds),
        this.userService.getUserProfilesByIds(pendingRelationsIds),
      ]);

      const friends = profiles[0].unwrap();
      const blocked = profiles[1].unwrap();
      const pending = profiles[2].unwrap();

      return Ok({ friends, pending, blocked });
    } catch (_) {
      return Err("Failed to get relations");
    }
  }

  async sendFriendInviteByUsername(
    senderId: string,
    recipientUsername: string
  ) {
    const findUserResult = await this.userModel.findByUsername(
      recipientUsername
    );

    if (!findUserResult.ok) {
      return findUserResult;
    }

    const recipient = findUserResult.val;

    if (recipient === null) {
      return Err("Incorrect username");
    }

    return this.sendFriendInviteById(senderId, recipient.id);
  }

  async sendFriendInviteById(senderId: string, recipientId: string) {
    if (senderId === recipientId) {
      return Err("Cannot invite yourself");
    }

    const findRelationResult =
      await this.relationModel.findFriendRelationByUserIds(
        senderId,
        recipientId
      );

    if (findRelationResult.ok) {
      return Err("Friend relation already exists");
    } else {
      if (findRelationResult.err === "Network error") {
        return findRelationResult;
      }
    }

    const friendInvite = createFriendInvite(senderId, recipientId);
    const result = await this.friendInviteModel.createInvite(friendInvite);

    if (!result.ok) {
      return result;
    }

    if (result.val === "Recipient Already Invited Sender") {
      // Create relationship instead of an invite because now both users invited each other.
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

  async acceptFriendInvite(userId: string, senderId: string) {
    const findInviteResult =
      await this.friendInviteModel.findInviteBySenderAndRecipient(
        senderId,
        userId
      );

    if (!findInviteResult.ok) {
      return findInviteResult;
    }

    const invite = findInviteResult.val;
    if (invite === null) {
      return Err("Invite does not exist");
    }

    const findRelationResult =
      await this.relationModel.findRelationBetweenUsers(userId, senderId);

    if (!findRelationResult.ok) {
      return findRelationResult;
    }

    const existingRelation = findRelationResult.val;

    if (existingRelation !== null) {
      return Err("Already a friend");
    }

    const relation = createFriendRelation(userId, senderId);
    return this.relationModel.createRelation(relation);
  }

  async rejectFriendInvite(userId: string, senderId: string) {
    return Err("Not Implemented");
  }

  async blockUser(userId: string, targetUserId: string) {
    return Err("Not Implemented");
  }

  async unblockUser(userId: string, targetUserId: string) {
    return Err("Not Implemented");
  }
}

export default RelationshipService;
