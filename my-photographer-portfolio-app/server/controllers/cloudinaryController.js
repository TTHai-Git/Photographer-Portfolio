import cloudinary from "../config/cloudinary.config.js";
import { compressToWebp } from "../helpers/imageCompression.js";
import Folder from "../models/folderModel.js";
import Asset from "../models/assetModel.js";
import { createFolder, deleteFolders } from "./folderController.js";
import { deletedImages } from "./imageController.js";
import {
  clearCacheByKeyword,
  clearRelatedCaches,
  getOrSetCachedData,
} from "./redisCloudControllers.js";
import streamifier from "streamifier";
import getRedisClient from "../config/redisCloud.config.js";

// export const getImagesOnCloudinary = async (req, res) => {
//   try {
//     const { folder } = req.query;
//     if (!folder) {
//       return res.status(400).json({ error: "Folder is required" });
//     } else {
//       const cacheKey = `GET:/v1/cloudinaries?folder=${folder}`;
//       const cachedData = await getOrSetCachedData(
//         cacheKey,
//         async () => {
//           const result = await cloudinary.api.resources({
//             type: "upload",
//             prefix: `${folder}/`,
//             max_results: 500,
//           });

//           const images = result.resources.map((img) => {
//             const optimizedUrl = cloudinary.url(img.public_id, {
//               secure: true,
//               fetch_format: "auto",
//               quality: "auto",
//               transformation: [
//                 { width: "auto", crop: "limit" },
//                 { dpr: "auto" },
//               ],
//             });

//             return {
//               public_id: img.public_id,
//               secure_url: optimizedUrl,
//             };
//           });

//           return { images };
//         },
//         3600
//       );

//       return res.status(200).json(cachedData);
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };

// // 🟩 Hàm recursive để lấy toàn bộ thư mục
// async function getAllFoldersOnCloudinary(path = "") {
//   const folders = await cloudinary.api.sub_folders(path);
//   let results = folders.folders.map((f) => f.path);

//   for (const folder of folders.folders) {
//     const subfolders = await getAllFoldersOnCloudinary(folder.path);
//     results = [...results, ...subfolders];
//   }

//   return results;
// }

// export const getFoldersOnCloudinary = async (req, res) => {
//   try {
//     const cacheKey = "GET:/v1/cloudinaries/get-folders";
//     const root = "Hoang-Truc-Photographer-Portfolio";

//     const cachedData = await getOrSetCachedData(
//       cacheKey,
//       async () => {
//         const folders = await getAllFoldersOnCloudinary(root);
//         return { folders };
//       },
//       3600
//     );

//     return res.status(200).json(cachedData);
//   } catch (err) {
//     console.error("Error loading Cloudinary folders:", err);
//     return res
//       .status(500)
//       .json({ message: "Không thể tải danh sách các thư mục!" });
//   }
// };

// export const uploadImagesOnToCloudinary = async (req, res) => {
//   try {
//     const folder = req.body.folder || "uploads";
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "Missing images to upload!" });
//     }

//     const uploadedData = [];

//     for (const file of req.files) {
//       // compress to webp
//       const compressed = await compressToWebp(file.buffer);

//       // upload
//       const uploaded = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder,
//             resource_type: "image",
//             format: "webp",
//             quality: "auto",
//             transformation: [{ width: "auto", crop: "limit" }, { dpr: "auto" }],
//             // fetch_format: "auto",
//           },
//           (err, result) => (err ? reject(err) : resolve(result)),
//         );

//         streamifier.createReadStream(compressed).pipe(uploadStream);
//       });

//       uploadedData.push({
//         public_id: uploaded.public_id,
//         url: uploaded.secure_url,
//       });
//     }

//     // save to DB
//     const resultsOfDB = await createImages(uploadedData, folder);

//     if (!resultsOfDB.success)
//       return resultsOfDB
//         .status(500)
//         .json({ message: "Lưu ảnh vào DB thất bại!" });

//     return res.status(201).json({
//       message: "Tải ảnh lên thành công!",
//       images: uploadedData,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Tải ảnh thất bại" });
//   } finally {
//     await getRedisClient.flushAll();
//   }
// };

