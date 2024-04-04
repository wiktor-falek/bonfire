import { Router } from "express";
import {
  getMessageSchema,
  postMessageSchema,
} from "../domains/channels/validators/message.js";
import { messageControllerHTTP } from "../instances.js";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";

export const router = Router();

router.use(authGuard);

router.get(
  "/",
  validate(getMessageSchema),
  messageControllerHTTP.getMessages.bind(messageControllerHTTP)
);
router.post(
  "/",
  validate(postMessageSchema),
  messageControllerHTTP.saveDirectMessage.bind(messageControllerHTTP)
);
