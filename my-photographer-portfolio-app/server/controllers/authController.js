import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "../config/dotenv.config.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import validator from "validator";
import { getToken } from "../middlewares/authMiddleware.js";

export const createAcount = async (req, res) => {
  const { username, password, email, roleName } = req.body;

  const isValidEmail = validator.isEmail(email); // returns true or false
  // console.log(isValidEmail);
  if (!isValidEmail) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({ message: "User has already exists" });
    }
    // Check If email of user is exists
    const existingEmailOfUser = await User.findOne({ email });
    if (existingEmailOfUser) {
      return res.status(200).json({ message: "This email has already exists" });
    }

    const role = await Role.findOne({ name: roleName });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
    });
    // console.log(newUser);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .json({ message: "Tên đăng nhập và mật khẩu không được bỏ trống!" });

    const user =
      (await User.findOne({ username }).populate("role")) ||
      (await User.findOne({ email: username }).populate("role"));

    if (!user)
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc email không hợp lệ" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không hợp lệ!" });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.REACT_APP_NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      path: "/", // Để "/" cho chắc chắn
    };

    // Create JWT token (only accessToken now)
    const accessToken = jwt.sign(
      { username: user.username, role: user.role.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
        role: user.role.name,
      },
      process.env.JWT_SECRET_BACKUP,
      { expiresIn: "7d" },
    );

    const isProduction = process.env.REACT_APP_NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      isVerified: true,
      message: "Đăng nhập thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Phiên đăng nhập hết hạn!" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_BACKUP);

    const newAccessToken = jwt.sign(
      { username: decoded.username, role: decoded.role }, // decoded.role đã là string
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Đồng bộ với thời gian 1h ở hàm login
    );

    // ✅ PHẢI SET LẠI COOKIE Ở ĐÂY
    const isProduction = process.env.REACT_APP_NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(403).json({ message: "Refresh token expired" });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.REACT_APP_NODE_ENV === "production";

  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie("accessToken", clearOptions);
  res.clearCookie("refreshToken", clearOptions);

  return res.status(200).json({ message: "Logged out" });
};

export const getMe = (req, res) => {
  const accessToken = getToken(req);
  if (!accessToken) {
    // Không có token = chưa đăng nhập, client sẽ không refresh
    return res.status(401).json({ message: "Unauthorized", tokenExpired: false });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    return res.status(200).json({ user: decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token hết hạn → client interceptor sẽ tự động refresh
      return res.status(401).json({ message: "Access token is expired", tokenExpired: true });
    }
    return res.status(401).json({ message: "Invalid token", tokenExpired: false });
  }
};
