import { z } from "zod";
import { userId } from "./userValidators.js";

const inviteId = z.string().length(21);

export const postSendFriendInviteSchema = z.object({
  body: z.object({
    userId,
  }),
});

export const postAcceptFriendInviteSchema = z.object({
  body: z.object({
    inviteId,
  }),
});

export const postRejectFriendInviteSchema = z.object({
  body: z.object({
    inviteId,
  }),
});

export const postBlockUserSchema = z.object({
  body: z.object({
    userId,
  }),
});

export const postUnblockUserSchema = z.object({
  body: z.object({
    userId,
  }),
});
