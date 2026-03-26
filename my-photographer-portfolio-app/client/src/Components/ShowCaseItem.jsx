import { useState } from "react";
import "../Assets/CSS/ShowCase.css";

const ShowCaseItem = ({ src, alt, folderName, onClick, eager = false }) => {
  // If eager is true, the image is loaded with high priority and without
  // an initial hidden state or transition to eliminate LCP delay.
  const [loaded, setLoaded] = useState(eager);

  return (
    <div className="showcase-card">
      {/* Thumbnail */}
      <div className="showcase-thumb" onClick={onClick}>
        <img
          src={src}
          alt={alt}
          fetchPriority={eager ? "high" : "auto"}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => {
            if (!eager) setLoaded(true);
          }}
          style={{
            opacity: loaded ? 1 : 0,
            transition: eager ? "none" : "opacity 0.6s ease-out",
          }}
        />
      </div>

      {/* Meta */}
      <div className="showcase-meta">
        <span className="showcase-owner">{folderName}</span>
      </div>
    </div>
  );
};

export default ShowCaseItem;
