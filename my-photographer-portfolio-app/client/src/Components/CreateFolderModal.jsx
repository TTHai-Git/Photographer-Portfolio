import { useState } from "react";
import "../Assets/CSS/modal.css";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useNotification } from "../Context/NotificationContext";

export default function CreateFolderModal({ folders,
  open,
  onClose,
  loadFolders }) {
  const [folderName, setFolderName] = useState("");
  const [selectedRootDir, setSelectedRootDir] = useState("")
  const {showNotification} = useNotification()
  const [loadingCreate, setLoadingCreate] = useState(false) 

  const handleCreateFolder = async () => {
    try {
      setLoadingCreate(true)
      // const res = await APIs.post(endpoints.createFolder, {
      //   rootDir: selectedRootDir,
      //   folderName
      // });
      const res = await authApi.post(endpoints.createFolder, {
        rootDir: selectedRootDir,
        folderName
      });
      if (res.status === 201) {
        await loadFolders();
        showNotification (res.data.message, "success")
      } 
      console.log(res)
    } catch (error) {
      console.log(error);
      
      showNotification (error.response.data.message, "error")
    } finally {
      await loadFolders();
      setLoadingCreate(false)
      onClose();
    }
  };


  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">Biểu Mẫu Tạo Thư Mục</div>

      {/* Select Folder */}
      <label className="label">Chọn Đường Dẫn</label>
      
        <select
          className="select"
          value={selectedRootDir}
          onChange={(e) => setSelectedRootDir(e.target.value)}
        >
          <option value="" disabled={true}>-- Chọn Đường Dẫn Gốc --</option>
          <option key={"Hoang-Truc-Photographer-Portfolio"} value={"Hoang-Truc-Photographer-Portfolio"}>Hoang-Truc-Photographer-Portfolio</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      
        <label className="label">Đặt Tên Thư Mục</label>
        <input
          className="modal-input"
          placeholder="Tên thư mục..."
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn" onClick={onClose}>Hủy</button>

          <button className="btn btn-primary" onClick={handleCreateFolder} disabled={loadingCreate}>
            {loadingCreate ? <>
              <span>Đang tạo thư mục...</span>
              <span className="spinner-btn"></span> 
            </> : ( <span>Tạo</span>)}
          </button>

        </div>
      </div>
    </div>
  );
}
