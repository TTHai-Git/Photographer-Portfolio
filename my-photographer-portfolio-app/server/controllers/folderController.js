import Folder from "../models/folderModel.js";
import Asset from "../models/assetModel.js";
import {
  clearRelatedCaches,
  getOrSetCachedData
} from "./redisCloudControllers.js";

export const createFolders = async (req, res) => {
  try {
    for (const folder of req.body.folders) {
      await Folder.create(folder);
    }
    return res.status(200).json({ message: "Create Folders Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createFolder = async (path) => {
  try {
    if (!path) return;
    // create Folder into DB
    const newFolder = await Folder.create({ path: path });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const deleteFolders = async (folderDirs) => {
  try {
    for (const folderDir of folderDirs) {
      const folder = await Folder.findOne({ path: folderDir });

      if (!folder) continue;

      const assetCount = await Asset.countDocuments({
        folder: folder._id
      });

      // nếu có asset → xoá asset DB
      if (assetCount > 0) {
        await Asset.deleteMany({
          folder: folder._id
        });
      }

      // xoá folder
      await Folder.findByIdAndDelete(folder._id);

      await clearRelatedCaches(`$${folderDir}`);
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
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";
    const sortKey = req.query.sort || "latest";

    const filter = {};

    if (search.trim() !== "") {
      filter.path = { $regex: search, $options: "i" };
    }

    const sortOption = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      az: { path: 1 },
      za: { path: -1 }
    }[sortKey] || { createdAt: -1 };

    const fetchFolders = async () => {
      const folders = await Folder.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await Folder.countDocuments(filter);

      return {
        folders,
        current: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      };
    };

    const cacheKey = `GET:/v1/folders?page=${page}&limit=${limit}&search=${search}&sort=${sortKey}`;

    const data = await getOrSetCachedData(cacheKey, fetchFolders);

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ getFolders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFoldersForCombobox = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ path: 1 });

    return res.json({ folders });
  } catch (err) {
    console.error("❌ getFolders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
