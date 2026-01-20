import { useRef } from "react";

const ShowCaseItem = ({ src, alt, folderName, onClick }) => {
  const imgRef = useRef();

  return (
    <div className="showcase-card">
      {/* Thumbnail */}
      <div
        ref={imgRef}
        className="showcase-thumb"
        onClick={onClick}
      >
        <img src={src} alt={alt} />
      </div>

      {/* Meta */}
      <div className="showcase-meta">
        {/* <p className="showcase-title">{folderName}</p> */}
        <span className="showcase-owner">{folderName}</span>
      </div>
    </div>
  );
};

export default ShowCaseItem;
