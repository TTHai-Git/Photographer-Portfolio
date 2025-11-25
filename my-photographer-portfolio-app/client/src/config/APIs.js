import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const endpoints = {
  getImages: "/cloudinaries",
  getFolders: "/cloudinaries/get-folders",
  createFolder: "/cloudinaries/folders/cre",
  deleteFolders: "/cloudinaries/folders/del",
  upload: "/cloudinaries/upload",
  deleteImages: "/cloudinaries/images/del",
};
export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 0,
  withCredentials: true, // ✅ for login/register/etc
});
