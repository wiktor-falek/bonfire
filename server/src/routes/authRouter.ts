import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import { authController } from "../instances.js";

const router = Router();

router.post(
  "/login",
  validate(postLoginSchema),
  authController.login.bind(authController)
);
router.post(
  "/register",
  validate(postRegisterSchema),
  authController.register.bind(authController)
);

export default router;
