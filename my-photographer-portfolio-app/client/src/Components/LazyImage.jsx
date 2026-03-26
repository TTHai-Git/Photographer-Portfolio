import { useState, useCallback } from "react";

const LazyImage = ({ src, alt, onClick, className, width, height }) => {
  const [loaded, setLoaded] = useState(false);

  // Calculate aspect ratio for the placeholder container
  // This prevents CLS by reserving the correct space before the image loads
  const hasKnownDimensions = width && height;
  const aspectRatio = hasKnownDimensions ? `${width} / ${height}` : "4 / 5";

  const handleLoad = useCallback((e) => {
    // Once loaded, update the container's aspect-ratio to match the real image
    const img = e.target;
    const container = img.parentElement;
    if (container && img.naturalWidth && img.naturalHeight) {
      container.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
    setLoaded(true);
  }, []);

  return (
    <div
      className="lazy-image-wrapper"
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: aspectRatio,
        overflow: "hidden",
        backgroundColor: "#eaeaea",
        borderRadius: "2px",
      }}>
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className={className}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      />

      {/* Shimmer placeholder — visible until image loads */}
      {!loaded && (
        <div
          className="lazy-image-placeholder"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #eaeaea 25%, #f5f5f5 50%, #eaeaea 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyImage;

