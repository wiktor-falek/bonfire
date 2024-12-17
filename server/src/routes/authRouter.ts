import { Router } from "express";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../domains/auth/validators/auth.js";
import { authControllerHttp } from "../instances.js";
import validate from "../middlewares/validate.js";

export const router = Router();

router.post(
  "/login",
  validate(postLoginSchema),
  authControllerHttp.login.bind(authControllerHttp)
);
router.post(
  "/register",
  validate(postRegisterSchema),
  authControllerHttp.register.bind(authControllerHttp)
);
