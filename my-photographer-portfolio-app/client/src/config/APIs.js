import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const endpoints = {
  getImages: "/cloudinaries",
  getImagesFromDB: "/images",
  getFoldersFromDB: "/folders",
  getFolders: "/cloudinaries/get-folders",
  createFolder: "/cloudinaries/folders/cre",
  deleteFolders: "/cloudinaries/folders/del",
  upload: "/cloudinaries/upload",
  deleteImages: "/cloudinaries/images/del",
  moveImages: "/cloudinaries/images/mov",
  login: "/auth/login",
  logout: "/auth/logout",
  getMe: "/auth/me",
  refreshToken: "/auth/refresh-token",
};

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true, // ✅ cookies included in all calls
});

// Add interceptor
authApi.interceptors.response.use(
  (response) => response, // pass through if successful
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          endpoints.refreshToken,
          {},
          {
            baseURL: BASE_URL,
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          // Retry original request
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Optional: redirect to login or show error
      }
    }

    return Promise.reject(error);
  }
);

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 0,
  // withCredentials: true,
});
