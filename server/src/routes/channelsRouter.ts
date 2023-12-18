import { Router } from "express";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";
import { getOtherUserProfileInDirectMessageChannelSchema } from "../validators/channelValidators.js";
import ChannelController from "../controllers/channelController.js";
import { channelModel, userService } from "../instances.js";

const controller = new ChannelController(channelModel, userService);

const router = Router();

router.use(authGuard);

router.get(
  "/:channelId/other-participant-profile",
  validate(getOtherUserProfileInDirectMessageChannelSchema),
  controller.getOtherUserProfileInDirectMessageChannel.bind(controller)
);

export default router;
