import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "../config/dotenv.config.js";

export const login = async (req, res) => {
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .json({ message: "Tên đang nhập và mật khẩu không được bỏ trống!" });

    const isMatch = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );
    if (!isMatch || username !== process.env.ADMIN_USERNAME) {
      return res.status(400).json({
        message:
          "Tên đăng nhập hoặc mật khẩu không đúng. Hãy kiểm tra và thử lại nhé!",
      });
    }

    // Create JWT tokens
    const accessToken = jwt.sign(
      { username: username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { username: username },
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
      { username: decoded.username },
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

    return res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh" });
  }
};

export const getMe = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: { username: decoded.username } });
  } catch (err) {
    return res.status(401).json({ user: null });
  }
};
