import { useState } from "react";
import "../Assets/CSS/modal.css";
import APIs, { endpoints } from "../config/APIs";

export default function CreateFolderModal({ folders,
  actionFoldersLoading,
  setActionFoldersLoading,
  open,
  onClose,
  loadFolders }) {
  const [folderName, setFolderName] = useState("");
  const [selectedRootDir, setSelectedRootDir] = useState("")

  const handleCreateFolder = async () => {
    try {
      setActionFoldersLoading(true);
      const res = await APIs.post(endpoints.createFolder, {
        rootDir: selectedRootDir,
        folderName
      });
      if (res.status === 201) alert (res.data.message)
      console.log(res)
    } catch (error) {
      console.log(error);
    } finally {
      await loadFolders();
      setActionFoldersLoading(false);
      onClose();
    }
  };


  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">Create Folder</div>

      {/* Select Folder */}
      <label className="label">Chọn Dường Dẫn</label>
      
        <select
          className="select"
          value={selectedRootDir}
          onChange={(e) => setSelectedRootDir(e.target.value)}
        >
          <option value="" disabled={true}>-- Select folder --</option>
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
          placeholder="Folder name..."
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn" onClick={onClose}>Cancel</button>

          <button className="btn btn-primary" onClick={handleCreateFolder} disabled={actionFoldersLoading}>
            {actionFoldersLoading ? <span className="spinner"></span> : "Create"}
          </button>

        </div>
      </div>
    </div>
  );
}
