import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "../config/dotenv.config.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import validator from "validator";

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
      role
    });
    // console.log(newUser);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .json({ message: "Tên đăng nhập và mật khẩu không được bỏ trống!" });

    const user =
      (await User.findOne({ username })) ||
      (await User.findOne({ email: username }));

    if (!user)
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc email không hợp lệ" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không hợp lệ!" });
    }

    // Create JWT token (only accessToken now)
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.REACT_APP_NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
      path: "/v1/auth/refresh-token"
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
      partitioned: true,
      maxAge: 60 * 60 * 1000, // 1 hour,
      path: "/v1"
    });

    return res.status(200).json({
      isVerified: true,
      message: "Đăng nhập thành công.",
      accessToken: accessToken // ✅ trả về đây
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req, res) => {
  // 1. Lấy refreshToken từ cookie (cần cài đặt cookie-parser)
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!" });
  }

  try {
    // 2. Xác thực Refresh Token
    // Lưu ý: Nên dùng Secret riêng cho Refresh Token để an toàn hơn
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 3. Tạo Access Token mới (Thời hạn ngắn, ví dụ 15 phút)
    const newAccessToken = jwt.sign(
      { username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 4. (Tùy chọn) Nếu muốn Refresh Token xoay vòng (Rotation) để bảo mật hơn:
    // Bạn có thể tạo tiếp 1 refreshToken mới và set lại vào cookie tại đây.

    return res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    // Nếu token sai hoặc hết hạn (7 ngày), xóa cookie và bắt login lại

    const isProduction = process.env.REACT_APP_NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      path: "/v1/auth/refresh-token",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false,
      partitioned: true,
      httpOnly: true
    });
    return res
      .status(403)
      .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.REACT_APP_NODE_ENV === "production";
  // res.clearCookie("refreshToken", {
  //   path: "/v1/auth/refresh-token",
  //   sameSite: isProduction ? "none" : "lax",
  //   secure: isProduction ? true : false,
  //   partitioned: true,
  //   httpOnly: true
  // });

  res.clearCookie("accessToken", {
    path: "/v1",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction ? true : false,
    partitioned: true,
    httpOnly: true
  });
  return res.status(200).json({ message: "Logged out" });
};
