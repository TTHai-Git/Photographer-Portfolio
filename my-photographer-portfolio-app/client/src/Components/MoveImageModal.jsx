import React, { useEffect, useState } from 'react'
import "../Assets/CSS/folders.css"
import { authApi, endpoints } from '../config/APIs';
import { useNotification } from '../Context/NotificationContext';

export const MoveImageModal = ({folders, loadFoldersForCombobox, open , oldPublicIds, setOldPublicIds, onClose, loadImages }) => {
  const [newFolder, setNewFolder] = useState("")
  const [loadingMove, setLoadingMove] = useState(false)
  const {showNotification} = useNotification()

  

const handleMoveImagesToAnotherFolder = async () => {
  if (!oldPublicIds.length) {
    showNotification("Vui lòng chọn ảnh để di chuyển!", "warning");
    return
  }
  try {
    setLoadingMove(true);

    const res = await authApi.post(endpoints.moveImages, {
      oldPublicIds,
      newFolder
    });

    showNotification(res.data.message, "success");
    resetMoveState();
    // ⬅️ Load images ONCE only
    await loadImages();

  } catch (error) {
    showNotification(error.response?.data?.message, "error");

  } finally {
    setLoadingMove(false);
    setOldPublicIds([]);
    onClose();
  }
};

const resetMoveState = () => {
  setNewFolder("");
};


useEffect(() => {
  if (open) {
    loadFoldersForCombobox();
    resetMoveState();
  }
}, [open]);

if (!open) return null;

return (
  <div className="modal-backdrop">
    <div className="modal-box">
      <div className="modal-header">Biểu Mẫu Di Chuyển Ảnh Sang Thư Mục Khác</div>

    {/* Select Folder */}
    <label className="label">Chọn Đường Dẫn</label>
    
        <select
        className="select"
        value={newFolder}
        onChange={(e) => setNewFolder(e.target.value)}
      >
        <option value="" disabled={true}>-- Chọn Đường Dẫn Muốn Ảnh Di Chuyển Qua --</option>
        <option key={"Hoang-Truc-Photographer-Portfolio"} value={"Hoang-Truc-Photographer-Portfolio"}>Hoang-Truc-Photographer-Portfolio</option>
        {folders.map((folder) => (
          <option key={folder._id} value={folder.path}>
            {folder.path}
          </option>
        ))}
      </select>
      
      

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button className="btn" onClick={onClose}>Hủy</button>

        <button className="btn btn-primary" onClick={() => handleMoveImagesToAnotherFolder()} disabled={loadingMove}>
          {loadingMove ? <>
            <span>Đang di chuyển ảnh sang thư mục khác...</span>
            <span className="spinner-btn"></span> 
          </> : ( <span>Di chuyển</span>)}
        </button>

      </div>
    </div>
  </div>
);
}
