import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import RelationshipController from "../controllers/relationshipController.js";
import { relationshipService } from "../instances.js";
import {
  postSendFriendInviteSchema,
  postAcceptFriendInviteSchema,
  postRejectFriendInviteSchema,
  postUnblockUserSchema,
  postBlockUserSchema,
  sendFriendRequestByUsernameSchema,
} from "../validators/relationshipValidators.js";

const controller = new RelationshipController(relationshipService);

const router = Router();

router.use(authGuard);

router.post(
  "/relationships/send-friend-request-by-username",
  validate(sendFriendRequestByUsernameSchema),
  controller.sendFriendRequestByUsername
);
router.post(
  "/relationships/send-friend-invite",
  validate(postSendFriendInviteSchema),
  controller.postSendFriendInvite
);
router.post(
  "/relationships/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  controller.postAcceptFriendInvite
);
router.post(
  "/relationships/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  controller.postRejectFriendInvite
);
router.post(
  "/relationships/block-user",
  validate(postBlockUserSchema),
  controller.postBlockUser
);
router.post(
  "/relationships/unblock-user",
  validate(postUnblockUserSchema),
  controller.postUnblockUser
);

export default router;
