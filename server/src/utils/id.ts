import crypto from "node:crypto";

export function generateNumericId(length: number): string {
  const id = Array.from({ length }, () =>
    crypto.randomInt(0, 9).toString()
  ).join("");
  return id;
}
