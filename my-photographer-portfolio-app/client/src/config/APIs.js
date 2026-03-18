import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// ======================================================
// 📌 ENDPOINTS
// ======================================================
export const endpoints = {
  getImagesFromDB: "/images",
  getEachImageOfEachFolder: "/images/get-each-image-of-each-folder",
  getFoldersFromDB: "/folders",
  getFoldersForCombobox: "/folders/all",
  createFolder: "/cloudinaries/folders/cre",
  deleteFolders: "/cloudinaries/folders/del",
  deleteImages: "/cloudinaries/images/del",
  moveImages: "/cloudinaries/images/mov",
  login: "/auth/login",
  logout: "/auth/logout",
  getMe: "/auth/me",
  saveAssetToDB: "/cloudinaries/save",
  clearCachedData: "/redisCloud/flush-db",
};

// ======================================================
// 🔐 AUTH API (Bearer Token)
// ======================================================
export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ✅ REQUEST INTERCEPTOR → AUTO ATTACH TOKEN
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR → AUTO HANDLE 401
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized - token expired or invalid");

      // ❌ clear token
      localStorage.removeItem("accessToken");

      // 👉 redirect login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// ======================================================
// 🌐 PUBLIC API (NO AUTH)
// ======================================================
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
