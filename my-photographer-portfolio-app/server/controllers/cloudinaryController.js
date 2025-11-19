import cloudinary from "../config/cloudinary.config.js";
import { getOrSetCachedData } from "./redisCloudControllers.js";

export const getImagesOnCloudinary = async (req, res) => {
  try {
    const { folder } = req.query;
    if (!folder) {
      return res.status(400).json({ error: "Folder is required" });
    } else {
      const cacheKey = `GET:/v1/cloudinaries?folder=${folder}`;
      const cachedData = await getOrSetCachedData(cacheKey, async () => {
        const result = await cloudinary.api.resources({
          type: "upload",
          prefix: `${folder}/`,
          max_results: 500,
        });

        const images = result.resources.map((img) => {
          const optimizedUrl = cloudinary.url(img.public_id, {
            secure: true,
            fetch_format: "auto",
            quality: "auto",
            transformation: [{ width: "auto", crop: "limit" }, { dpr: "auto" }],
          });

          return {
            public_id: img.public_id,
            optimized_url: optimizedUrl,
          };
        });

        return { images };
      });

      return res.status(200).json(cachedData);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