export const saveAssets = async (req, res) => {
  const { assets, folder } = req.body;

  if (!assets || !assets.length) {
    return res.status(400).json({ message: "No assets!" });
  }

  try {
    // Get folder ID
    const folderDoc = await Folder.findOne({ path: folder });

    if (!folderDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found in DB" });
    }

    // Insert images
    for (const item of assets) {
      await Asset.create({
        public_id: item.public_id,
        original_filename: item.original_filename,
        secure_url: item.secure_url,
        // secure_url: item.url,
        resource_type: item.resource_type || "image",
        bytes: item.bytes,
        format: item.format,
        resolution: item.resolution || "1920x1080",
        folder: folderDoc._id,
        videoMeta: item.videoMeta || null,
      });
    }

    // Clear cache BEFORE sending response
    await clearRelatedCaches(`${folderDoc.path}`);

    return res.status(201).json({
      success: true,
      message: "Lưu DB thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lưu DB thất bại",
      error: error.message,
    });
  }
};

export const handleDeleteImages = async (req, res) => {
  try {
    const { public_ids, selectedFolder } = req.body;

    if (!public_ids || public_ids.length === 0) {
      return res.status(400).json({
        message: "Chưa cung cấp public_ids của các assets để xóa!",
      });
    }

    // 1️⃣ Lấy toàn bộ asset 1 lần
    const assets = await Asset.find({
      public_id: { $in: public_ids },
    }).select("public_id resource_type");

    if (!assets.length) {
      return res.status(404).json({
        message: "Không tìm thấy asset nào!",
      });
    }

    // 2️⃣ Group theo resource_type
    const grouped = assets.reduce((acc, asset) => {
      if (!acc[asset.resource_type]) {
        acc[asset.resource_type] = [];
      }
      acc[asset.resource_type].push(asset.public_id);
      return acc;
    }, {});

    const cloudinaryResults = {};

    // 3️⃣ Delete theo từng resource_type
    for (const [resource_type, ids] of Object.entries(grouped)) {
      const result = await cloudinary.api.delete_resources(ids, {
        resource_type,
      });
      cloudinaryResults[resource_type] = result;
    }

    // 4️⃣ Delete DB
    const resultsOfDB = await deletedImages(public_ids);

    if (!resultsOfDB.success) {
      return res.status(500).json({
        message: "Xóa assets trong DB thất bại!",
      });
    }

    // Clear cache BEFORE sending response
    await clearRelatedCaches(`${selectedFolder}`);

    return res.status(200).json({
      message: "Xóa assets thành công.",
      cloudinaryResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Xóa assets thất bại!",
    });
  }
};

export const handleDeleteFolders = async (req, res) => {
  try {
    const folderDirs = req.body.folderDirs;

    if (!folderDirs || folderDirs.length === 0) {
      return res.status(400).json({
        message: "Thiếu thông tin đường dẫn thư mục!",
      });
    }

    for (const folderPrefix of folderDirs) {
      const folderDoc = await Folder.findOne({ path: folderPrefix });

      if (!folderDoc) continue;

      // kiểm tra có asset không
      const assetCount = await Asset.countDocuments({
        folder: folderDoc._id,
      });

      // nếu có asset
      if (assetCount > 0) {
        await Promise.all([
          cloudinary.api.delete_resources_by_prefix(folderPrefix, {
            resource_type: "image",
          }),
          cloudinary.api.delete_resources_by_prefix(folderPrefix, {
            resource_type: "video",
          }),
        ]);
      }

      // xoá folder cloudinary (dù có asset hay không)
      await cloudinary.api.delete_folder(folderPrefix).catch(() => {});
    }

    // xoá DB
    const resultsOfDB = await deleteFolders(folderDirs);

    if (!resultsOfDB.success) {
      return res.status(500).json({
        message: "Xóa thư mục trong DB thất bại!",
      });
    }

    await clearRelatedCaches("GET:/v1/folders");

    return res.status(200).json({
      message: "Xóa thư mục thành công.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Xóa thư mục thất bại!",
    });
  }
};

