import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getCurrentUserProfileInfo,
  getUserProfileInfoById,
} from "../controllers/userControllers.js";
import authGuard from "../middlewares/authGuard.js";
import { getUserProfileByIdSchema } from "../validators/userValidators.js";

const router = Router();

router.use(authGuard);

router.get("/profile/me", getCurrentUserProfileInfo);
router.get(
  "/profile/:userId",
  validate(getUserProfileByIdSchema),
  getUserProfileInfoById
);

export default router;
