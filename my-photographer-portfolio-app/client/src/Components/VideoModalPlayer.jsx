import { useEffect, useRef } from "react";
import "../Assets/CSS/VideoModalPlayer.css";

export default function VideoModalPlayer({ publicId, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;

  useEffect(() => {
    const video = videoRef.current;

    const streamUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}.mp4`;

    video.src = streamUrl;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [publicId]);

  const handleOutsideClick = (e) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      className="modal-container"
      onClick={handleOutsideClick}
    >
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <video
          ref={videoRef}
          controls
          preload="auto"
          className="modal-video"
        />
      </div>
    </div>
  );
}