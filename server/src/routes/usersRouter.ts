import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../domains/users/validators/user.js";
import { patchUserStatus } from "../domains/users/validators/status.js";
import { userControllerHTTP } from "../instances.js";
import { statusControllerHTTP } from "../instances.js";

const router = Router();

router.use(authGuard);

router.get(
  "/profile/me",
  userControllerHTTP.getCurrentUserProfile.bind(userControllerHTTP)
);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  userControllerHTTP.getUserProfile.bind(userControllerHTTP)
);
router.get(
  "/profiles",
  userControllerHTTP.getUserProfiles.bind(userControllerHTTP)
);

router.patch(
  "/status",
  validate(patchUserStatus),
  statusControllerHTTP.setStatus.bind(statusControllerHTTP)
);

export default router;
