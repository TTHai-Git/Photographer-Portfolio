import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import { FaGripLines, FaFolder } from "react-icons/fa";
import { authApi, endpoints } from "../config/APIs";
import { useNotification } from "../Context/NotificationContext";
import { handleGetFolderName } from "../Helpers/getFolderName";

export default function ManageFolderOrderModal({
  open,
  onClose,
  folders, // Mảng folders truyền vào
  loadFolders,
  loadFoldersForCombobox
}) {
  const { showNotification } = useNotification();
  const [orderedFolders, setOrderedFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("order-increasing");
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Hàm sort nội bộ
  const sortLocalFolders = (foldersList, key) => {
    const list = [...foldersList];
    switch (key) {
      case "order-increasing":
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      case "order-decreasing":
        return list.sort((a, b) => (b.order || 0) - (a.order || 0));
      case "az":
        return list.sort((a, b) => a.path.localeCompare(b.path));
      case "za":
        return list.sort((a, b) => b.path.localeCompare(a.path));
      case "latest":
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return list;
    }
  };

  useEffect(() => {
    if (open && folders) {
      setOrderedFolders(sortLocalFolders(folders, sortKey));
    }
  }, [open, folders, sortKey]);

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // Bắt buộc set effectAllowed = "move"
    e.dataTransfer.effectAllowed = "move";

    // Sử dụng setTimeout để làm mờ element sau khi bắt đầu drag (nếu không ghost icon cũng bị mờ)
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Cần thiết để onDrop/DragEnd hoạt động
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    if (dragItem.current === undefined || dragOverItem.current === undefined)
      return;
    if (dragItem.current === dragOverItem.current) return;

    // Đổi vị trí
    const newList = [...orderedFolders];
    const draggedItemContent = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setOrderedFolders(newList);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Gắn lại field order = index + 1 (để order bắt đầu từ 1)
      const payload = orderedFolders.map((f, i) => ({
        _id: f._id,
        order: i + 1
      }));

      const res = await authApi.put(endpoints.updateFolderOrders, {
        folders: payload
      });
      if (res.status === 200) {
        showNotification(
          res.data.message || "Đã cập nhật thứ tự thư mục",
          "success"
        );
        if (loadFolders) {
          loadFolders();
        }
        if (loadFoldersForCombobox) {
          loadFoldersForCombobox();
        }
        onClose();
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Lỗi khi cập nhật thứ tự",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Sắp xếp thứ tự Thư mục</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2
          }}>
          <div style={{ fontSize: "14px", color: "#666", maxWidth: "60%" }}>
            Kéo thả các thư mục bên dưới để sắp xếp lại thứ tự của chúng. Thư
            mục ở trên cùng sẽ có thứ tự ưu tiên cao nhất.
          </div>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sắp xếp hiện tại</InputLabel>
            <Select
              value={sortKey}
              label="Sắp xếp hiện tại"
              onChange={handleSortChange}>
              <MenuItem value="latest">Mới nhất (Latest)</MenuItem>
              <MenuItem value="oldest">Cũ nhất (Oldest)</MenuItem>
              <MenuItem value="az">A → Z</MenuItem>
              <MenuItem value="za">Z → A</MenuItem>
              <MenuItem value="order-increasing">Order ⬆️</MenuItem>
              <MenuItem value="order-decreasing">Order ⬇️</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orderedFolders.map((f, index) => (
            <div
              key={f._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                backgroundColor: "#fff",
                cursor: "grab",
                userSelect: "none",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }>
              <FaGripLines style={{ marginRight: "12px", color: "#aaa" }} />
              <FaFolder
                style={{
                  marginRight: "12px",
                  color: "#f8d775",
                  fontSize: "20px"
                }}
              />
              <span style={{ fontWeight: 500 }}>
                {handleGetFolderName(f.path)}
              </span>
            </div>
          ))}
          {orderedFolders.length === 0 && (
            <div
              style={{ textAlign: "center", color: "#999", padding: "20px 0" }}>
              Không có thư mục nào để hiển thị.
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}>
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
