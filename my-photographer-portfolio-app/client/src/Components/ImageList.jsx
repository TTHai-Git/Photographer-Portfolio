import "../Assets/CSS/images.css"
import { FaTrash } from "react-icons/fa";
import APIs, { endpoints } from "../config/APIs";
import { useState } from "react";
import UploadImageModal from "./UploadImageModal";
export default function ImageList({folders, selectedFolder, images, loading, actionImagesLoading, setActionImagesLoading, loadImages }) {
  const [publicIDS, setPublicIDS] = useState([])
  const [openUpload, setOpenUpload] = useState(false);

  const handleDeletedImages = async (public_ids) => {
      // console.log("public_ids", public_ids)
      try {
        setActionImagesLoading(true)
        const res = await APIs.delete(endpoints.deleteImages,{
          data: {public_ids,selectedFolder}
        })
        if (res.status === 200) alert(res.data.message)

      } catch (error) {
        console.log(error)
      } finally {
        setActionImagesLoading(false)
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
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="image-skeleton"></div>
        ))}
      </div>
    );
  }

  // if (images.length === 0) return <p>No images found.</p>;


  return (
  <div className="content">
    {selectedFolder && (
      <div className="image-section-header">
        <h3>Folder: {selectedFolder}</h3>

        <button
          className="btn btn-green"
          onClick={() => setOpenUpload(true)}
        >
          Upload
        </button>

       {images.length !== 0 ?  <button
          className="btn btn-red"
          onClick={() => handleDeletedImages(publicIDS)}
          disabled={actionImagesLoading}
        >
          {actionImagesLoading ? (
            <span className="spinner" />
          ) : (
            <>
              <FaTrash /> Delete Images ({publicIDS.length})
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

            <div className="image-delete-btn">
              <FaTrash />
            </div>

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
      actionImagesLoading={actionImagesLoading}
      setActionImagesLoading={setActionImagesLoading}
      loadImages={loadImages}
      onClose={() => setOpenUpload(false)}
    />
  </div>
);

}
