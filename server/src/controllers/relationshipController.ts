import type { Request, Response } from "express";
import type { ValidatedRequest } from "../types.js";
import type RelationshipService from "../services/relationshipService.js";
import {
  postFriendInviteByUsernameSchema,
  postSendFriendInviteSchema,
  postAcceptFriendInviteSchema,
  postRejectFriendInviteSchema,
  postBlockUserSchema,
  postUnblockUserSchema,
} from "../validators/relationshipValidators.js";

class RelationshipControllerHTTP {
  constructor(private relationshipService: RelationshipService) {}

  async getAllUserRelations(req: Request, res: Response) {
    const userId = res.locals.user.id;

    const result = await this.relationshipService.getAllRelatedUserProfiles(
      userId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const relationships = result.val;

    return res.status(200).json(relationships);
  }

  async postFriendInviteByUsername(
    req: ValidatedRequest<typeof postFriendInviteByUsernameSchema>,
    res: Response
  ) {
    const senderId = res.locals.user.id;
    const recipientUsername = req.body.username;

    const result = await this.relationshipService.sendFriendInviteByUsername(
      senderId,
      recipientUsername
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }

  async postSendFriendInvite(
    req: ValidatedRequest<typeof postSendFriendInviteSchema>,
    res: Response
  ) {
    const senderId = res.locals.user.id;
    const recipientId = req.body.userId;

    const result = await this.relationshipService.sendFriendInviteById(
      senderId,
      recipientId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }

  async postAcceptFriendInvite(
    req: ValidatedRequest<typeof postAcceptFriendInviteSchema>,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { senderId } = req.body;

    const result = await this.relationshipService.acceptFriendInvite(
      userId,
      senderId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }

  async postRejectFriendInvite(
    req: ValidatedRequest<typeof postRejectFriendInviteSchema>,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { senderId } = req.body;

    const result = await this.relationshipService.rejectFriendInvite(
      userId,
      senderId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }

  async postBlockUser(
    req: ValidatedRequest<typeof postBlockUserSchema>,
    res: Response
  ) {
    const senderId = res.locals.user.id;
    const recipientId = req.body.userId;

    const result = await this.relationshipService.blockUser(
      senderId,
      recipientId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }

  async postUnblockUser(
    req: ValidatedRequest<typeof postUnblockUserSchema>,
    res: Response
  ) {
    const senderId = res.locals.user.id;
    const recipientId = req.body.userId;

    const result = await this.relationshipService.unblockUser(
      senderId,
      recipientId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }
}

export default RelationshipControllerHTTP;
