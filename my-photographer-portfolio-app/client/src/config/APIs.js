import axios from "axios";

const BASE_URL = "/v1";

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
// ✅ RESPONSE INTERCEPTOR → Xử lý khi Token hết hạn (401)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isTokenExpired = error.response?.data?.tokenExpired === true;

    // Chỉ thử refresh khi: lỗi 401 + token hết hạn + chưa retry + không phải chính request refresh
    if (
      error.response?.status === 401 &&
      isTokenExpired &&
      !originalRequest._retry &&
      originalRequest.url !== endpoints.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        // Server tự đọc refreshToken cookie và set lại accessToken cookie mới
        await authApi.post(endpoints.refreshToken);

        // Gọi lại request gốc, trình duyệt sẽ tự gửi cookie mới
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (refreshToken hết hạn) → redirect login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 401 mà token KHÔNG hết hạn (chưa login) → KHÔNG redirect, để AuthContext tự xử lý
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
