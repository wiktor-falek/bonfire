import { Router } from "express";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";
import { getOtherUserProfileInDirectMessageChannelSchema } from "../validators/channelValidators.js";
import { channelControllerHTTP } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/:channelId/other-participant-profile",
  validate(getOtherUserProfileInDirectMessageChannelSchema),
  channelControllerHTTP.getOtherUserProfileInDirectMessageChannel.bind(
    channelControllerHTTP
  )
);

export default router;
