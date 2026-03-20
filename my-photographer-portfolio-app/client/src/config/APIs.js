import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "/v1"
    : process.env.REACT_APP_BASE_URL;

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

    // Nếu lỗi 401 và không phải là request refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== endpoints.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        // Chỉ cần gọi API, Server sẽ tự đọc Refresh Cookie và set lại Access Cookie mới
        await authApi.post(endpoints.refreshToken);

        // Sau khi refresh thành công, gọi lại request cũ
        // Lúc này trình duyệt đã có Cookie mới nên sẽ không bị 401 nữa
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (hết hạn cả refresh token) -> Đá về login
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
