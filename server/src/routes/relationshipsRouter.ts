import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import {
  postSendFriendInviteSchema,
  postAcceptFriendInviteSchema,
  postRejectFriendInviteSchema,
  postUnblockUserSchema,
  postBlockUserSchema,
  postFriendInviteByUsernameSchema,
} from "../validators/relationshipValidators.js";
import { relationshipController } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/",
  relationshipController.getAllUserRelations.bind(relationshipController)
);

router.post(
  "/send-friend-invite-by-username",
  validate(postFriendInviteByUsernameSchema),
  relationshipController.postFriendInviteByUsername.bind(relationshipController)
);
router.post(
  "/send-friend-invite-by-id",
  validate(postSendFriendInviteSchema),
  relationshipController.postSendFriendInvite.bind(relationshipController)
);
router.post(
  "/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  relationshipController.postAcceptFriendInvite.bind(relationshipController)
);
router.post(
  "/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  relationshipController.postRejectFriendInvite.bind(relationshipController)
);
router.post(
  "/block-user",
  validate(postBlockUserSchema),
  relationshipController.postBlockUser.bind(relationshipController)
);
router.post(
  "/unblock-user",
  validate(postUnblockUserSchema),
  relationshipController.postUnblockUser.bind(relationshipController)
);

export default router;
