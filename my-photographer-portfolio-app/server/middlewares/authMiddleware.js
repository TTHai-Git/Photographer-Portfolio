import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js";

export const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers["authorization"].split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if ((await Role.findById(decoded.role).select("name"))?.name !== "user") {
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
  const token =
    req.cookies.accessToken || req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if ((await Role.findById(decoded.role).select("name"))?.name !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token is expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
