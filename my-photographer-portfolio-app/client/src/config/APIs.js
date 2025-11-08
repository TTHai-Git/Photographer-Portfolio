import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const endpoints = {
  getImages: "/cloudinaries",
};
export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 0,
  withCredentials: true, // ✅ for login/register/etc
});
