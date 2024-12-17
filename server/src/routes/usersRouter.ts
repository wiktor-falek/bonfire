import { Router } from "express";
import validate from "../middlewares/validate.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../domains/users/validators/user.js";
import { patchUserStatus } from "../domains/users/validators/status.js";
import { userControllerHttp } from "../instances.js";
import { statusControllerHttp } from "../instances.js";

export const router = Router();

router.use(authGuard);

router.get(
  "/profile/me",
  userControllerHttp.getCurrentUserProfile.bind(userControllerHttp)
);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  userControllerHttp.getUserProfile.bind(userControllerHttp)
);
router.get(
  "/profiles",
  userControllerHttp.getUserProfiles.bind(userControllerHttp)
);

router.patch(
  "/status",
  validate(patchUserStatus),
  statusControllerHttp.setStatus.bind(statusControllerHttp)
);
