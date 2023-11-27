import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getMessageSchema,
  postMessageSchema,
} from "../validators/messageValidators.js";
import {
  getMessages,
  saveDirectMessage,
} from "../controllers/messageController.js";
import authGuard from "../middlewares/authGuard.js";

const router = Router();

router.use(authGuard);

router.get("/", validate(getMessageSchema), getMessages);
router.post("/", validate(postMessageSchema), saveDirectMessage);

export default router;
