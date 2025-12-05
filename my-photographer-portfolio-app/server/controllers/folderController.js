import FolderOfCloudinary from "../models/folderModel.js";
import ImageOfCloudinary from "../models/imageModel.js";
import { getOrSetCachedData } from "./redisCloudControllers.js";

export const createFolders = async (req, res) => {
  try {
    for (const folder of req.body.folders) {
      await FolderOfCloudinary.create(folder);
    }
    return res.status(200).json({ message: "Create Folders Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteFolders = async (folderDirs) => {
  try {
    for (const folderDir of folderDirs) {
      // 1. Lấy folder cần xoá
      const folder = await FolderOfCloudinary.findOne({ path: folderDir });

      if (!folder) continue;

      // 2. Xoá toàn bộ ảnh thuộc folder
      await ImageOfCloudinary.deleteMany({
        folderOfCloudinary: folder._id,
      });

      // 3. Xoá folder
      await FolderOfCloudinary.findByIdAndDelete(folder._id);
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const getFolders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;

    const search = req.query.search || "";
    const sortKey = req.query.sort || "latest";

    const cacheKey = `GET:/v1/folders?page=${page}&limit=${limit}&search=${search}&sort=${sortKey}`;

    const data = await getOrSetCachedData(cacheKey, async () => {
      const filter = {};

      if (search.trim() !== "") {
        filter.path = { $regex: search, $options: "i" };
      }

      const sortOption = {
        latest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        az: { path: 1 },
        za: { path: -1 },
      }[sortKey] || { createdAt: -1 };

      const folders = await FolderOfCloudinary.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await FolderOfCloudinary.countDocuments(filter);

      return {
        folders,
        current: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      };
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ getFolders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
