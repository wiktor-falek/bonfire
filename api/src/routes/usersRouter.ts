import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  getCurrentUserProfileInfo,
  getUserProfileInfoById,
} from "../controllers/userControllers.js";
import authGuard from "../middlewares/authGuard.js";

const router = Router();

router.use(authGuard);

router.get("/profile/me", getCurrentUserProfileInfo);
router.get("/profile/:userId", getUserProfileInfoById);

export default router;
