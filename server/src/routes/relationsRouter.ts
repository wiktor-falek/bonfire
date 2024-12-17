import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { relationControllerHttp } from "../instances.js";
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
  relationControllerHttp.getAllUserRelations.bind(relationControllerHttp)
);

router.post(
  "/send-friend-invite-by-username",
  validate(postFriendInviteByUsernameSchema),
  relationControllerHttp.postFriendInviteByUsername.bind(relationControllerHttp)
);
router.post(
  "/send-friend-invite-by-id",
  validate(postSendFriendInviteSchema),
  relationControllerHttp.postSendFriendInvite.bind(relationControllerHttp)
);
router.post(
  "/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  relationControllerHttp.postAcceptFriendInvite.bind(relationControllerHttp)
);
router.post(
  "/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  relationControllerHttp.postRejectFriendInvite.bind(relationControllerHttp)
);
router.post(
  "/block-user",
  validate(postBlockUserSchema),
  relationControllerHttp.postBlockUser.bind(relationControllerHttp)
);
router.post(
  "/unblock-user",
  validate(postUnblockUserSchema),
  relationControllerHttp.postUnblockUser.bind(relationControllerHttp)
);
