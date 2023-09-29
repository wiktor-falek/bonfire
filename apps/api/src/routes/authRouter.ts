import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";

const router = Router();

router.post("/login", validate(postLoginSchema), login);
router.post("/register", validate(postRegisterSchema), register);

export default router;
