import { useState } from "react";
import "../Assets/CSS/ShowCase.css";

const ShowCaseItem = ({
  src,
  srcSet,
  folderName,
  onClick,
  width,
  height,
  eager = false,
  alt
}) => {
  const [loaded, setLoaded] = useState(eager);

  const aspectRatio = width && height ? `${width} / ${height}` : "16 / 9";

  return (
    <div className="showcase-item-container">
      {/* Thumbnail with stable aspect-ratio */}
      <div
        className="showcase-thumb"
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: aspectRatio,
          backgroundColor: "#f4f4f4",
          overflow: "hidden",
          cursor: "pointer"
        }}>
        <img
          src={src}
          srcSet={srcSet}
          fetchPriority={eager ? "high" : "auto"}
          loading={eager ? "eager" : "lazy"}
          alt={alt}
          onLoad={() => {
            if (!eager) setLoaded(true);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: loaded ? 1 : 0,
            transition: eager ? "none" : "opacity 0.6s ease-out"
          }}
        />

        {/* Placeholder shimmer */}
        {!loaded && (
          <div
            className="image-shimmer-placeholder"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundSize: "200% 100%",
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%)",
              animation: "shimmer-load 1.5s infinite linear"
            }}
          />
        )}

        {/* Hint Overlay */}
        <div className="showcase-overlay">
          <div className="showcase-overlay-btn">View Collection</div>
        </div>
      </div>

      {/* Meta info remains below the reserved space */}
      <div className="showcase-meta">
        <span className="showcase-owner">{folderName}</span>
      </div>
    </div>
  );
};

export default ShowCaseItem;
