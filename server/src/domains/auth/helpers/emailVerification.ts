import jwt from "jsonwebtoken";
import { Err, Ok } from "resultat";
import config from "../../../config.js";

/*
FEAT: Email verification

An email can be used for registration as long as it was not verified by another user.
As long as the email was never verified, multiple users could in theory use the same email.
But if email owner verifies it, other users should be able to select a new email.
*/

export type VerificationTokenPayload = {
  // username: string;
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
  } catch (e) {
    console.error("UNHANDLED ERROR:", e);
    return Err(e);
  }
}
