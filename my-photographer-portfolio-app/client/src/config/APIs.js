import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
// 🔐 AUTH API (USE FOR LOGIN / AUTH REQUIRED REQUESTS)
// ======================================================
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ BẮT BUỘC để gửi cookie
  timeout: 30000,
});

// ✅ Request interceptor
authApi.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };

    return config;
  },
  (error) => Promise.reject(error),
);

// ❌ KHÔNG DÙNG REFRESH TOKEN NỮA
// 👉 Nếu 401 → để backend xử lý hoặc frontend redirect login

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - please login again");

      // 👉 Optional: redirect login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// ======================================================
// 🌐 PUBLIC API (NO AUTH)
// ======================================================
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ vẫn bật để nhận cookie nếu server set
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
