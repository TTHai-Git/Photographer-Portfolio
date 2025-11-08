import cloudinary from "cloudinary";
import "./dotenv.config.js"; // load env variables

cloudinary.v2.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary.v2;
