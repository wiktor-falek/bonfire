import { Router } from "express";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../domains/auth/validators/auth.js";
import { authControllerHTTP } from "../instances.js";
import validate from "../middlewares/validate.js";

export const router = Router();

router.post(
  "/login",
  validate(postLoginSchema),
  authControllerHTTP.login.bind(authControllerHTTP)
);
router.post(
  "/register",
  validate(postRegisterSchema),
  authControllerHTTP.register.bind(authControllerHTTP)
);
