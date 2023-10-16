import crypto, { createHash } from "node:crypto";

export function generateNumericId(length: number): string {
  const id = Array.from({ length }, () =>
    crypto.randomInt(0, 9).toString()
  ).join("");
  return id;
}

/**
 * Deterministically generate channelId using two ids of users
 */
export function getChannelId(firstUserId: string, secondUserId: string) {
  // const combined = firstUserId + secondUserId;
  // const hash = createHash("sha256").update(combined, "utf8").digest("hex");
  // const numeric = BigInt("0x" + hash).toString();
  // return numeric.slice(0, 21);
  return "213742069213742069420";
}
