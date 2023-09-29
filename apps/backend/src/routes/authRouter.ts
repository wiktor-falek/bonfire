import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/userValidators.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

export default router;
