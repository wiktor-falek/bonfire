import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { relationControllerHTTP } from "../instances.js";
import {
  postSendFriendInviteSchema,
  postAcceptFriendInviteSchema,
  postRejectFriendInviteSchema,
  postUnblockUserSchema,
  postBlockUserSchema,
  postFriendInviteByUsernameSchema,
} from "../domains/relations/validators/relation.js";

export const router = Router();

router.use(authGuard);

router.get(
  "/",
  relationControllerHTTP.getAllUserRelations.bind(relationControllerHTTP)
);

router.post(
  "/send-friend-invite-by-username",
  validate(postFriendInviteByUsernameSchema),
  relationControllerHTTP.postFriendInviteByUsername.bind(relationControllerHTTP)
);
router.post(
  "/send-friend-invite-by-id",
  validate(postSendFriendInviteSchema),
  relationControllerHTTP.postSendFriendInvite.bind(relationControllerHTTP)
);
router.post(
  "/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  relationControllerHTTP.postAcceptFriendInvite.bind(relationControllerHTTP)
);
router.post(
  "/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  relationControllerHTTP.postRejectFriendInvite.bind(relationControllerHTTP)
);
router.post(
  "/block-user",
  validate(postBlockUserSchema),
  relationControllerHTTP.postBlockUser.bind(relationControllerHTTP)
);
router.post(
  "/unblock-user",
  validate(postUnblockUserSchema),
  relationControllerHTTP.postUnblockUser.bind(relationControllerHTTP)
);
