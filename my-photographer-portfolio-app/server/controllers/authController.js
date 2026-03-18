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

    // Create JWT token (only accessToken now)
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      isVerified: true,
      message: "Đăng nhập thành công.",
      accessToken: accessToken, // ✅ trả về đây
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out" });
};
