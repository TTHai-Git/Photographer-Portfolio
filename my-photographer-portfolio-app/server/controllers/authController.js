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
      role,
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

    // Create JWT tokens
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ Set HttpOnly Cookies
    const isProd = process.env.REACT_APP_NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // chỉ bật HTTPS khi production
      sameSite: isProd ? "None" : "Lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    return res.status(200).json({
      isVerified: true,
      message: "Đăng nhập thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const logout = (req, res) => {
  const isProd = process.env.REACT_APP_NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // chỉ bật HTTPS khi production
    sameSite: isProd ? "None" : "Lax",
    path: "/", // thêm cái này để chắc chắn clear đúng cookie
  };

  // clear access token
  res.clearCookie("accessToken", cookieOptions);

  // clear refresh token
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json({ message: "Logged out" });
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // ✅ Set HttpOnly Cookies
    const isProd = process.env.REACT_APP_NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // chỉ bật HTTPS khi production
      sameSite: isProd ? "None" : "Lax",
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh" });
  }
};

export const getMe = (req, res) => {
  return res.status(200).json({
    user: {
      username: req.user.username,
      role: req.user.role,
    },
  });
};
