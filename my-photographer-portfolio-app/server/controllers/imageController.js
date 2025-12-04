import FolderOfCloudinary from "../models/folderModel.js";
import ImageOfCloudinary from "../models/imageModel.js";
import { getOrSetCachedData } from "./redisCloudControllers.js";

export const createImages = async (data, folder) => {
  try {
    // Get folder ID
    const folderDoc = await FolderOfCloudinary.findOne({ path: folder }).select(
      "_id"
    );

    if (!folderDoc) {
      return { success: false, message: "Folder not found in DB" };
    }

    // Insert images
    for (const item of data) {
      await ImageOfCloudinary.create({
        public_id: item.public_id,
        optimized_url: item.url,
        folderOfCloudinary: folderDoc._id,
      });
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const deletedImages = async (public_ids) => {
  try {
    await ImageOfCloudinary.deleteMany({ public_id: { $in: public_ids } });
    return { success: true };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getImages = async (req, res) => {
  try {
    const path = req.query.path;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const sortKey = req.query.sortImages || "latest";

    if (!path) {
      return res.status(400).json({ message: "Missing folder path" });
    }

    const cacheKey = `GET:/v1/images?path=${path}&page=${page}&limit=${limit}&sort=${sortKey}`;

    const data = await getOrSetCachedData(cacheKey, async () => {
      const folder = await FolderOfCloudinary.findOne({ path }).select("_id");
      if (!folder) return null; // không return res.json() ở đây

      const sortOption = {
        latest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        az: { public_id: 1 },
        za: { public_id: -1 },
      }[sortKey] || { createdAt: -1 };

      const images = await ImageOfCloudinary.find({
        folderOfCloudinary: folder._id,
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await ImageOfCloudinary.countDocuments({
        folderOfCloudinary: folder._id,
      });

      return {
        images,
        current: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      };
    });

    if (!data) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ getImages error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
