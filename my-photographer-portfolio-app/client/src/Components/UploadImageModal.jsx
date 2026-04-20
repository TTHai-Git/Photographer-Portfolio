import { useEffect, useState } from "react";
import { authApi, endpoints } from "../config/APIs";
import "../Assets/CSS/UploadImageModal.css";
import "../Assets/CSS/modal.css";
import { useNotification } from "../Context/NotificationContext";
import { useImageCompressor } from "../hooks/useImageCompressor";
import pLimit from "p-limit";

const UploadImageModal = ({
  folders,
  loadFoldersForCombobox,
  open,
  onClose,
  loadImages
}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [totalSize, setTotalSize] = useState(0); // tổng dung lượng bytes
  const MAX_FILES = 10; // số lượng ảnh tối đa
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // tối đa 100 MB
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100%
  const [currentUploadFile, setCurrentUploadFile] = useState("");
  const { showNotification } = useNotification();
  const { compressImage } = useImageCompressor();

  // Các định dạng ảnh được hỗ trợ
  const SUPPORTED_FORMATS = {
    jpg: {
      ext: ".jpg",
      mime: "image/jpeg",
      optimized: "webp",
      description: "JPEG - Tương thích tốt"
    },
    jpeg: {
      ext: ".jpeg",
      mime: "image/jpeg",
      optimized: "webp",
      description: "JPEG - Tương thích tốt"
    },
    png: {
      ext: ".png",
      mime: "image/png",
      optimized: "webp",
      description: "PNG - Có alpha channel"
    },
    webp: {
      ext: ".webp",
      mime: "image/webp",
      optimized: "webp",
      description: "WebP - Tối ưu nhất"
    },
    avif: {
      ext: ".avif",
      mime: "image/avif",
      optimized: "avif",
      description: "AVIF - Hiện đại nhất"
    },
    gif: {
      ext: ".gif",
      mime: "image/gif",
      optimized: "webp",
      description: "GIF - Ảnh động"
    },
    tiff: {
      ext: ".tiff",
      mime: "image/tiff",
      optimized: "webp",
      description: "TIFF - Chất lượng cao"
    },
    bmp: {
      ext: ".bmp",
      mime: "image/bmp",
      optimized: "webp",
      description: "BMP - Định dạng cũ"
    },
    ico: {
      ext: ".ico",
      mime: "image/x-icon",
      optimized: "webp",
      description: "ICO - Icon"
    },
    svg: {
      ext: ".svg",
      mime: "image/svg+xml",
      optimized: "svg",
      description: "SVG - Vector"
    }
  };

  // Hàm kiểm tra và lấy thông tin định dạng ảnh
  const getImageFormat = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return SUPPORTED_FORMATS[ext] || null;
  };

  // Hàm kiểm tra file ảnh hợp lệ
  const isValidImageFile = (file) => {
    const format = getImageFormat(file.name);
    return format !== null;
  };

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);

    // Kiểm tra định dạng ảnh hợp lệ
    const invalidFiles = arr.filter((file) => !isValidImageFile(file));
    if (invalidFiles.length > 0) {
      const invalidNames = invalidFiles.map((f) => f.name).join(", ");
      showNotification(
        `Định dạng ảnh không được hỗ trợ: ${invalidNames}`,
        "warning"
      );
      return;
    }

    // Tính tổng dung lượng ảnh mới
    const newTotalSize = arr.reduce((sum, file) => sum + file.size, 0);

    // Kiểm tra giới hạn
    if (arr.length > MAX_FILES) {
      showNotification(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh!`, "warning");
      return;
    }

    if (newTotalSize > MAX_TOTAL_SIZE) {
      showNotification("Tổng dung lượng ảnh vượt quá 100MB!", "warning");
      return;
    }

    setFiles(arr);
    setTotalSize(newTotalSize);

    // Preview images
    const previewUrls = arr.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleChange = (e) => handleFiles(e.target.files);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];

    // Xóa file và preview
    const removedFile = newFiles.splice(index, 1)[0];
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviews(newPreviews);

    // Cập nhật lại tổng dung lượng
    setTotalSize((prevSize) => prevSize - removedFile.size);
  };

  const handleUpload = async () => {
    if (!files.length)
      return showNotification("Vui lòng chọn các ảnh để tải lên!", "warning");
    if (!selectedFolder)
      return showNotification(
        "Vui lòng chọn thư mục để lưu các ảnh tải lên!",
        "warning"
      );
    if (files.length > MAX_FILES)
      return showNotification(
        `Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh!`,
        "warning"
      );
    if (totalSize > MAX_TOTAL_SIZE)
      return showNotification("Tổng dung lượng ảnh vượt quá 100MB!", "warning");

    const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

    // 🔥 Dùng ref để đếm số ảnh đã hoàn thành — tránh stale closure của index
    let completedCount = 0;

    try {
      setLoadingUpload(true);
      setUploadProgress(0);

      const limit = pLimit(3); // chỉ upload 3 ảnh cùng lúc

      // ✅ Fix race condition: mỗi task return value, không push vào shared array
      const tasks = files.map((file) =>
        limit(async () => {
          setCurrentUploadFile(`Đang nén: ${file.name}`);

          // 🔥 Compress in Worker
          const compressed = await compressImage(file, {
            maxBytes: 10 * 1024 * 1024,
            maxWidthOrHeight: 2560
          });

          setCurrentUploadFile(`Đang tải lên: ${file.name}`);

          const imageFormat = getImageFormat(file.name);
          const formData = new FormData();
          formData.append("file", compressed);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("folder", selectedFolder);

          // Tối ưu hóa Cloudinary cho ảnh - Chất lượng tốt nhưng file nhẹ
          formData.append("quality", "auto"); // Tự động điều chỉnh chất lượng
          formData.append("fetch_format", "auto"); // Auto convert to WebP/AVIF nếu browser hỗ trợ

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData
            }
          );

          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message);

          // ✅ Fix progress: cập nhật dựa trên số lượng thực sự đã hoàn thành
          completedCount++;
          setUploadProgress((completedCount / files.length) * 100);

          return {
            public_id: data.public_id,
            original_filename: data.original_filename,
            secure_url: data.secure_url,
            resource_type: "image",
            bytes: data.bytes,
            width: data.width,
            height: data.height,
            format: data.format,
            original_format: imageFormat?.ext?.replace(".", ""),
            videoMeta: null
          };
        })
      );

      // ✅ uploadedAssets thu thập từ return values — không có shared mutable array
      const uploadedAssets = await Promise.all(tasks);

      // Gửi về backend chỉ metadata
      await authApi.post(endpoints.saveAssetToDB, {
        assets: uploadedAssets,
        folder: selectedFolder
      });

      showNotification("Tải ảnh lên thành công!", "success");
      resetUploadState();
      await loadImages();
      // ✅ Fix: chỉ đóng modal khi thành công
      onClose();
    } catch (err) {
      showNotification(`Upload thất bại! ${err}`, "error");
      console.error(err);
    } finally {
      setLoadingUpload(false);
      setUploadProgress(0);
      setCurrentUploadFile("");
    }
  };

  const resetUploadState = () => {
    setFiles([]);
    setPreviews([]);
    setSelectedFolder("");
    setTotalSize(0);
    setDragActive(false);
  };

  useEffect(() => {
    if (open) {
      loadFoldersForCombobox();
      resetUploadState();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">Biểu Mẫu Tải Ảnh Lên</div>
        <div className="modal-content">
          <div className="upload-container">
            {/* <h2>Tải ảnh lên trên Cloudinary</h2> */}

            {/* Select Folder */}
            <label className="label">Chọn Đường Dẫn</label>

            <select
              className="select"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}>
              <option value="" disabled={true}>
                -- Chọn Đường Dẫn --
              </option>
              <option
                key={"Hoang-Truc-Photographer-Portfolio"}
                value={"Hoang-Truc-Photographer-Portfolio"}>
                Hoang-Truc-Photographer-Portfolio
              </option>
              {folders.map((folder) => (
                <option key={folder._id} value={folder.path}>
                  {folder.path}
                </option>
              ))}
            </select>

            {/* Drag & Drop Area */}
            <div
              className={`dropzone ${dragActive ? "active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}>
              <p>
                Kéo thả ảnh vào đây hoặc nhấn nút chọn ảnh để tải ảnh lên (Lưu
                ý: Tổng dung lượng tối đa là 100 MB (sau khi nén ảnh) và tổng số
                lượng ảnh tối đa là 10 ảnh cho một lần tải lên)
              </p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                Định dạng hỗ trợ: JPG, PNG, WebP, AVIF, GIF, TIFF, BMP, ICO, SVG
              </p>
              <label className="file-label">
                Chọn ảnh
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff,image/bmp,image/x-icon,image/svg+xml,.jpg,.jpeg,.png,.webp,.avif,.gif,.tiff,.tif,.bmp,.ico,.svg"
                  onChange={handleChange}
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="upload-info">
                <p>
                  Số lượng ảnh: {files.length} / {MAX_FILES}
                </p>
                <p>
                  Tổng dung lượng: {(totalSize / (1024 * 1024)).toFixed(2)} MB /{" "}
                  {MAX_TOTAL_SIZE / (1024 * 1024)} MB
                </p>
              </div>
            )}

            {/* Preview images */}
            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((src, idx) => {
                  const format = getImageFormat(files[idx].name);
                  return (
                    <div key={idx} className="preview-wrapper">
                      <img src={src} className="preview-img" alt="preview" />
                      <div className="preview-info">
                        <span className="file-name">{files[idx].name}</span>
                        <span className="file-size">
                          {(files[idx].size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        {format && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#0066cc",
                              marginTop: "4px",
                              display: "block"
                            }}>
                            Định dạng: {format.ext.toUpperCase()} →{" "}
                            {format.optimized.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveImage(idx)}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {loadingUpload && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>
                  {uploadProgress < 50
                    ? `Đang nén ảnh: ${currentUploadFile}`
                    : `Đang tải ảnh lên: ${currentUploadFile}`}
                </p>
                <div
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    overflow: "hidden",
                    width: "200px",
                    height: "10px"
                  }}>
                  <div
                    style={{
                      backgroundColor: "#4CAF50",
                      height: "100%",
                      width: `${uploadProgress}%`,
                      transition: "width 0.3s ease"
                    }}></div>
                </div>
                <p style={{ marginTop: "5px", fontSize: "12px" }}>
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
            {/* Upload Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px"
              }}>
              <button className="cancel-btn" onClick={onClose}>
                Hủy
              </button>
              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={loadingUpload}>
                {loadingUpload ? "Đang tải ảnh lên..." : "Tải ảnh lên"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
