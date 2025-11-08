import getRedisClient from "../config/redisCloud.config.js";

export const testRedisCloud = async () => {
  await getRedisClient.set("ping", "pong", { EX: 10 });
  const value = await getRedisClient.get("ping");
  console.log("✅ Redis Cloud value init:", value);
  // await getRedisClient.quit();
};
