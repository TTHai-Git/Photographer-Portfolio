import cloudinary from "../config/cloudinary.config.js";
import { getOrSetCachedData } from "./redisCloudControllers.js";

export const getImagesOnCloudinary = async (req, res) => {
  try {
    // console.log("in");
    const { folder } = req.query; // ví dụ ?folder=Hoang-Truc-Photographer-Portfolio
    const cacheKey = `GET:/v1/cloudinaries?folder=${folder}`;

    // console.log("folder:", folder);

    if (!folder) {
      return res.status(400).json({ message: "Folder is required" });
    }

    const cachedData = await getOrSetCachedData(cacheKey, async () => {
      // Gọi Cloudinary API
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: `${folder}/`,
        max_results: 500, // tối đa Cloudinary cho phép
      });

      // console.log("Cloudinary Result:", result);

      // Nếu muốn chỉ lấy link ảnh:
      const images = result.resources.map((img) => {
        const segments = img.public_id.split("/"); // tách theo folder path
        const fileName = segments[segments.length - 1]; // lấy phần cuối

        return {
          asset_id: img.asset_id,
          file_name: fileName, // ✅ tên file bạn muốn
          url: img.secure_url,
        };
      });
      return {
        count: images.length,
        images,
      };
    });

    res.status(200).json(cachedData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
