import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getMessageSchema,
  postMessageSchema,
} from "../validators/messageValidators.js";
import authGuard from "../middlewares/authGuard.js";
import { messageControllerHTTP } from "../instances.js";

const router = Router();

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

export default router;
