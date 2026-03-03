import Folder from "../models/folderModel.js";
import Asset from "../models/assetModel.js";
import { getOrSetCachedData } from "./redisCloudControllers.js";

export const getEachImageOfEachFolder = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50; // limit folder per page
  const sort = req.query.sort || "latest";
  const path = req.query.path || "";

  try {
    const cachedKey = `GET:/v1/images/get-each-image-of-each-folder?page=${page}&limit=${limit}&sort=${sort}&path=${path}`;
    const sortOption = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      az: { path: 1 },
      za: { path: -1 },
    }[sort] || { createdAt: -1 };

    const cachedData = await getOrSetCachedData(cachedKey, async () => {
      // ==========================
      // ĐẾM TẤT CẢ FOLDER
      // ==========================
      const totalFolders = await Folder.countDocuments({
        path: { $regex: `^${path}` },
      });

      // ==========================
      // LẤY FOLDER THEO TRANG
      // ==========================
      const folders = await Folder.find({
        path: { $regex: `^${path}` },
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .select("_id");
      const result = [];

      // ==========================
      // LẤY ẢNH ĐẠI DIỆN CHO MỖI FOLDER
      // ==========================
      for (const folder of folders) {
        const image = await Asset.findOne({
          folder: folder._id,
        })
          .sort(sortOption)
          .populate("folder");

        result.push(image);
      }

      return { result, totalFolders };
    });

    return res.status(200).json({
      images: cachedData.result,
      current: page,
      totalPages: Math.ceil(cachedData.totalFolders / limit),
      totalItems: cachedData.totalFolders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deletedImages = async (public_ids) => {
  try {
    await Asset.deleteMany({ public_id: { $in: public_ids } });
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
    const sortKey = req.query.sort || "latest";

    if (!path) {
      return res.status(400).json({ message: "Missing folder path" });
    }

    const cacheKey = `GET:/v1/images?page=${page}&limit=${limit}&sort=${sortKey}&path=${path}`;

    const data = await getOrSetCachedData(cacheKey, async () => {
      const folder = await Folder.findOne({ path }).select("_id");
      if (!folder) return null; // không return res.json() ở đây

      const sortOption = {
        latest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        az: { public_id: 1 },
        za: { public_id: -1 },
      }[sortKey] || { createdAt: -1 };

      const images = await Asset.find({
        folder: folder._id,
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await Asset.countDocuments({
        folder: folder._id,
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
