import "../Assets/CSS/folders.css";
import { FaTrash, FaFolder } from "react-icons/fa";
import React, { useState } from "react";
import CreateFolderModal from "./CreateFolderModal";
import { useNotification } from "../Context/NotificationContext";
import { handleGetFolderName } from "../Helpers/getFolderName";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SortIcon from "@mui/icons-material/Sort";
import { authApi, endpoints } from "../config/APIs";

const FolderList = ({
  folders,
  foldersForCombobox,
  loadFoldersForCombobox,
  loading,
  loadFolders,
  setImages,
  selectedFolder,
  setSelectedFolder,
  folderParams,
  setFolderParams,
  sortFileds,
}) => {
  const [selectedDirs, setSelectedDirs] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { showNotification } = useNotification();

  const updateParams = (key, val) => {
    setFolderParams((prev) => ({
      ...prev,
      page: 1,
      [key]: val,
    }));
  };

  const handleDeleteFolders = async () => {
    if (!selectedDirs.length) {
      showNotification("Vui lòng chọn thư mục để xóa!", "warning");
      return;
    }
    if (!window.confirm("Bạn có muốn xóa các thư mục đã chọn không? (Nếu trong thư mục có các ảnh thì cũng sẽ bị xóa theo)")) return;

    try {
      setLoadingDelete(true);

      const res = await authApi.delete(endpoints.deleteFolders, {
        data: { folderDirs: selectedDirs },
      });
      if (res.status === 200) {
        showNotification(res.data.message, "success");
        await loadFolders();
        setSelectedDirs([]);
        setImages([]);
      } 
    } catch (err) {
      showNotification(err.response?.data?.message, "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  

  return (
    <div className="folder-list">
      <div className="folder-section-header">
        <button className="btn btn-green" onClick={() => setOpenCreate(true)}>
          + Tạo thư mục
        </button>

        <button
          className="btn btn-red"
          onClick={handleDeleteFolders}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Đang xóa..." : <><FaTrash /> Xóa ({selectedDirs.length})</>}
        </button>
      </div>

      {/* Search + Sort */}
      <div className="folder-section-header">
        <TextField
          label="Tìm kiếm"
          value={folderParams.search}
          onChange={(e) => updateParams("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: folderParams.search && (
              <IconButton onClick={() => updateParams("search", "")}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          sx={{ width: 350, bgcolor: "white", borderRadius: 2 }}
        />

        <Autocomplete
          disablePortal
          value={sortFileds.find((x) => x.id === folderParams.sort) || null}
          onChange={(e, v) => updateParams("sort", v?.id || "")}
          options={sortFileds}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sắp xếp theo"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          sx={{ width: 250, bgcolor: "white", borderRadius: 2 }}
        />
      </div>

      {/* Folder Items */}
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="folder-skeleton"></div>
        ))
      ) : (
        folders.map((f) => (
          <div
            key={f._id}
            className={`folder-item ${selectedFolder === f.path ? "active-folder" : ""}`}
            onClick={() => setSelectedFolder(f.path)}
          >
            <input
              type="checkbox"
              checked={selectedDirs.includes(f.path)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDirs((prev) =>
                  prev.includes(f.path)
                    ? prev.filter((x) => x !== f.path)
                    : [...prev, f.path]
                );
              }}
            />

            <div className="folder-left">
              <FaFolder className="folder-icon" />
              <span>{handleGetFolderName(f.path)}</span>
            </div>
          </div>
        ))
      )}

      <CreateFolderModal
        folders={foldersForCombobox}
        loadFoldersForCombobox={loadFoldersForCombobox}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        loadFolders={loadFolders}
      />
    </div>
  );
}

export default React.memo(FolderList);
