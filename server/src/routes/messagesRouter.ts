import { Router } from "express";
import {
  getMessageSchema,
  postMessageSchema,
} from "../domains/channels/validators/message.js";
import { messageControllerHttp } from "../instances.js";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";

export const router = Router();

router.use(authGuard);

router.get(
  "/",
  validate(getMessageSchema),
  messageControllerHttp.getMessages.bind(messageControllerHttp)
);
router.post(
  "/",
  validate(postMessageSchema),
  messageControllerHttp.saveDirectMessage.bind(messageControllerHttp)
);
