import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getMessageSchema,
  postMessageSchema,
} from "../validators/messageValidators.js";
import authGuard from "../middlewares/authGuard.js";
import { messageController } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/",
  validate(getMessageSchema),
  messageController.getMessages.bind(messageController)
);
router.post(
  "/",
  validate(postMessageSchema),
  messageController.saveDirectMessage.bind(messageController)
);

export default router;
