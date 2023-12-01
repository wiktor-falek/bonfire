import { Router } from "express";
import AuthController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import { authService } from "../instances.js";

const controller = new AuthController(authService);

const router = Router();

router.post(
  "/login",
  validate(postLoginSchema),
  controller.login.bind(controller)
);
router.post(
  "/register",
  validate(postRegisterSchema),
  controller.register.bind(controller)
);

export default router;
