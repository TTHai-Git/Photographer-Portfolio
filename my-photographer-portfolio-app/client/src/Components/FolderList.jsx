import "../Assets/CSS/folders.css"
import { FaTrash, FaFolder } from "react-icons/fa";
import APIs, { endpoints } from "../config/APIs";
import { useState } from "react";
import CreateFolderModal from "./CreateFolderModal";

export default function FolderList({  folders,
  loading,           // skeleton loading
  actionFoldersLoading,      // spinner for delete/create
  setActionFoldersLoading,
  loadFolders,
  setImages,
  onSelectFolder }) {
  const [folderDirs, setFolderDirs] = useState([])
  const [openCreate, setOpenCreate] = useState(false);

  const handleDeletedFolders = async () => {
    try {
      setActionFoldersLoading(true);
      const res = await APIs.delete(endpoints.deleteFolders, {
        data: { folderDirs }
      });
      if (res.status === 200) alert(res.data.message)

    } catch (error) {
      console.log(error);
    } finally {
      setActionFoldersLoading(false);
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
       <button className="btn btn-green" onClick={() => setOpenCreate(true)}>
          + Created Folder
        </button>
        <button className="btn btn-red" onClick={handleDeletedFolders} disabled={actionFoldersLoading}>
          {actionFoldersLoading ? <span className="spinner" /> : <><FaTrash /> Delete Folders ({folderDirs.length})</>}
        </button>
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
          className="folder-item"
          onClick={() => onSelectFolder(folder)}
        >
          <input type="checkbox" value={folder} onClick={(e) => {
            e.stopPropagation();   // prevent opening folder when clicking checkbox
            handleAddFolderDirs(folder);
          }} />
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
        actionFoldersLoading={actionFoldersLoading}
        setActionFoldersLoading={setActionFoldersLoading}
        loadFolders={loadFolders}
        onClose={() => setOpenCreate(false)}
      />

    </div>
  );
}
