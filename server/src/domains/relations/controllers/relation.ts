import type { Request, Response } from "express";
import type { ValidatedRequest } from "../../../types.js";
import {
  postAcceptFriendInviteSchema,
  postBlockUserSchema,
  postFriendInviteByUsernameSchema,
  postRejectFriendInviteSchema,
  postSendFriendInviteSchema,
  postUnblockUserSchema,
} from "../validators/relation.js";
import { RelationService } from "../services/relation.js";

export class RelationControllerHTTP {
  constructor(private relationService: RelationService) {}

  async getAllUserRelations(req: Request, res: Response) {
    const userId = res.locals.user.id;

    const result = await this.relationService.getAllRelatedUserProfiles(userId);

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    const relations = result.val;

    return res.status(200).json(relations);
  }

  async postFriendInviteByUsername(
    req: ValidatedRequest<typeof postFriendInviteByUsernameSchema>,
    res: Response
  ) {
    const senderId = res.locals.user.id;
    const recipientUsername = req.body.username;

    const result = await this.relationService.sendFriendInviteByUsername(
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

    const result = await this.relationService.sendFriendInviteById(
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

    const result = await this.relationService.acceptFriendInvite(
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

    const result = await this.relationService.rejectFriendInvite(
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

    const result = await this.relationService.blockUser(senderId, recipientId);

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

    const result = await this.relationService.unblockUser(
      senderId,
      recipientId
    );

    if (!result.ok) {
      return res.status(400).json({ error: result.err });
    }

    return res.status(200).json({});
  }
}
