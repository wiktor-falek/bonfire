import jwt from "jsonwebtoken";
import { Err, Ok } from "resultat";
import config from "../../../config.js";

export type VerificationTokenPayload = {
  username: string;
  email: string;
};

export function generateEmailVerificationToken(
  payload: VerificationTokenPayload
) {
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
}

export function verifyEmailVerificationToken(token: string) {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    return Ok(payload as VerificationTokenPayload);
  } catch (_) {
    return Err("Verification token is expired or invalid");
  }
}
