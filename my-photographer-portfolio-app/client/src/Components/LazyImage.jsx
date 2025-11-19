import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, onClick, className }) => {
  const imgRef = useRef();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      style={{ minHeight: 200, width: "100%", position: "relative" }}
    >
      {visible && (
        <img
          src={src}
          alt={alt}
          onClick={onClick}
          className={className}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "auto",
            opacity: loaded ? 1 : 0,
            transition: "opacity .3s ease"
          }}
        />
      )}

      {/* Blur placeholder */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#e1e1e1",
            filter: "blur(10px)"
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
