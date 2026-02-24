import cloudinary from "../config/cloudinary.config.js";
import getRedisClient from "../config/redisCloud.config.js";
import { compressToWebp } from "../helpers/imageCompression.js";
import FolderOfCloudinary from "../models/folderModel.js";
import ImageOfCloudinary from "../models/imageModel.js";
import { createFolder, deleteFolders } from "./folderController.js";
import { createImages, deletedImages } from "./imageController.js";
import {
  clearCacheByKeyword,
  getOrSetCachedData,
} from "./redisCloudControllers.js";
import streamifier from "streamifier";

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
//               optimized_url: optimizedUrl,
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

export const saveImages = async (req, res) => {
  try {
    const { images, folder } = req.body;

    if (!images || !images.length) {
      return res.status(400).json({ message: "No images!" });
    }

    const result = await createImages(images, folder);

    return res.status(201).json({
      success: true,
      message: "Lưu DB thành công",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi lưu DB",
    });
  } finally {
    await getRedisClient.flushAll();
  }
};

export const handleDeleteImages = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const public_ids = req.body.public_ids;

    if (!public_ids || public_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Chưa cung cấp public_ids của các ảnh để xóa!" });
    }

    // Delete Images Onto Cloudinary
    const result = await cloudinary.api.delete_resources(public_ids);

    // Delete Images Into DB
    const resultsOfDB = await deletedImages(public_ids);

    if (!resultsOfDB.success)
      return resultsOfDB
        .status(500)
        .json({ message: "Xóa ảnh trong DB thất bại!" });

    // clearCacheByKeyword(`GET:/v1/images?path=${selectedFolder}`);
    await getRedisClient.flushAll();

    return res.status(200).json({
      message: "Xóa ảnh thành công.",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Xóa ảnh thất bại!" });
  }
};

export const handleDeleteFolders = async (req, res) => {
  try {
    // console.log("req.body.folderDirs", req.body.folderDirs);
    const folderDirs = req.body.folderDirs;

    if (!folderDirs || folderDirs.length === 0) {
      return res.status(400).json({
        message: "Thiếu thông tin đường dẫn thư mục hoặc tên thư mục!",
      });
    }

    // delete folders onto Cloudinary
    for (const folderPrefix of folderDirs) {
      const deleteRes =
        await cloudinary.api.delete_resources_by_prefix(folderPrefix);

      // Optionally delete folder metadata:
      await cloudinary.api.delete_folder(folderPrefix).catch(() => {});
    }

    // handle delete folders into DB
    const resultsOfDB = await deleteFolders(folderDirs);

    if (!resultsOfDB.success)
      return resultsOfDB
        .status(500)
        .json({ message: "Xóa thư mục trong DB thất bại!" });

    // clearCacheByKeyword("GET:/v1/folders?");
    await getRedisClient.flushAll();

    return res.status(200).json({
      message: "Xóa thư mục thành công.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Xóa thư mục thất bại!" });
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

    await getRedisClient.flushAll();

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

export const handleMoveImage = async (oldPublicId, newFolder) => {
  const fileName = oldPublicId.split("/").pop();
  const newPublicId = `${newFolder}/${fileName}`;

  try {
    // 1. Move on Cloudinary
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);

    return {
      success: true,
      oldPublicId,
      newPublicId,
      secure_url: result.secure_url,
    };
  } catch (err) {
    return { success: false, oldPublicId, error: err.message };
  }
};

export const handleMoveImages = async (req, res) => {
  try {
    const { oldPublicIds, newFolder } = req.body;

    if (!oldPublicIds || !newFolder)
      return res.status(400).json({ message: "Bad request" });

    // Move on Cloudinary
    const moveResults = await Promise.all(
      oldPublicIds.map((id) => handleMoveImage(id, newFolder)),
    );

    // Update Database
    const newFolderDoc = await FolderOfCloudinary.findOne({ path: newFolder });

    if (!newFolderDoc) {
      return res.status(404).json({
        message: "New folder does not exist in database",
      });
    }

    // Loop through results and update DB
    for (const item of moveResults) {
      if (!item.success) continue;

      await ImageOfCloudinary.findOneAndUpdate(
        { public_id: item.oldPublicId },
        {
          public_id: item.newPublicId,
          optimized_url: item.secure_url,
          folderOfCloudinary: newFolderDoc._id,
        },
      );
    }

    // Clear redis
    const oldDir = oldPublicIds[0].substring(
      0,
      oldPublicIds[0].lastIndexOf("/"),
    );

    // clearCacheByKeyword(`GET:/v1/images?path=${oldDir}`);
    // clearCacheByKeyword(`GET:/v1/images?path=${newFolder}`);

    await getRedisClient.flushAll();

    const hasError = moveResults.some((r) => !r.success);

    return res.status(hasError ? 207 : 200).json({
      message: hasError
        ? "Một số ảnh không thể di chuyển!"
        : `Di chuyển toàn bộ ảnh sang thư mục ${newFolder} thành công!`,
      results: moveResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server has error" });
  }
};
