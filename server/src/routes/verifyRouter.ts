import { Router } from "express";
import validate from "../middlewares/validate.js";
import { postVerifyToken } from "../domains/auth/validators/verify.js";
import { verificationControllerHTTP } from "../instances.js";

export const router = Router();

router.post(
  "/",
  validate(postVerifyToken),
  verificationControllerHTTP.verifyToken.bind(verificationControllerHTTP)
);
