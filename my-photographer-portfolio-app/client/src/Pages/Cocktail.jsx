import { useEffect, useState } from "react";
import "../Assets/CSS/Cocktail.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from "../hooks/loadImagesOnCloudinary";

const Cocktail = () => {
  const { images, loading, count } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/showcase/verdant-cocktail-bar");

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
    <div className="Cocktail-container">
      <h1 className="Cocktail-title">VERDANT COCKTAIL BAR</h1>

      {/* --- Top 8 Images (2 rows × 4 columns) --- */}
      <div className="Cocktail-showcase-top">
        {images
          .slice(0, 8)
          .map((image, index) => (
            <div className="Cocktail-item-top" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="Cocktail-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Content Section --- */}
      <h2 className="Cocktail-content">
        content
      </h2>

      {/* --- Bottom 2 Images (each centered) --- */}
      <div className="Cocktail-showcase-bottom">
        {images
          .slice(8)
          .map((image, index) => (
            <div className="Cocktail-item-bottom" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="Cocktail-image-bottom fade-in"
                onClick={() => handleImageClick(index + 8)}
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

export default Cocktail;
