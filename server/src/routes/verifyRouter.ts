import { Router } from "express";
import validate from "../middlewares/validate.js";
import { getVerifyToken } from "../domains/auth/validators/verify.js";
import { verificationControllerHTTP } from "../instances.js";

export const router = Router();

router.get(
  "/:token",
  validate(getVerifyToken),
  verificationControllerHTTP.verifyToken.bind(verificationControllerHTTP)
);

// router.post("/resend-email");

// router.get("/change-email");
