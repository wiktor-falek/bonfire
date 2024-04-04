import { Router } from "express";
import { getOtherUserProfileInDirectMessageChannelSchema } from "../domains/channels/validators/channel.js";
import { channelControllerHTTP } from "../instances.js";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";

export const router = Router();

router.use(authGuard);

router.get(
  "/:channelId/other-participant-profile",
  validate(getOtherUserProfileInDirectMessageChannelSchema),
  channelControllerHTTP.getOtherUserProfileInDirectMessageChannel.bind(
    channelControllerHTTP
  )
);
