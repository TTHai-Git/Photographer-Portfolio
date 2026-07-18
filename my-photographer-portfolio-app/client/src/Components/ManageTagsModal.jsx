import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  CircularProgress
} from "@mui/material";

import { authApi, endpoints } from "../config/APIs";
import { useNotification } from "../Context/NotificationContext";

import TagAutocomplete from "./TagAutocomplete";
import AssetTagList from "./AssetTagList";

export default function ManageTagsModal({
  open,
  asset,
  onClose,
  loadImages,
  selectedFolder
}) {
  const { showNotification } = useNotification();

  // ===============================
  // State
  // ===============================

  const [selectedTags, setSelectedTags] = useState([]);

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingReplace, setLoadingReplace] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // ===============================
  // Reset mỗi lần mở Dialog
  // ===============================

  useEffect(() => {
    if (open && asset) {
      setSelectedTags(asset.tags || []);
    }
  }, [open, asset]);

  // ===============================
  // ObjectId array để gửi API
  // ===============================

  const tagIds = useMemo(() => {
    return selectedTags.map((tag) => tag._id);
  }, [selectedTags]);

  // ===============================
  // Đóng Dialog
  // ===============================

  const handleClose = () => {
    setSelectedTags([]);
    onClose();
  };

  // ===============================
  // ADD TAGS
  // PATCH
  // ===============================

  const handleAdd = async () => {
    if (!asset) return;

    try {
      setLoadingAdd(true);

      const res = await authApi.patch(
        endpoints.addMoreTagsForAssets(asset._id),
        {
          tags: tagIds,
          selectedFolder: selectedFolder
        }
      );

      showNotification(res.data.message || "Thêm Tags thành công", "success");

      loadImages();

      handleClose();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Không thể thêm Tags",
        "error"
      );
    } finally {
      setLoadingAdd(false);
    }
  };

  // ===============================
  // REPLACE TAGS
  // PUT
  // ===============================

  const handleReplace = async () => {
    if (!asset) return;

    try {
      setLoadingReplace(true);

      const res = await authApi.put(
        endpoints.replaceAllTagsForAssets(asset._id),
        {
          tags: tagIds,
          selectedFolder: selectedFolder
        }
      );

      showNotification(res.data.message || "Đã thay thế Tags", "success");

      loadImages();

      handleClose();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Không thể thay thế Tags",
        "error"
      );
    } finally {
      setLoadingReplace(false);
    }
  };

  // ===============================
  // REMOVE TAGS
  // DELETE
  // ===============================

  const handleRemove = async () => {
    if (!asset) return;

    try {
      setLoadingRemove(true);

      const res = await authApi.delete(
        endpoints.removeTagsForAssets(asset._id),
        {
          data: {
            tags: tagIds,
            selectedFolder: selectedFolder
          }
        }
      );

      showNotification(res.data.message || "Đã xóa Tags", "success");

      loadImages();

      handleClose();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Không thể xóa Tags",
        "error"
      );
    } finally {
      setLoadingRemove(false);
    }
  };
  // ===============================
  // Render
  // ===============================

  if (!asset) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>🏷 Quản lý Tags</DialogTitle>

      <DialogContent dividers>
        {/* Preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20
          }}>
          {asset.resource_type === "image" ? (
            <img
              src={asset.secure_url}
              alt={asset.original_filename}
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "contain",
                borderRadius: 8,
                border: "1px solid #ddd"
              }}
            />
          ) : (
            <video
              src={asset.secure_url}
              controls
              style={{
                width: "100%",
                maxHeight: 240,
                borderRadius: 8
              }}
            />
          )}
        </div>

        <Divider sx={{ mb: 2 }} />

        {/* File name */}
        <div
          style={{
            marginBottom: 15
          }}>
          <strong>File:</strong>

          <div
            style={{
              color: "#666",
              marginTop: 4,
              wordBreak: "break-word"
            }}>
            {asset.original_filename}
          </div>
        </div>

        {/* Current Tags */}
        <div
          style={{
            marginBottom: 20
          }}>
          <strong>Current Tags</strong>

          <AssetTagList tags={asset.tags} />
        </div>

        <Divider sx={{ mb: 2 }} />

        {/* Choose Tags */}

        <TagAutocomplete
          value={selectedTags}
          onChange={setSelectedTags}
          disabled={loadingAdd || loadingReplace || loadingRemove}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between"
        }}>
        <Button color="inherit" onClick={handleClose}>
          Đóng
        </Button>

        <div
          style={{
            display: "flex",
            gap: 10
          }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleAdd}
            disabled={
              loadingAdd ||
              loadingReplace ||
              loadingRemove ||
              selectedTags.length === 0
            }>
            {loadingAdd ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Add"
            )}
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={handleReplace}
            disabled={loadingAdd || loadingReplace || loadingRemove}>
            {loadingReplace ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Replace"
            )}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleRemove}
            disabled={
              loadingAdd ||
              loadingReplace ||
              loadingRemove ||
              selectedTags.length === 0
            }>
            {loadingRemove ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
