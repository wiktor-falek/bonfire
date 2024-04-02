import "dotenv/config";

type Env = {
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
};

/**
 * Asserts that every env variable is defined.
 */
function sanitizeConfig(env: any): Env {
  const missingFields = [];
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      missingFields.push(key);
    }
  }

  if (missingFields.length) {
    throw new Error("Missing .env fields: " + missingFields);
  }

  return env as Env;
}

const config = sanitizeConfig({
  NODE_ENV:
    process.env.NODE_ENV === "production" ? "production" : "development",
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
});

export default config;
