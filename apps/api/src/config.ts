import "dotenv/config";

type Env = {
  NODE_ENV?: string;
  JWT_SECRET?: string;
};

type Config = {
  NODE_ENV: string;
  JWT_SECRET: string;
};

/**
 * Throws an error if any field is undefined
 */
const sanitizeConfig = (env: Env): Config => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing field ${key} in .env`);
    }
  }
  return env as Config;
};

const config: Env = {
  NODE_ENV: "development",
  JWT_SECRET: process.env.JWT_SECRET,
};

export default sanitizeConfig(config);
