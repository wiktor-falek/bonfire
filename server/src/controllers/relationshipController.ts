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

class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  async getAllUserRelations(req: Request, res: Response) {
    const userId = res.locals.user.id;

    const result = await this.relationshipService.getAllUserRelations(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }
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

    const result = await this.relationshipService.sendFriendInvite(
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
    const senderId = res.locals.user.id;
    const inviteId = req.body.inviteId;

    const result = await this.relationshipService.acceptFriendInvite(
      senderId,
      inviteId
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
    const senderId = res.locals.user.id;
    const inviteId = req.body.inviteId;

    const result = await this.relationshipService.rejectFriendInvite(
      senderId,
      inviteId
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

export default RelationshipController;
