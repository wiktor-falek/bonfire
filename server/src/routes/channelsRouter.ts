import { Router } from "express";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";
import { getOtherUserProfileInDirectMessageChannelSchema } from "../validators/channelValidators.js";
import { channelController } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/:channelId/other-participant-profile",
  validate(getOtherUserProfileInDirectMessageChannelSchema),
  channelController.getOtherUserProfileInDirectMessageChannel.bind(
    channelController
  )
);

export default router;
