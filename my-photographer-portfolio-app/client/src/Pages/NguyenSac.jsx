import { useState } from 'react';
import "../Assets/CSS/NguyenSac.css";
import LightBox from "../utils/LightBox";
import { useCloudinaryImages } from '../hooks/loadImagesOnCloudinary';

const NguyenSac = () => {
  const { images} = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/showcase/nguyen-sac");

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
    <div className="NguyenSac-container">
      <h1 className="NguyenSac-title">NGUYÊN SẮC</h1>

      {/* --- Top 3 Images (1 row × 3 columns) --- */}
      <div className="NguyenSac-showcase-top">
        {images
          .slice(0, 3)
          .map((image, index) => (
            <div className="NguyenSac-item-top" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="NguyenSac-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images (each centered) --- */}
      <div className="NguyenSac-showcase-bottom">
        {images
          .slice(3)
          .map((image, index) => (
            <div className="NguyenSac-item-bottom" key={image.asset_id}>
              <img
                src={image.url}
                alt={image.file_name}
                className="NguyenSac-image-bottom fade-in"
                onClick={() => handleImageClick(index + 3)}
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

export default NguyenSac;
