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
import { relationshipControllerHTTP } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/",
  relationshipControllerHTTP.getAllUserRelations.bind(
    relationshipControllerHTTP
  )
);

router.post(
  "/send-friend-invite-by-username",
  validate(postFriendInviteByUsernameSchema),
  relationshipControllerHTTP.postFriendInviteByUsername.bind(
    relationshipControllerHTTP
  )
);
router.post(
  "/send-friend-invite-by-id",
  validate(postSendFriendInviteSchema),
  relationshipControllerHTTP.postSendFriendInvite.bind(
    relationshipControllerHTTP
  )
);
router.post(
  "/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  relationshipControllerHTTP.postAcceptFriendInvite.bind(
    relationshipControllerHTTP
  )
);
router.post(
  "/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  relationshipControllerHTTP.postRejectFriendInvite.bind(
    relationshipControllerHTTP
  )
);
router.post(
  "/block-user",
  validate(postBlockUserSchema),
  relationshipControllerHTTP.postBlockUser.bind(relationshipControllerHTTP)
);
router.post(
  "/unblock-user",
  validate(postUnblockUserSchema),
  relationshipControllerHTTP.postUnblockUser.bind(relationshipControllerHTTP)
);

export default router;
