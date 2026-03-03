import { useEffect, useState } from "react";
import { authApi, endpoints } from "../config/APIs";
import "../Assets/CSS/UploadImageModal.css"
import "../Assets/CSS/modal.css";
import { useNotification } from "../Context/NotificationContext";
import pLimit from "p-limit";

const UploadVideoModal = ({folders, loadFoldersForCombobox, open, onClose, loadVideos }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [totalSize, setTotalSize] = useState(0); // tổng dung lượng bytes
  const MAX_FILES = 3  // số lượng video tối đa
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // tối đa 100 MB
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) // 0-100%
  const [currentUploadFile, setCurrentUploadFile] = useState("")
  const {showNotification} = useNotification();

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);

    // Tính tổng dung lượng video mới
    const newTotalSize = arr.reduce((sum, file) => sum + file.size, 0);

    // Kiểm tra giới hạn
    if (arr.length > MAX_FILES) {
      showNotification(`Bạn chỉ được chọn tối đa ${MAX_FILES} video!`, "warning");
      return;
    }

    // if (newTotalSize > MAX_TOTAL_SIZE) {
    //   showNotification("Tổng dung lượng video vượt quá 100 MB!", "warning");
    //   return;
    // }

    setFiles(arr);
    setTotalSize(newTotalSize);

    // Preview videos
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

  const handleRemoveVideo = (index) => {
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
    return showNotification("Vui lòng chọn các video để tải lên!", "warning");

  if (!selectedFolder)
    return showNotification("Vui lòng chọn thư mục để lưu các video tải lên!", "warning");

  if (files.length > MAX_FILES)
    return showNotification(`Bạn chỉ được chọn tối đa ${MAX_FILES} video!`, "warning");

  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

  try {
    setLoadingUpload(true);
    setUploadProgress(0);

    const limit = pLimit(2); // upload tối đa 2 file cùng lúc
    const uploadedAssets = [];

    const totalFiles = files.length;

    const tasks = files.map((file, index) =>
      limit(async () => {
        setCurrentUploadFile(`Đang tải: ${file.name}`);
        setUploadProgress((index / totalFiles) * 100);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", selectedFolder);
        // formData.append("resource_type", "video");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        // console.log("data", data)
        if (!res.ok) throw new Error(data.error?.message);

        uploadedAssets.push({
          public_id: data.public_id,
          original_filename: data.original_filename,
          secure_url: data.secure_url,
          resource_type: "video",
          bytes: data.bytes,
          width: data.width,
          height: data.height,
          format: data.format,
          videoMeta: {
            codec: data.video?.codec,
            bit_rate: data?.bit_rate,
            duration: data?.duration,
            frame_rate: data?.frame_rate,
            resolution: data?.width && data?.height ? `${data.width}x${data.height}` : "1920x1080",
            // posterUrl: data?.poster_url,
            playback_url: data?.playback_url,
          }
        });
      })
    );

    await Promise.all(tasks);

    // 3️⃣ Gửi về backend chỉ metadata
    await authApi.post(endpoints.saveAssetToDB, {
      assets: uploadedAssets,
      folder: selectedFolder,
    });

    // console.log("✅ Upload thành công:", uploadedAssets);

    setUploadProgress(100);
    showNotification("Tải video lên thành công!", "success");

    resetUploadState();
    await loadVideos();
  } catch (err) {
    showNotification(`Upload thất bại! ${err}`, "error");
    console.log(err)
  } finally {
    setLoadingUpload(false);
    setUploadProgress(0);
    setCurrentUploadFile("");
    onClose();
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
        <div className="modal-header">Biểu Mẫu Tải Video Lên</div>
        <div className="modal-content">
          <div className="upload-container">

            {/* <h2>Tải video lên trên Cloudinary</h2> */}

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
                <p>Kéo thả video vào đây hoặc nhấn nút chọn video để tải video lên (Lưu ý: Tổng dung lượng tối đa là 100 MB và tổng số lượng video tối đa là 3 video cho một lần tải lên)</p>
                <label className="file-label">
                  Chọn video
                  <input type="file" multiple accept="video/*" onChange={handleChange} />
                </label>
              </div>

              {files.length > 0 && (
                <div className="upload-info">
                  <p>Số lượng video: {files.length} / {MAX_FILES}</p>
                  <p>
                    Tổng dung lượng: {(totalSize / (1024 * 1024)).toFixed(2)} MB / {(MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(0)} MB
                  </p>
                </div>
              )}

              {/* Preview videos */}
              {previews.length > 0 && (
                <div className="preview-grid">
                  {previews.map((src, idx) => (
                    <div key={idx} className="preview-wrapper">
                      <video src={src} className="preview-img" controls />
                      <div className="preview-info">
                        <span className="file-name">{files[idx].name}</span>
                        <span className="file-size">
                          {(files[idx].size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveVideo(idx)}
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
                  <p>
                    {uploadProgress < 50
                      ? `Đang nén video: ${currentUploadFile}`
                      : `Đang tải video lên: ${currentUploadFile}`}
                  </p>
                  <div style={{ marginTop: "10px", backgroundColor: "#e0e0e0", borderRadius: "5px", overflow: "hidden", width: "200px", height: "10px" }}>
                    <div
                      style={{
                        backgroundColor: "#4CAF50",
                        height: "100%",
                        width: `${uploadProgress}%`,
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                  <p style={{ marginTop: "5px", fontSize: "12px" }}>{Math.round(uploadProgress)}%</p>
                </div>
              )}
              {/* Upload Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button className="cancel-btn" onClick={onClose}>Hủy</button>
                  <button className="upload-btn" onClick={handleUpload} disabled={loadingUpload}>
                  {loadingUpload ? "Đang tải video lên..." : "Tải video lên"}
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
    
  );
};

export default UploadVideoModal;
