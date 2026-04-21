import { useState } from "react";
import {
  buildCloudinaryOptimizedUrl,
  DEFAULT_PORTFOLIO_IMAGE_SIZE,
  getFixedAspectRatio
} from "../Helpers/cloudinaryImage";

/**
 * LazyImage — for below-the-fold images.
 * - Saves bandwidth by loading only when near viewport
 * - Prevents CLS by reserving space using width/height metadata
 */
const LazyImage = ({
  src,
  alt,
  onClick,
  width = DEFAULT_PORTFOLIO_IMAGE_SIZE.width,
  height = DEFAULT_PORTFOLIO_IMAGE_SIZE.height,
  className
}) => {
  const [loaded, setLoaded] = useState(false);

  // Reserve space with fixed portfolio ratio to prevent CLS
  const aspectRatio = getFixedAspectRatio(width, height);
  const optimizedSrc = buildCloudinaryOptimizedUrl(src, { width, height });

  return (
    <div
      className="lazy-image-wrapper"
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: aspectRatio,
        overflow: "hidden",
        backgroundColor: "#f4f4f4",
        borderRadius: "2px",
      }}>
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        onClick={onClick}
        className={className}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          setLoaded(true);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      />

      {/* Placeholder with shimmer animation */}
      {!loaded && (
        <div
          className="lazy-image-placeholder"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "200% 100%",
            background: "linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%)",
            animation: "shimmer-load 1.5s infinite linear",
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
