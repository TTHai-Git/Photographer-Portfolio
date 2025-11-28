import "../Assets/CSS/folders.css"
import { FaTrash, FaFolder } from "react-icons/fa";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useState } from "react";
import CreateFolderModal from "./CreateFolderModal";
import { useNotification } from "../Context/NotificationContext";

export default function FolderList({  folders,
  loading,          
  loadFolders,
  setImages,
  selectedFolder,
  onSelectFolder }) {
  const [folderDirs, setFolderDirs] = useState([])
  const [openCreate, setOpenCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false)
  const {showNotification} = useNotification()

  const handleDeletedFolders = async () => {
    try {
      setLoadingDelete(true)
      if (!window.confirm("Bạn có muốn xóa các thư mục đã chọn không?")) return
      // const res = await APIs.delete(endpoints.deleteFolders, {
      //   data: { folderDirs }
      // });
      const res = await authApi.delete(endpoints.deleteFolders, {
        data: { folderDirs }
      });
      if (res.status === 200) 
      {
        showNotification(res.data.message, "success")
        await loadFolders();
      }

    } catch (error) {
      console.log(error);
      showNotification (error.response.data.message, "error")
    } finally {
      setLoadingDelete(false)
      setFolderDirs([])
      setImages([])
      await loadFolders();
    }
  };


  const handleAddFolderDirs = (folder) => {
    setFolderDirs((prev) =>
      prev.includes(folder)
        ? prev.filter((f) => f !== folder)
        : [...prev, folder]
    );
  };


  if (loading) {
    return (
      <div className="folder-list">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="folder-skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="folder-list">
       <div className="folder-section-header">
          <button className="btn btn-green" onClick={() => setOpenCreate(true)}>
          + Tạo thư mục
          </button>
          <button className="btn btn-red" onClick={handleDeletedFolders} disabled={loadingDelete}>
            {loadingDelete ?  <>
            <span className="spinner-btn" ></span> 
            <span>Đang xóa thư mục...</span>
            
            </> : <>
            <FaTrash /> Xóa thư mục ({folderDirs.length})
            </>}
          </button>
       </div>
       
        <div
          key={"Hoang-Truc-Photographer-Portfolio"}
          className="folder-item"
          onClick={() => onSelectFolder("Hoang-Truc-Photographer-Portfolio")}
        >
          <input type="checkbox" value={"Hoang-Truc-Photographer-Portfolio"} onClick={(e) => {
            e.stopPropagation();   // prevent opening folder when clicking checkbox
            handleAddFolderDirs("Hoang-Truc-Photographer-Portfolio");
          }} />
          <div className="folder-left">
            <FaFolder className="folder-icon" />
            <span>Hoang-Truc-Photographer-Portfolio</span>
          </div>
        </div>
      {folders.map((folder) => (
          <div
            key={folder}
            className={`folder-item ${selectedFolder === folder ? "active-folder" : ""}`}
            onClick={() => onSelectFolder(folder)}
          >
            <input 
              type="checkbox" 
              value={folder}
              onClick={(e) => {
                e.stopPropagation();
                handleAddFolderDirs(folder);
              }} 
            />

            <div className="folder-left">
              <FaFolder className="folder-icon" />
              <span>{folder}</span>
            </div>
          </div>
        ))}

      {/* Modals */}
      <CreateFolderModal
        open={openCreate}
        folders={folders}
        loadFolders={loadFolders}
        onClose={() => setOpenCreate(false)}
      />

    </div>
  );
}
