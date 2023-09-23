import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  messageQuerySchema,
  messageSchema,
} from "../validators/messageValidators.js";
import {
  getMessages,
  sendDirectMessage,
} from "../controllers/messageController.js";
import authGuard from "../middlewares/authGuard.js";

const router = Router();

router.use(authGuard);

router.get("/", validate(messageQuerySchema), getMessages);
router.post("/", validate(messageSchema), sendDirectMessage);

export default router;
