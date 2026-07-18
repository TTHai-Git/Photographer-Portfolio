import Folder from "../models/folderModel.js";
import Asset from "../models/assetModel.js";
import {
  clearCacheByKeyword,
  clearRelatedCaches,
  getOrSetCachedData
} from "./redisCloudControllers.js";
import Tag from "../models/tagModel.js";

export const getEachImageOfEachFolder = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // limit folder per page
  const sort = req.query.sort || "order-increasing";
  const tags = req.query.tags || "";
  const path = req.query.path || "";

  try {
    const cachedKey = `GET:/v1/images/get-each-image-of-each-folder?page=${page}&limit=${limit}&sort=${sort}&path=${path}&tags=${tags}`;
    const sortOption = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      az: { path: 1 },
      za: { path: -1 },
      "order-increasing": { order: 1 },
      "order-decreasing": { order: -1 }
    }[sort] || { createdAt: -1 };

    const cachedData = await getOrSetCachedData(cachedKey, async () => {
      // ==========================
      // ĐẾM TẤT CẢ FOLDER
      // ==========================
      const totalFolders = await Folder.countDocuments({
        path: { $regex: `^${path}` }
      });

      // ==========================
      // LẤY FOLDER THEO TRANG
      // ==========================
      const folders = await Folder.find({
        path: { $regex: `^${path}` }
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .select("_id");
      const result = [];

      // ==========================
      // LẤY ẢNH ĐẠI DIỆN CHO MỖI FOLDER
      // ==========================
      let tagIds = [];
      if (tags) {
        // Hỗ trợ truyền vào nhiều tag cách nhau bằng dấu phẩy (VD: "Trending,Wedding")
        const tagNames = tags.split(",").map((t) => t.trim());
        const tagDocs = await Tag.find({ name: { $in: tagNames } }).select(
          "_id"
        );
        tagIds = tagDocs.map((doc) => doc._id);
      }

      for (const folder of folders) {
        const query = { folder: folder._id };

        // Trong MongoDB, field tags là 1 mảng. Khi query { tags: { $in: tagIds } },
        // MongoDB sẽ tự động tìm các ảnh có ít nhất 1 tag (trong mảng tags của ảnh) nằm trong mảng tagIds.
        if (tagIds.length > 0) {
          query.tags = { $in: tagIds };
        }

        const image = await Asset.findOne(query)
          .sort(sortOption)
          .populate("folder");

        if (image) {
          result.push(image);
        }
      }

      return { result, totalFolders };
    });

    return res.status(200).json({
      images: cachedData.result,
      current: page,
      totalPages: Math.ceil(cachedData.totalFolders / limit),
      totalItems: cachedData.totalFolders
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
    const limit = parseInt(req.query.limit) || 10;
    const sortKey = req.query.sort || "latest";

    const tags = req.query.tags || "";

    if (!path) {
      return res.status(400).json({ message: "Missing folder path" });
    }

    const cacheKey = `GET:/v1/images?page=${page}&limit=${limit}&sort=${sortKey}&path=${path}&tags=${tags}`;

    const data = await getOrSetCachedData(cacheKey, async () => {
      const folder = await Folder.findOne({ path }).select("_id");
      if (!folder) return null; // không return res.json() ở đây

      const sortOption = {
        latest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        az: { public_id: 1 },
        za: { public_id: -1 }
      }[sortKey] || { createdAt: -1 };

      let tagIds = [];
      if (tags) {
        const tagNames = tags.split(",").map((t) => t.trim());
        const tagDocs = await Tag.find({ name: { $in: tagNames } }).select(
          "_id"
        );
        tagIds = tagDocs.map((doc) => doc._id);
      }

      const query = { folder: folder._id };
      if (tagIds.length > 0) {
        query.tags = { $in: tagIds };
      }

      const images = await Asset.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("tags");

      const totalItems = await Asset.countDocuments(query);

      return {
        images,
        current: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      };
    });

    // console.log("❇️ getImages data:", data);

    if (!data) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ getImages error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const replaceAllTagsForAssets = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { tags, selectedFolder } = req.body;
    const asset = await Asset.findByIdAndUpdate(
      assetId,
      {
        $set: {
          tags
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    // Clear cache BEFORE sending response
    await clearRelatedCaches(`${selectedFolder}`);
    return res
      .status(200)
      .json({ message: "Tags replaced successfully", data: asset });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addMoreTagsForAssets = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { tags, selectedFolder } = req.body;
    console.log("selectedFolder", selectedFolder);
    const asset = await Asset.findByIdAndUpdate(
      assetId,
      {
        $addToSet: {
          tags: {
            $each: tags
          }
        }
      },
      {
        new: true
      }
    );
    await clearRelatedCaches(`${selectedFolder}`);
    return res
      .status(200)
      .json({ message: "Tags added successfully", data: asset });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeTagsForAssets = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { tags, selectedFolder } = req.body;
    const asset = await Asset.findByIdAndUpdate(
      assetId,
      {
        $pull: {
          tags: {
            $in: tags
          }
        }
      },
      {
        new: true
      }
    );
    await clearRelatedCaches(`${selectedFolder}`);
    return res
      .status(200)
      .json({ message: "Tags removed successfully", data: asset });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
