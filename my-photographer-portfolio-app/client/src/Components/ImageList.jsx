import "../Assets/CSS/images.css"
import { FaTrash } from "react-icons/fa";
import APIs, { authApi, endpoints } from "../config/APIs";
import { useState } from "react";
import UploadImageModal from "./UploadImageModal";
import { useNotification } from "../Context/NotificationContext";
import { MoveImageModal } from "./MoveImageModal";
export default function ImageList({folders, selectedFolder, images, loading, loadImages }) {
  const [publicIDS, setPublicIDS] = useState([])
  const [openUpload, setOpenUpload] = useState(false);
  const [openMove, setOpenMove] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const {showNotification} = useNotification()

  const handleDeletedImages = async (public_ids) => {
      // console.log("public_ids", public_ids)
      try {
        setLoadingDelete(true)
        if(!window.confirm("Bạn có muốn xóa các ảnh không?")) return
        // const res = await APIs.delete(endpoints.deleteImages,{
        //   data: {public_ids,selectedFolder}
        // })
        const res = await authApi.delete(endpoints.deleteImages,{
          data: {public_ids,selectedFolder}
        })
        if (res.status === 200) {
          showNotification(res.data.message, "success")
          await loadImages()
        }

      } catch (error) {
        console.log(error)
        showNotification (error.response.data.message, "error")
      } finally {
        setLoadingDelete(false)
        setPublicIDS([])
        await loadImages()
      }
  }

  const handleAddPublicIDS = (id) => {
    setPublicIDS((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="images-grid">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="image-skeleton"></div>
        ))}
      </div>
    );
  }

  // if (images.length === 0) return <p>No images found.</p>;


  return (
  <div className="content">
    <h3>Đường dẫn thư mục đang chọn: {selectedFolder}</h3>
    {selectedFolder && (
      
      <div className="image-section-header">
        

        <button
          className="btn btn-green"
          onClick={() => setOpenUpload(true)}
        >
          + Tải ảnh lên
        </button>

         <button
          className="btn btn-primary"
          onClick={() => setOpenMove(true)}
        >
          + Di Chuyển ảnh ({publicIDS.length})
        </button>

       {images.length !== 0 ?  <button
          className="btn btn-red"
          onClick={() => handleDeletedImages(publicIDS)}
          disabled={loadingDelete}
        >
          {loadingDelete ? <>
            <span>Đang xóa ảnh...</span>
            <span className="spinner-btn" />
          </> : (
            <>
              <FaTrash /> Xóa ảnh ({publicIDS.length})
            </>
          )}
        </button> :<></> }
      </div>
    )}

    {/* Check images length here */}
    {images.length === 0 ? (
      <p>No images found.</p>
    ) : (
      <div className="images-grid">
        {images.map((img) => (
          <div className="image-card" key={img.public_id}>
            <input
              type="checkbox"
              value={img.public_id}
              onClick={(e) => {
                e.stopPropagation();
                handleAddPublicIDS(img.public_id);
              }}
            />
            {/* <div className="image-delete-btn">
              <FaTrash  />
            </div> */}
            <img
              src={img.optimized_url}
              className="image-thumb"
              alt={img.public_id}
            />
          </div>
        ))}
      </div>
    )}

    {/* Modals */}
    <UploadImageModal
      open={openUpload}
      folders={folders}
      loadImages={loadImages}
      onClose={() => setOpenUpload(false)}
    />

    <MoveImageModal
      open={openMove}
      folders={folders}
      oldPublicIds={publicIDS}
      setOldPublicIds={setPublicIDS}
      loadImages={loadImages}
      onClose={() => setOpenMove(false)}
    />
  </div>
);

}
