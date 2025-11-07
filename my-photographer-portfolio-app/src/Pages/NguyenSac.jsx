import React, { useEffect, useState } from 'react';
import "../Assets/CSS/NguyenSac.css";
import LightBox from "../utils/LightBox";
import { loadImagesByDir } from '../hooks/loadImagesData';

const NguyenSac = () => {
  const [images, setImages] = useState({}) 

  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index) => {
    const slideList = Object.keys(images).map((key) => ({
      src: images[key],
      title: key
        .replace(/\.(png|jpe?g|svg|webp)$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    setSlides(slideList);
    setStartIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    setImages(loadImagesByDir(require.context(
      '../Assets/Images/showcase/nguyen-sac/webp/',
      false,
      /\.(png|jpe?g|svg|webp)$/
    )))
  }, [])

  return (
    <div className="NguyenSac-container">
      <h1 className="NguyenSac-title">NGUYÊN SẮC</h1>

      {/* --- Top 3 Images (1 row × 3 columns) --- */}
      <div className="NguyenSac-showcase-top">
        {Object.keys(images)
          .slice(0, 3)
          .map((key, index) => (
            <div className="NguyenSac-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="NguyenSac-image-top fade-in"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
      </div>

      {/* --- Bottom Images (each centered) --- */}
      <div className="NguyenSac-showcase-bottom">
        {Object.keys(images)
          .slice(3)
          .map((key, index) => (
            <div className="NguyenSac-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
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
