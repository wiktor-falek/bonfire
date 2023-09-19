import crypto from "node:crypto";

function generateNumericId(length: number) {
  let id = "";

  for (let i = 0; i < length; i++) {
    const int = crypto.randomInt(0, 9);
    id += int.toString();
  }

  return id;
}

export default generateNumericId;
