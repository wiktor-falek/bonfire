import { Router } from "express";
import validate from "../middlewares/validate.js";
import { postVerifyToken } from "../domains/auth/validators/verify.js";
import { verificationControllerHttp } from "../instances.js";

export const router = Router();

router.post(
  "/",
  validate(postVerifyToken),
  verificationControllerHttp.verifyToken.bind(verificationControllerHttp)
);
