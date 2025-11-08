// BoBai.jsx
import { useState } from "react";
import "../Assets/CSS/BoBai.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";

export const BoBai = () => {
  const { images } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/showcase/bo-bai");
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = images.map((image) => ({
      src: image.url,
      title: image.file_name
    }));
    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };


  return (
    <div className="BoBai-container">
      <h1 className="BoBai-title">DEEP CONNECTION VERSION 2</h1>

      {/* --- Top 6 Images: 3 per row --- */}
      <div className="BoBai-showcase-top">
        {images
          .slice(0, 6)
          .map((image, index) => (
            <div className="BoBai-item-top" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="BoBai-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images --- */}
      <div className="BoBai-showcase-bottom">
        {images
          .slice(6)
          .map((image, index) => (
            <div className="BoBai-item-bottom" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="BoBai-image-bottom fade-in"
                onClick={() => handleImageClick(index + 6)}
              />
            </div>
          ))}
      </div>

      {/* --- Lightbox Modal --- */}
      {isOpen && (
        <LightBox
          isOpen={isOpen}
          slides={slides}
          startIndex={startIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default BoBai;
