import { useState } from "react";
import APIs, { endpoints } from "../config/APIs";
import "../Assets/CSS/UploadForm.css"
import "../Assets/CSS/modal.css";

const UploadImageModal = ({open, folders, actionImagesLoading, setActionImagesLoading, loadImages ,onClose }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [totalSize, setTotalSize] = useState(0); // tổng dung lượng bytes
  const MAX_FILES = 20;      // số lượng ảnh tối đa
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);

    // Tính tổng dung lượng ảnh mới
    const newTotalSize = arr.reduce((sum, file) => sum + file.size, 0);

    // Kiểm tra giới hạn
    if (arr.length > MAX_FILES) {
      alert(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh!`);
      return;
    }

    if (newTotalSize > MAX_TOTAL_SIZE) {
      alert("Tổng dung lượng ảnh vượt quá 100MB!");
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
  if (!files.length) return alert("Please select images first!");
  if (!selectedFolder) return alert("Please select a folder!");
  if (files.length > MAX_FILES) return alert(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh!`);
  if (totalSize > MAX_TOTAL_SIZE) return alert("Tổng dung lượng ảnh vượt quá 100MB!");

  try {
    setActionImagesLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("folder", selectedFolder);
    formData.append("password", password)

    const res = await APIs.post(endpoints.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201)  alert(res.data.message);
  } catch (err) {
    alert(err.response.data.message);
    console.error(err);

    // Reset component state
    setFiles([]);
    setPreviews([]);
    setSelectedFolder("");
    setPassword("");
    setTotalSize(0);
    setDragActive(false);
    setShowPassword(false);
  } finally {
    setActionImagesLoading(false);
    setFiles([]);
    setPreviews([]);
    setSelectedFolder("");
    setPassword("");
    setTotalSize(0);
    setDragActive(false);
    setShowPassword(false);
    onClose()
    await loadImages()
  }

  

};
  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">Upload Images</div>
        <div className="upload-container">

      <h2>Tải ảnh lên trên Cloudinary</h2>

      {/* Select Folder */}
      <label className="label">Chọn thư mục</label>
        <select
          className="select"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="" disabled={true}>-- Select folder --</option>
          <option key={"Hoang-Truc-Photographer-Portfolio"} value={"Hoang-Truc-Photographer-Portfolio"}>Hoang-Truc-Photographer-Portfolio</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
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

      {actionImagesLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Đang tải ảnh lên...</p>
        </div>
      )}
      <label htmlFor="" className="label">Mật Khẩu Xác Thực: </label>
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className="password-input"
          value={password}
          placeholder="Hãy nhập mật khẩu quản trị viên..."
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>


      {/* Upload Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="upload-btn" onClick={handleUpload} disabled={actionImagesLoading}>
        {actionImagesLoading ? "Đang tải ảnh lên..." : "Tải ảnh lên"}
        </button>
      </div>
    </div>
      </div>
    </div>
    
  );
};

export default UploadImageModal;
