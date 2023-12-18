import type { Response } from "express";
import type { ValidatedRequest } from "../types.js";
import type ChannelModel from "../models/channelModel.js";
import type UserService from "../services/userService.js";
import { getOtherUserProfileInDirectMessageChannelSchema } from "../validators/channelValidators.js";

class ChannelController {
  constructor(
    private channelModel: ChannelModel,
    private userService: UserService
  ) {}

  async getOtherUserProfileInDirectMessageChannel(
    req: ValidatedRequest<
      typeof getOtherUserProfileInDirectMessageChannelSchema
    >,
    res: Response
  ) {
    const userId = res.locals.user.id;
    const { channelId } = req.params;

    const findParticipantsResult =
      await this.channelModel.findParticipantsInChannel(channelId);

    if (!findParticipantsResult.ok) {
      return res.status(500).json({ error: findParticipantsResult.err });
    }

    const participants = findParticipantsResult.val;

    // NOTE: in the future the direct message channels should be separated from server channels.
    // Right now this would return incorrect userId in non direct message channel instead of Err

    if (participants.length !== 2) {
      return res.status(400).json({ error: "Not a direct message channel" });
    }

    const [firstId, secondId] = participants as [string, string];

    const otherUserId = userId === firstId ? secondId : firstId;

    const getProfileResult = await this.userService.getUserProfileInfo(
      otherUserId
    );

    if (!getProfileResult.ok) {
      return res.status(500).json({ error: getProfileResult.err });
    }

    const userProfile = getProfileResult.val;

    return res.status(200).json(userProfile);
  }
}

export default ChannelController;
