/**
 * Calculates the channel id for direct messages between two users.
 */
export async function getDirectMessageChannelId(
  firstUserId: string,
  secondUserId: string
) {
  const sortedIds = [firstUserId, secondUserId].sort().join("");

  const encoder = new TextEncoder();
  const data = encoder.encode(sortedIds);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)).join("");

  return hashArray.slice(0, 21);
}
