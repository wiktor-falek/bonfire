import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../validators/userValidators.js";
import { patchUserStatus } from "../validators/statusValidators.js";
import { userController } from "../instances.js";
import { statusController } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/profile/me",
  userController.getCurrentUserProfileInfo.bind(userController)
);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  userController.getUserProfileInfoById.bind(userController)
);
router.patch(
  "/status",
  validate(patchUserStatus),
  statusController.setStatus.bind(statusController)
);

export default router;
