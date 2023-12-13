import crypto from "node:crypto";
import sjcl from "sjcl";

export function generateNumericId(length: number): string {
  const id = Array.from({ length }, () =>
    crypto.randomInt(0, 9).toString()
  ).join("");
  return id;
}

/**
 * Calculates the channel id for direct messages between two users.
 */
export function getDirectMessageChannelId(
  firstUserId: string,
  secondUserId: string
) {
  const sortedIds = [firstUserId, secondUserId].sort().join("");

  const data = sjcl.hash.sha256.hash(sortedIds);
  const hash = sjcl.codec.hex.fromBits(data);

  return BigInt("0x" + hash).toString().slice(0, 21);
}
