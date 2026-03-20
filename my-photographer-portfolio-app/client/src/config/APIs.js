import axios from "axios";

const BASE_URL = "";

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
  refreshToken: "/auth/refresh-token"
};

// ======================================================
// 🔐 AUTH API (Bearer Token)
// ======================================================
export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true
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
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR → AUTO HANDLE 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🛠 KHAI BÁO BIẾN NÀY ĐỂ HẾT LỖI "NOT DEFINED"
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== endpoints.refreshToken // Tránh lặp vô tận nếu chính api refresh cũng lỗi
    ) {
      originalRequest._retry = true;

      try {
        // Gọi API lấy token mới
        const res = await authApi.post(endpoints.refreshToken);
        const newAccessToken = res.data.accessToken;

        // Lưu lại vào localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ Gán token mới vào header của request cũ để thử lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // Nếu refresh thất bại (ví dụ cookie hết hạn 7 ngày) -> Logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ======================================================
// 🌐 PUBLIC API (NO AUTH)
// ======================================================
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