export const handleCreateFolder = async (req, res) => {
  try {
    const { rootDir, folderName } = req.body;

    if (!rootDir || !folderName) {
      return res.status(400).json({
        message: "Thiếu thông tin đường dẫn thư mục hoặc tên thư mục!",
      });
    }

    const folderPath = `${rootDir}/${folderName}`;

    // ======= CHECK FOLDER EXISTS ==========
    const parentDir = rootDir; // thư mục cha

    // Lấy danh sách subfolders
    const existing = await cloudinary.api.sub_folders(parentDir);

    const isExist = existing.folders.some(
      (f) => f.name.toLowerCase() === folderName.toLowerCase(),
    );

    if (isExist) {
      return res.status(409).json({
        message: "Thư mục đã tồn tại trên Cloudinary!",
        folderPath,
      });
    }
    // =======================================

    // Tạo folder trên Cloudinary
    const result = await cloudinary.api.create_folder(folderPath);

    // Tạo folder trong DB
    const resultOfDB = await createFolder(folderPath);
    if (!resultOfDB.success) {
      return res
        .status(500)
        .json({ message: "Tạo thư mục trong DB thất bại!" });
    }

    // Clear cache BEFORE sending response
    await clearRelatedCaches("GET:/v1/folders");

    return res.status(201).json({
      message: "Tạo thư mục thành công.",
      folderPath,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Tạo thư mục thất bại!" });
  }
};

export const handleMoveImages = async (req, res) => {
  try {
    const { oldPublicIds, newFolder, oldFolder } = req.body;

    if (!oldPublicIds || !newFolder)
      return res.status(400).json({ message: "Bad request" });

    // 1️⃣ Lấy toàn bộ asset 1 lần
    const assets = await Asset.find({
      public_id: { $in: oldPublicIds },
    }).select("public_id resource_type");

    if (!assets.length) {
      return res.status(404).json({
        message: "Assets not found",
      });
    }

    // 2️⃣ Move trên Cloudinary (song song)
    const moveResults = await Promise.all(
      assets.map((asset) =>
        handleMoveAsset(asset.public_id, newFolder, asset.resource_type),
      ),
    );

    // 3️⃣ Lấy folder mới
    const newFolderDoc = await Folder.findOne({ path: newFolder });

    if (!newFolderDoc) {
      return res.status(404).json({
        message: "New folder does not exist in database",
      });
    }

    // 4️⃣ Bulk update DB (tối ưu hơn loop)
    const bulkOps = moveResults
      .filter((item) => item.success)
      .map((item) => ({
        updateOne: {
          filter: { public_id: item.oldPublicId },
          update: {
            public_id: item.newPublicId,
            secure_url: item.secure_url,
            folder: newFolderDoc._id,
          },
        },
      }));

    if (bulkOps.length > 0) {
      await Asset.bulkWrite(bulkOps);
    }

    const hasError = moveResults.some((r) => !r.success);
    const hasSuccess = moveResults.some((r) => r.success);

    // Clear cache ONLY if at least one file was moved successfully
    if (hasSuccess) {
      await clearRelatedCaches(`${newFolder}`, `${oldFolder}`);
    }

    return res.status(hasError ? 207 : 200).json({
      message: hasError
        ? "Một số file không thể di chuyển!"
        : `Di chuyển toàn bộ file sang thư mục ${newFolder} thành công!`,
      results: moveResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server has error" });
  }
};

const handleMoveAsset = async (oldPublicId, newFolder, resource_type) => {
  const fileName = oldPublicId.split("/").pop();
  const newPublicId = `${newFolder}/${fileName}`;

  try {
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
      resource_type, // 🔥 QUAN TRỌNG
    });

    return {
      success: true,
      oldPublicId,
      newPublicId,
      secure_url: result.secure_url,
      resource_type,
    };
  } catch (err) {
    return {
      success: false,
      oldPublicId,
      resource_type,
      error: err.message,
    };
  }
};
