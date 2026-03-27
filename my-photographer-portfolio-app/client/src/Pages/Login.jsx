import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Login.css";
import { useNotification } from "../Context/NotificationContext";

const Login = () => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await login(username, password);
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ position: "relative", minHeight: "450px" }}>
        <h2 className="login-title">Quản Trị Viên Đăng Nhập</h2>
        <p className="login-subtitle">Truy cập vào thư viện ảnh để quản lý</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập vào tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập vào mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </form>

        {loading && (
          <div 
            className="loading-overlay" 
            style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundColor: "rgba(255,255,255,0.7)", 
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backdropFilter: "blur(2px)"
            }}
          >
            <div className="spinner"></div>
            <p style={{ marginTop: "10px", fontWeight: "500" }}>Đang kiểm tra tài khoản...</p>
          </div>
        )}
      </div>
    </div>

  );
};

export default Login;
