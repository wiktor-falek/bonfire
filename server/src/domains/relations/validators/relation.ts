import { z } from "zod";
import { username, userId } from "../../users/validators/user.js";

export const postFriendInviteByUsernameSchema = z.object({
  body: z.object({
    username,
  }),
});

export const postSendFriendInviteSchema = z.object({
  body: z.object({
    userId,
  }),
});

export const postAcceptFriendInviteSchema = z.object({
  body: z.object({
    senderId: userId,
  }),
});

export const postRejectFriendInviteSchema = z.object({
  body: z.object({
    senderId: userId,
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
