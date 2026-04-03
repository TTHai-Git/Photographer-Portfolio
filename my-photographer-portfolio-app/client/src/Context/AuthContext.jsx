// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = chưa đăng nhập
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showNotification } = useNotification();

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await authApi.get(endpoints.getMe);
      if (res.status === 200) setUser(res.data.user);
    } catch (error) {
      // ❗ 401 = bình thường
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.log("Server error", error);
      }
    } finally {
      setLoading(false);
      setIsInitialized(true); // 🔥 QUAN TRỌNG
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ======================
  // LOGIN
  // ======================
  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await authApi.post(endpoints.login, { username, password });

      if (res.data.isVerified) {
        await fetchCurrentUser();
        showNotification(res.data.message, "success");
        return true;
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      showNotification(error.response.data.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = async () => {
    try {
      setLoading(true);
      await authApi.post(endpoints.logout);
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
