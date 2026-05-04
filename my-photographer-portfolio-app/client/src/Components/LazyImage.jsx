import { useState } from "react";
const LazyImage = ({ src, alt, onClick, width, height, className, srcSet, sizes }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="lazy-image-wrapper"
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
        overflow: "hidden",
        backgroundColor: "#f4f4f4",
        borderRadius: "2px",
      }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        srcSet={srcSet}
        sizes={sizes}
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
