import cloudinary from "../config/cloudinary.config.js";
import { checkAdminPassword } from "../helpers/HandlePasswordOfAdmin.js";
import { compressToWebp } from "../helpers/imageCompression.js";
import {
  clearCacheByKeyword,
  getOrSetCachedData,
} from "./redisCloudControllers.js";
import streamifier from "streamifier";

export const getImagesOnCloudinary = async (req, res) => {
  try {
    const { folder } = req.query;
    if (!folder) {
      return res.status(400).json({ error: "Folder is required" });
    } else {
      const cacheKey = `GET:/v1/cloudinaries?folder=${folder}`;
      const cachedData = await getOrSetCachedData(
        cacheKey,
        async () => {
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
              transformation: [
                { width: "auto", crop: "limit" },
                { dpr: "auto" },
              ],
            });

            return {
              public_id: img.public_id,
              optimized_url: optimizedUrl,
            };
          });

          return { images };
        },
        3600
      );

      return res.status(200).json(cachedData);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// 🟩 Hàm recursive để lấy toàn bộ thư mục
async function getAllFoldersOnCloudinary(path = "") {
  const folders = await cloudinary.api.sub_folders(path);
  let results = folders.folders.map((f) => f.path);

  for (const folder of folders.folders) {
    const subfolders = await getAllFoldersOnCloudinary(folder.path);
    results = [...results, ...subfolders];
  }

  return results;
}

// 🟩 Controller API
export const getAllFolders = async (req, res) => {
  try {
    const cacheKey = "GET:/v1/cloudinaries/get-folders";
    const root = "Hoang-Truc-Photographer-Portfolio";

    const cachedData = await getOrSetCachedData(
      cacheKey,
      async () => {
        const folders = await getAllFoldersOnCloudinary(root);
        return { folders };
      },
      3600
    );

    return res.status(200).json(cachedData);
  } catch (err) {
    console.error("Error loading Cloudinary folders:", err);
    return res
      .status(500)
      .json({ message: "Không thể tải danh sách các thư mục!" });
  }
};

export const uploadImagesOnToCloudinary = async (req, res) => {
  try {
    const folder = req.body.folder || "uploads";
    const password = req.body.password;

    // Validate ảnh
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Thiếu ảnh để tải lên!" });
    }

    // Check quyền upload
    const isValidPassword = await checkAdminPassword(password);
    if (!isValidPassword) {
      return res.status(403).json({
        message: "Bạn không phải là Admin nên không thể tải ảnh lên được!",
      });
    }

    const urls = [];

    // Upload từng ảnh
    for (const file of req.files) {
      // Bước 1: Nén & tối ưu WebP
      const compressed = await compressToWebp(file.buffer);

      // Bước 2: Upload lên Cloudinary
      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            format: "webp",

            // bật auto optimize của Cloudinary
            quality: "auto",
            fetch_format: "auto",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );

        streamifier.createReadStream(compressed).pipe(uploadStream);
      });

      urls.push(uploaded.secure_url);
    }

    // Clear cache Redis
    clearCacheByKeyword(`GET:/v1/cloudinaries?folder=${folder}`);

    return res.status(201).json({
      message: "Tải ảnh lên thành công.",
      urls,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Tải ảnh lên thất bại!" });
  }
};

export const handleDeleteImages = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const public_ids = req.body.public_ids;
    const selectedFolder = req.body.selectedFolder;

    if (!public_ids || public_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Chưa cung cấp public_ids của các ảnh để xóa!" });
    }

    const result = await cloudinary.api.delete_resources(public_ids);

    clearCacheByKeyword(`GET:/v1/cloudinaries?folder=${selectedFolder}`);

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

    const results = [];

    for (const folderPrefix of folderDirs) {
      const deleteRes = await cloudinary.api.delete_resources_by_prefix(
        folderPrefix
      );

      // Optionally delete folder metadata:
      await cloudinary.api.delete_folder(folderPrefix).catch(() => {});

      results.push({ folderPrefix, deleteRes });
    }

    clearCacheByKeyword("GET:/v1/cloudinaries/get-folders");

    return res.status(200).json({
      message: "Xóa thư mục thành công.",
      results,
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
        message: "Thiếu thông tin đường dẫn thư mục hoặc tên thư mục! ",
      });
    }

    const folderPath = `${rootDir}/${folderName}`;

    const result = await cloudinary.api.create_folder(folderPath);

    clearCacheByKeyword("GET:/v1/cloudinaries/get-folders");

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
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);
    return { success: true, oldPublicId, newPublicId, result };
  } catch (err) {
    return { success: false, oldPublicId, error: err.message };
  }
};

export const handleMoveImages = async (req, res) => {
  // console.log("req.body", req.body);
  try {
    const oldPublicIds = req.body.oldPublicIds;
    const newFolder = req.body.newFolder;

    if (!oldPublicIds || !newFolder)
      return res.status(400).json({ message: "Bad request" });

    // Tạo danh sách Promises
    const moveTasks = oldPublicIds.map((id) => handleMoveImage(id, newFolder));

    // Chạy song song tất cả
    const results = await Promise.all(moveTasks);

    const hasError = results.some((r) => !r.success);

    if (hasError) {
      return res.status(207).json({
        message: "Một số ảnh không thể di chuyển!",
        results,
      });
    }

    const oldDir = oldPublicIds[0].substring(
      0,
      oldPublicIds[0].lastIndexOf("/")
    );
    clearCacheByKeyword(`GET:/v1/cloudinaries?folder=${oldDir}`);
    clearCacheByKeyword(`GET:/v1/cloudinaries?folder=${newFolder}`);

    return res.status(200).json({
      message: `Di chuyển toàn bộ ảnh sang thư mục ${newFolder} thành công!`,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server has error" });
  }
};
