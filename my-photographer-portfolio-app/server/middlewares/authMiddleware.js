import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js";

export const getToken = (req) => {
  // 1. Kiểm tra trong Cookies trước (Ưu tiên vì an toàn hơn)
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  // 2. Nếu không có Cookie, kiểm tra Header Authorization (Dùng cho Postman/Mobile)
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

export const authMiddleware = async (req, res, next) => {
  const token = getToken(req);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role?.includes("user") && !decoded.role?.includes("admin")) {
      return res.status(403).json({ message: "Forbidden: Users only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token is expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  const token = getToken(req);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token is expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
