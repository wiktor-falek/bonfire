import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  postLoginSchema,
  postRegisterSchema,
} from "../validators/userValidators.js";
import { authControllerHTTP } from "../instances.js";

const router = Router();

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

export default router;
