import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../validators/userValidators.js";
import { patchUserStatus } from "../validators/statusValidators.js";
import { userControllerHTTP } from "../instances.js";
import { statusController } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/profile/me",
  userControllerHTTP.getCurrentUserProfileInfo.bind(userControllerHTTP)
);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  userControllerHTTP.getUserProfileInfoById.bind(userControllerHTTP)
);
router.patch(
  "/status",
  validate(patchUserStatus),
  statusController.setStatus.bind(statusController)
);

export default router;
