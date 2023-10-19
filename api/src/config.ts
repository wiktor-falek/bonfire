import "dotenv/config";

type Config = {
  [K in keyof Env]-?: Env[K];
};

/**
 * Asserts that every env variable is defined.
 * Throws an error if any field is undefined.
 */
function sanitizeConfig(env: any): Config {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing field ${key} in .env`);
    }
  }
  return env as Config;
}

type Env = {
  NODE_ENV: string;
  JWT_SECRET?: string;
};

const config: Env = {
  NODE_ENV: "development",
  JWT_SECRET: process.env.JWT_SECRET,
};

export default sanitizeConfig(config);
