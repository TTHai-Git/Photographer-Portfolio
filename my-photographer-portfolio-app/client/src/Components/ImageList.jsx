import "../Assets/CSS/images.css";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import UploadImageModal from "./UploadImageModal";
import { useNotification } from "../Context/NotificationContext";
import { MoveImageModal } from "./MoveImageModal";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { authApi, endpoints } from "../config/APIs";

export default function ImageList({
  foldersForCombobox,
  loadFoldersForCombobox,
  selectedFolder,
  images,
  loading,
  loadImages,
  imageParams,
  setImageParams,
  sortFileds,
}) {
  const [oldPublicIds, setOldPublicIds] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { showNotification } = useNotification();

  const updateParams = (key, val) => {
    setImageParams((prev) => ({
      ...prev,
      page: 1,
      [key]: val,
    }));
  };

  const handleDelete = async () => {
    if (!oldPublicIds.length) return;
    if (!window.confirm("Bạn có muốn xóa các ảnh không?")) return;

    try {
      setLoadingDelete(true);

      const res = await authApi.delete(endpoints.deleteImages, {
        data: { public_ids: oldPublicIds, selectedFolder },
      });

      showNotification(res.data.message, "success");
    } catch (err) {
      showNotification(err.response?.data?.message, "error");
    } finally {
      setOldPublicIds([]);
      setLoadingDelete(false);
      loadImages();
      loadFoldersForCombobox();
    }
  };

  if (!selectedFolder) return <p>Vui lòng chọn thư mục</p>;

  return (
    <div className="content">
      <h3>Đường dẫn đang chọn: {selectedFolder}</h3>

      <div className="image-section-header">
        <div className="image-section-header-left">
          <button className="btn btn-green" onClick={() => setOpenUpload(true)}>
            + Tải ảnh lên
          </button>

          <button className="btn btn-primary" onClick={() => setOpenMove(true)}>
            + Di chuyển ảnh ({oldPublicIds.length})
          </button>

          {images.length > 0 && (
            <button
              className="btn btn-red"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Đang xóa..." : <><FaTrash /> Xóa ({oldPublicIds.length})</>}
            </button>
          )}
        </div>

        <div>
          <Autocomplete
            disablePortal
            options={sortFileds}
            value={sortFileds.find((o) => o.id === imageParams.sortImages) || null}
            onChange={(e, v) => updateParams("sortImages", v?.id || "")}
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
      </div>
      {loading ? (
        <div className="images-grid">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="image-skeleton"></div>
        ))}
      </div>
      ) : (
        <div className="images-grid">
        {images.map((img) => (
          <div key={img.public_id} className="image-item">
            <input
              type="checkbox"
              checked={oldPublicIds.includes(img.public_id)}
              onChange={() =>
                setOldPublicIds((prev) =>
                  prev.includes(img.public_id)
                    ? prev.filter((x) => x !== img.public_id)
                    : [...prev, img.public_id]
                )
              }
            />

            <img src={img.optimized_url} alt="" />
          </div>
        ))}
      </div>
      )}
      

      <UploadImageModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        selectedFolder={selectedFolder}
        loadImages={loadImages}
        folders={foldersForCombobox}
        loadFoldersForCombobox={loadFoldersForCombobox}
      />

      <MoveImageModal
        open={openMove}
        onClose={() => setOpenMove(false)}
        folders={foldersForCombobox}
        loadFoldersForCombobox={loadFoldersForCombobox}
        selectedFolder={selectedFolder}
        oldPublicIds={oldPublicIds}
        setOldPublicIds={setOldPublicIds}
        loadImages={loadImages}
      />
    </div>
  );
}
