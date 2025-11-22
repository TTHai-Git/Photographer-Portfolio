import getRedisClient from "../config/redisCloud.config.js";

const whitelist = [
  "127.0.0.1",
  "::1",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5000",
  "http://localhost:8000",
];

export const getOrSetCachedData = async (key, callback, ttl = 1800) => {
  const cacheData = await getRedisClient.get(key);

  if (cacheData) {
    console.log("✅ Cache hit:", key);
    return JSON.parse(cacheData);
  }

  console.log(`💾 Cache miss: ${key} → fetching from DB`);
  const freshData = await callback(); // get data from DB or API

  await getRedisClient.set(key, JSON.stringify(freshData), { EX: ttl });
  return freshData;
};

export const flushDb = async (req, res) => {
  try {
    await getRedisClient.flushDb();
    return res
      .status(200)
      .json({ message: "Fush Db Of Redis Cloud success ! " });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Server Error:", error });
  }
};

export const flushAll = async (req, res) => {
  try {
    await getRedisClient.flushAll();
    return res
      .status(200)
      .json({ message: "Flush All Of Redis Cloud success ! " });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Server Error:", error });
  }
};

export const clearCacheByKeyword = async (keyword) => {
  try {
    let cursor = "0";
    let deletedCount = 0;

    do {
      // Object destructuring for @redis/client
      const { cursor: nextCursor, keys } = await getRedisClient.scan(cursor, {
        MATCH: `*${keyword}*`,
        COUNT: 100,
      });

      if (keys.length > 0) {
        await getRedisClient.del(...keys);
        deletedCount += keys.length;
      }

      cursor = nextCursor;
    } while (cursor !== "0");

    console.log(
      `🧹 Cleared ${deletedCount} cache keys containing "${keyword}"`
    );
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

const ATTEMPT_KEY = (ip, method, path) => `ip:attempt:${ip}:${method}:${path}`;
const BLOCK_KEY = (ip) => `ip:block:${ip}`;

export const ipRateCheck = (opts = {}) => {
  const {
    maxAttempts = 100, // số lần request tối đa
    windowSeconds = 60, // reset lại sau bao lâu (VD: 60s)
    blockSeconds = 60 * 15, // block IP bao lâu nếu vượt limit
  } = opts;

  return async (req, res, next) => {
    try {
      // 🧭 Lấy IP client chính xác (hỗ trợ proxy)
      const ip = (
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        ""
      )
        .split(",")[0]
        .trim();

      if (!ip || whitelist.includes(ip)) return next();

      // 📍 Lấy method + path để phân biệt từng API
      const method = req.method;
      const path = req.baseUrl + req.path; // baseUrl khi dùng router.use()

      // 1️⃣ Kiểm tra nếu IP đã bị block
      const isBlocked = await getRedisClient.get(BLOCK_KEY(ip));
      if (isBlocked) {
        let ttl = await getRedisClient.ttl(BLOCK_KEY(ip));
        if (ttl < 0) ttl = blockSeconds;
        return res.status(429).json({
          message: `🚫 Your IP is blocked. Try again in ${ttl} seconds.`,
        });
      }

      // 2️⃣ Tăng số lần gọi theo từng API + method
      const key = ATTEMPT_KEY(ip, method, path);
      const attempts = await getRedisClient.incr(key);

      console.log(
        `[RateLimit] ${ip} → ${method} ${path} | Attempt ${attempts}/${maxAttempts}`
      );

      if (attempts === 1) {
        await getRedisClient.expire(key, windowSeconds);
      }

      // 3️⃣ Nếu vượt giới hạn → block IP
      if (attempts > maxAttempts) {
        await getRedisClient.setEx(BLOCK_KEY(ip), blockSeconds, "1");
        await getRedisClient.del(key); // reset counter
        return res.status(429).json({
          message: `Too many requests to ${method} ${path}. IP blocked for ${blockSeconds} seconds.`,
        });
      }

      // ✅ Cho phép request
      next();
    } catch (err) {
      console.error("ipRateCheck error:", err);
      next();
    }
  };
};
