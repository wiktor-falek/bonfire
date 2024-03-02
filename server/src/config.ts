import "dotenv/config";

type Env = {
  NODE_ENV: string;
  JWT_SECRET: string;
};

/**
 * Asserts that every env variable is defined.
 * Throws an error if any field is undefined.
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
  NODE_ENV: "development",
  JWT_SECRET: process.env.JWT_SECRET,
});

export default config;
