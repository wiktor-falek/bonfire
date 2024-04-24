import { Err, Ok } from "resultat";
import { UserService } from "../../users/index.js";
import { createFriendInvite } from "../entities/invite.js";
import { createFriendRelation } from "../entities/relation.js";
import type { FriendInviteModel } from "../models/invite.js";
import type { RelationModel } from "../models/relation.js";
import type { IUserModel } from "../../users/models/user.interface.js";
import { wsServerClient } from "../../../index.js";

export class RelationService {
  constructor(
    private userModel: IUserModel,
    private friendInviteModel: FriendInviteModel,
    private relationModel: RelationModel,
    private userService: UserService // private notificationService: NotificationService
  ) {}

  async getAllRelatedUserProfiles(userId: string) {
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
      return Err("User does not exist");
    }

    return this.sendFriendInviteById(senderId, recipient.id);
  }

  async sendFriendInviteById(senderId: string, recipientId: string) {
    if (senderId === recipientId) {
      return Err("Cannot invite yourself");
    }

    const findExistingRelationResult =
      await this.relationModel.findFriendRelationByUserIds(
        senderId,
        recipientId
      );

    if (!findExistingRelationResult.ok) {
      return findExistingRelationResult;
    }

    const existingRelation = findExistingRelationResult.val;

    if (existingRelation !== null) {
      return Err("Friend relation already exists");
    }

    const invite = createFriendInvite(senderId, recipientId);
    const result = await this.friendInviteModel.createInvite(invite);

    if (!result.ok) {
      return result;
    }

    if (result.val === "Recipient Already Invited Sender") {
      // Create relation instead of an invite because now both users invited each other.
      const friendRelation = createFriendRelation(senderId, recipientId);
      const createRelationResult = await this.relationModel.createRelation(
        friendRelation
      );

      if (!createRelationResult.ok) {
        return Err("Failed to create relation");
      }

      this.friendInviteModel
        .deleteInviteBySenderAndRecipient(senderId, recipientId)
        .then((result) => {
          if (!result.ok) {
            // TODO: handle this scenario
            console.error(
              "Failed to delete the invite after accepting friend invite"
            );
          }
        });

      return Ok({ friendRelation });
    }

    const senderHasBlockedRecipientResult = await this.userHasBlockedUser(
      recipientId,
      senderId
    );
    if (!senderHasBlockedRecipientResult.ok) {
      return senderHasBlockedRecipientResult;
    }

    const senderHasBlockedRecipient = senderHasBlockedRecipientResult.val;

    if (senderHasBlockedRecipient) {
      return Err("The user has blocked you");
    }

    this.userService.getUserProfileById(senderId).then((result) => {
      if (!result.ok) {
        console.error(
          "Failed to dispatch friend invite to recipient. User not found."
        );
        return;
      }

      const senderProfile = result.val;

      // TODO: abstract into a service
      wsServerClient
        .to(`user_${recipientId}`)
        .send("relation:friend-invite", { profile: senderProfile });
    });

    return Ok({ invite });
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

    this.friendInviteModel.deleteInviteById(invite._id).then((result) => {
      if (!result.ok) {
        // TODO: handle this scenario
        console.error(
          "Failed to delete the invite after accepting friend invite"
        );
      }
    });

    return this.relationModel.createRelation(relation);
  }

  async rejectFriendInvite(userId: string, senderId: string) {
    return this.friendInviteModel.deleteInviteBySenderAndRecipient(
      senderId,
      userId
    );
  }

  async userHasBlockedUser(userId: string, targetUserId: string) {
    const findExistingRelationResult =
      await this.relationModel.findRelationBetweenUsers(userId, targetUserId);

    if (!findExistingRelationResult.ok) {
      return findExistingRelationResult;
    }

    const existingRelation = findExistingRelationResult.val;

    if (existingRelation === null || existingRelation.kind !== "block") {
      // TODO: distinct who blocked who
      return Ok(false);
    }

    return Ok(true);
  }

  async blockUser(userId: string, targetUserId: string) {
    return Err("Not Implemented");
  }

  async unblockUser(userId: string, targetUserId: string) {
    return Err("Not Implemented");
  }
}
