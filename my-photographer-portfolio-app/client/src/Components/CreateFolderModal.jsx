import { useEffect, useState } from "react";
import "../Assets/CSS/modal.css";
import{ authApi, endpoints } from "../config/APIs";
import { useNotification } from "../Context/NotificationContext";


export default function CreateFolderModal({folders, loadFoldersForCombobox, open, onClose, loadFolders}) {
  const [folderName, setFolderName] = useState("");
  const [selectedRootDir, setSelectedRootDir] = useState("")
  const {showNotification} = useNotification()
  const [loadingCreate, setLoadingCreate] = useState(false) 


  const handleCreateFolder = async () => {
    if (!folderName || !selectedRootDir)
      return showNotification("Vui lòng chọn đường dẫn và nhập tên", "error");

    try {
      setLoadingCreate(true);

      const res = await authApi.post(endpoints.createFolder, {
        rootDir: selectedRootDir,
        folderName,
      });

      if (res.status === 201) {
        showNotification(res.data.message, "success");
        await loadFolders();
        
        onClose();
      }

      
    } catch (error) {
      showNotification(error.response?.data?.message, "error");
    } finally {
      setLoadingCreate(false);
    }
  };


  useEffect(() => {
  if (open) {
    setFolderName("");
    setSelectedRootDir("");
    loadFoldersForCombobox();
  }
  }, [open]);


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
            <option key={folder._id} value={folder.path}>
              {folder.path}
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
