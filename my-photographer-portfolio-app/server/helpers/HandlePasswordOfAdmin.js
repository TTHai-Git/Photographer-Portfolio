import bcrypt from "bcrypt";
import "../config/dotenv.config.js"; // load .env trước

export const bcryptHashGenerator = async (plainPassword) => {
  const hash = await bcrypt.hash(plainPassword, 13);
  console.log(hash);
};

export const checkAdminPassword = async (plainPassword) => {
  return await bcrypt.compare(plainPassword, process.env.ADMIN_PASSWORD_HASH);
};
