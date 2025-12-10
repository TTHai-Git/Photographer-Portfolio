import { useEffect, useState } from "react";
import { authApi, endpoints } from "../config/APIs";
import "../Assets/CSS/UploadImageModal.css"
import "../Assets/CSS/modal.css";
import { useNotification } from "../Context/NotificationContext";

const UploadImageModal = ({folders, loadFoldersForCombobox, open, onClose, loadImages }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [totalSize, setTotalSize] = useState(0); // tổng dung lượng bytes
  const MAX_FILES = 20;      // số lượng ảnh tối đa
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
  const [loadingUpload, setLoadingUpload] = useState(false)
  const {showNotification} = useNotification()

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);

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
  if (!files.length) return showNotification("Vui lòng chọn các ảnh để tải lên!", "warning");
  if (!selectedFolder) return showNotification("Vui lòng chọn thư mục để lưu các ảnh tải lên!", "warning");
  if (files.length > MAX_FILES) return showNotification(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh!`, "warning");
  if (totalSize > MAX_TOTAL_SIZE) return showNotification("Tổng dung lượng ảnh vượt quá 100MB!", "warning");

  try {
    setLoadingUpload(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("folder", selectedFolder);

    const res = await authApi.post(endpoints.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201) {
      showNotification(res.data.message, "success");

      // Reset UI
      resetUploadState();

      // ⬅️ ONLY HERE: Load images ONCE
      await loadImages();
    }
    

  } catch (err) {
    showNotification(err.response?.data?.message, "error");

  } finally {
    setLoadingUpload(false);
    onClose(); // đóng modal
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
    resetUploadState()
  }
}, [open]);

    

if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">Biểu Mẫu Tải Ảnh Lên</div>
        <div className="upload-container">

      {/* <h2>Tải ảnh lên trên Cloudinary</h2> */}

      {/* Select Folder */}
      <label className="label">Chọn Đường Dẫn</label>
       
          <select
          className="select"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="" disabled={true}>-- Chọn Đường Dẫn --</option>
          <option key={"Hoang-Truc-Photographer-Portfolio"} value={"Hoang-Truc-Photographer-Portfolio"}>Hoang-Truc-Photographer-Portfolio</option>
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
        onDrop={handleDrop}
      >
        <p>Kéo thả ảnh vào đây hoặc nhấn nút chọn ảnh để tải ảnh lên (Lưu ý: Tổng dung lượng tối đa là 100 MB và tổng số lượng ảnh tối đa là 20 ảnh cho một lần tải lên)</p>
        <label className="file-label">
          Chọn ảnh
          <input type="file" multiple accept="image/*" onChange={handleChange} />
        </label>
      </div>

      {files.length > 0 && (
        <div className="upload-info">
          <p>Số lượng ảnh: {files.length} / {MAX_FILES}</p>
          <p>
            Tổng dung lượng: {(totalSize / (1024 * 1024)).toFixed(2)} MB / {(MAX_TOTAL_SIZE / (1024 * 1024))} MB
          </p>
        </div>
      )}

      {/* Preview images */}
      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((src, idx) => (
            <div key={idx} className="preview-wrapper">
              <img src={src} className="preview-img" alt="preview" />
              <div className="preview-info">
                <span className="file-name">{files[idx].name}</span>
                <span className="file-size">
                  {(files[idx].size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {loadingUpload && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Đang tải ảnh lên...</p>
        </div>
      )}
      {/* Upload Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button className="cancel-btn" onClick={onClose}>Hủy</button>
        <button className="upload-btn" onClick={handleUpload} disabled={loadingUpload}>
        {loadingUpload ? "Đang tải ảnh lên..." : "Tải ảnh lên"}
        </button>
      </div>
    </div>
      </div>
    </div>
    
  );
};

export default UploadImageModal;
