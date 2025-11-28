// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // null = chưa đăng nhập
  const [loading, setLoading] = useState(true);
  const {showNotification} = useNotification()

  // ======================
  // LOGIN
  // ======================
  const login = async (username, password) => {
    try {
      setLoading(true)
      const res = await authApi.post(endpoints.login, { username, password });

      if (res.data.isVerified) {
        setUser({ username });
        showNotification(res.data.message, "success")
        return true;
      }
      else {
        alert(res.data.message)
      }
    } catch (error) {
      showNotification(error.response.data.message,"error")
      return false;
    } finally {
      setLoading(false)
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = async () => {
    try {
      setLoading(true)
      await authApi.post(endpoints.logout);
      setUser(null);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  // ======================
  // AUTO LOGIN bằng refreshToken
  // ======================
  const checkLoginStatus = async () => {
    try {
      const res = await authApi.get(endpoints.getMe);
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // load khi mở trang
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
