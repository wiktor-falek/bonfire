import sjcl from "sjcl";

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
