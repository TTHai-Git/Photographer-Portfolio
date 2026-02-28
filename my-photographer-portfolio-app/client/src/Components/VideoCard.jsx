import { useRef, useState } from "react";
import "../Assets/CSS/VideoCard.css";
import VideoModalPlayer from "./VideoModalPlayer";

export default function VideoCard({ video }) {
  const videoRef = useRef(null);
  const [open, setOpen] = useState(false);

  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const publicId = video.public_id;

  const previewUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:low,br_600k/${publicId}.mp4`;

  const handleMouseEnter = () => {
    videoRef.current.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <>
      <div
        className="video-card"
        onClick={() => setOpen(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={previewUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="video-element"
        />
      </div>

      {open && (
        <VideoModalPlayer
          publicId={publicId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}