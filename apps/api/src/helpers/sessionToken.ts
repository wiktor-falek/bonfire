import jwt, { type JwtPayload, type JsonWebTokenError } from "jsonwebtoken";
import config from "../config.js";
import { Err, Ok } from "resultat";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string;
    username: string;
  }
}

export function createSessionToken(fields: { id: string; username: string }) {
  const token = jwt.sign(fields, config.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}

export function decryptSessionToken(token: string) {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    return Ok(payload);
  } catch (error) {
    return Err(error as JsonWebTokenError);
  }
}
