import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getMessageSchema,
  postMessageSchema,
} from "../validators/messageValidators.js";
import MessageController from "../controllers/messageController.js";
import authGuard from "../middlewares/authGuard.js";
import { messageService } from "../instances.js";

const controller = new MessageController(messageService);

const router = Router();

router.use(authGuard);

router.get("/", validate(getMessageSchema), controller.getMessages.bind(controller));
router.post("/", validate(postMessageSchema), controller.saveDirectMessage.bind(controller));

export default router;
