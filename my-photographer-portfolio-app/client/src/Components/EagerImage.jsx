import { useState } from "react";
import {
  buildCloudinaryOptimizedUrl,
  DEFAULT_PORTFOLIO_IMAGE_SIZE,
  getFixedAspectRatio
} from "../Helpers/cloudinaryImage";

/**
 * EagerImage — for above-the-fold (LCP) images.
 * - Loads immediately with fetchPriority="high" + loading="eager"
 * - Shows a shimmer placeholder until bytes arrive
 * - Fades in via opacity transition on onLoad
 */
const EagerImage = ({
  src,
  alt,
  onClick,
  width = DEFAULT_PORTFOLIO_IMAGE_SIZE.width,
  height = DEFAULT_PORTFOLIO_IMAGE_SIZE.height
}) => {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = getFixedAspectRatio(width, height);
  const optimizedSrc = buildCloudinaryOptimizedUrl(src, { width, height });

  return (
    <div
      className="eager-image-wrapper"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        backgroundColor: "#eaeaea",
        overflow: "hidden",
      }}>
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        onClick={onClick}
        fetchPriority="high"
        loading="eager"
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
          transition: "opacity 0.5s ease-out",
        }}
      />

      {/* Shimmer placeholder visible until image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #eaeaea 25%, #f5f5f5 50%, #eaeaea 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};

export default EagerImage;
