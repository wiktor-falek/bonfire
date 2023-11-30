import { Router } from "express";
import AuthController from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import { authService } from "src/instances.js";

const controller = new AuthController(authService);

const router = Router();

router.post("/login", validate(postLoginSchema), controller.login);
router.post("/register", validate(postRegisterSchema), controller.register);

export default router;
