import { createClient } from "redis";
import "./dotenv.config.js"; // load .env trước

console.log();

const getRedisClient = createClient({
  username: "default",
  password: process.env.REDIS_CLOUD_PASSWORD,
  socket: {
    host: process.env.REDIS_CLOUD_HOST,
    port: process.env.REDIS_CLOUD_PORT,
    // tls: process.env.REACT_APP_NODE_ENV === "development" ? false : true, // Redis Cloud bắt buộc dùng SSL/TLS, chỉ cần true là đủ
  },
});

// ⚙️ Sự kiện log
getRedisClient.on("connect", () => console.log("✅ Connected to Redis Cloud"));
getRedisClient.on("ready", () => console.log("🚀 Redis Redis Cloud is ready"));
getRedisClient.on("error", (err) =>
  console.error("❌ Redis Redis Cloud Client Error:", err)
);
getRedisClient.on("end", () => console.log("🔌 Redis Cloud connection closed"));

// 🔗 Kết nối
await getRedisClient.connect();

export default getRedisClient;
