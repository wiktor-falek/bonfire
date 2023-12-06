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
  postFriendInviteByUsernameSchema,
} from "../validators/relationshipValidators.js";

const controller = new RelationshipController(relationshipService);

const router = Router();

router.use(authGuard);

router.get("/", controller.getAllUserRelations.bind(controller));

router.post(
  "/send-friend-request-by-username",
  validate(postFriendInviteByUsernameSchema),
  controller.postFriendInviteByUsername.bind(controller)
);
router.post(
  "/send-friend-invite",
  validate(postSendFriendInviteSchema),
  controller.postSendFriendInvite.bind(controller)
);
router.post(
  "/accept-friend-invite",
  validate(postAcceptFriendInviteSchema),
  controller.postAcceptFriendInvite.bind(controller)
);
router.post(
  "/reject-friend-invite",
  validate(postRejectFriendInviteSchema),
  controller.postRejectFriendInvite.bind(controller)
);
router.post(
  "/block-user",
  validate(postBlockUserSchema),
  controller.postBlockUser.bind(controller)
);
router.post(
  "/unblock-user",
  validate(postUnblockUserSchema),
  controller.postUnblockUser.bind(controller)
);

export default router;
