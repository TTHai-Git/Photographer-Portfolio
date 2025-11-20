import { useRef } from "react";

const ShowCaseItem = ({ src, alt, onClick, className }) => {
  const imgRef = useRef();

  return (
    <div
      ref={imgRef}
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "50%", // <-- aspect ratio (3:2 example)
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};
export default ShowCaseItem
