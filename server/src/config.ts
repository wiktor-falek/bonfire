import "dotenv/config";

type Env = {
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
};

/**
 * Asserts that every env variable is defined.
 */
function sanitizeConfig(env: any): Env {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing field ${key} in .env`);
    }
  }
  return env as Env;
}

const config = sanitizeConfig({
  NODE_ENV:
    process.env.NODE_ENV === "production" ? "production" : "development",
  JWT_SECRET: process.env.JWT_SECRET,
});

export default config;
