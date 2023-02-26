const GetEnv = (env: string) => {
  const value = process.env[env];
  if (value === undefined) {
    throw Error(`${env} missing from environment`);
  }

  return value;
};

export default {
  ALGOLIA_API_KEY: GetEnv("ALGOLIA_API_KEY"),
  ALGOLIA_APPLICATION_ID: GetEnv("ALGOLIA_APPLICATION_ID"),
  BOT_TOKEN: GetEnv("BOT_TOKEN"),
  HELPER_ROLE_ID: GetEnv("HELPER_ROLE_ID"),
};
