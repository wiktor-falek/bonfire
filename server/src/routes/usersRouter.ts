import { Router } from "express";
import validate from "../middlewares/validate.js";
import UserController from "../controllers/userController.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../validators/userValidators.js";
import { userService } from "../instances.js";

const controller = new UserController(userService);

const router = Router();

router.use(authGuard);

router.get(
  "/profile/me",
  controller.getCurrentUserProfileInfo.bind(controller)
);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  controller.getUserProfileInfoById.bind(controller)
);

export default router;
