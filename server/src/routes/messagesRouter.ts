import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getMessageSchema,
  postMessageSchema,
} from "../validators/messageValidators.js";
import MessageController from "../controllers/messageController.js";
import authGuard from "../middlewares/authGuard.js";
import { messageService } from "src/instances.js";

const controller = new MessageController(messageService);

const router = Router();

router.use(authGuard);

router.get("/", validate(getMessageSchema), controller.getMessages);
router.post("/", validate(postMessageSchema), controller.saveDirectMessage);

export default router;
